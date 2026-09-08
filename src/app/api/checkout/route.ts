import { z } from "zod";
import { NextResponse } from "next/server";
import {
  calcDeliveryFeeFromMiles,
  KITCHEN_ORIGIN,
} from "@/lib/constants";
import { dollarsToCents, priceOrder } from "@/lib/pricing";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";
import {
  getDrivingDistanceMiles,
  getPlaceCoords,
} from "@/lib/google-maps";
import { createOrder, updateOrder } from "@/lib/orders-store";

const bodySchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email(),
  deliveryAddress: z.string().min(5),
  placeId: z.string().min(3),
  eventAt: z.string().min(1),
  notes: z.string().optional(),
  trays: z
    .array(
      z.object({
        itemId: z.string(),
        size: z.enum(["small", "large"]),
        useAlt: z.boolean().optional(),
      })
    )
    .default([]),
  comboId: z.string().optional(),
  addonIds: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order details", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const place = await getPlaceCoords(data.placeId);
    const distance = await getDrivingDistanceMiles(
      { lat: KITCHEN_ORIGIN.lat, lng: KITCHEN_ORIGIN.lng },
      { lat: place.lat, lng: place.lng }
    );
    const quote = calcDeliveryFeeFromMiles(distance.miles);
    if (!quote.allowed) {
      return NextResponse.json(
        { error: quote.reason || "Delivery not available for this address" },
        { status: 400 }
      );
    }

    const priced = priceOrder({
      trays: data.trays,
      comboId: data.comboId || undefined,
      addonIds: data.addonIds,
      deliveryFee: quote.fee,
    });

    const depositCents = dollarsToCents(priced.depositAmount);
    if (depositCents < 50) {
      return NextResponse.json(
        { error: "Deposit amount is too low for Stripe checkout" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = getAppBaseUrl();
    const address = place.formattedAddress || data.deliveryAddress;

    const summary = priced.lines
      .map((line) => `${line.name}: $${line.lineTotal.toFixed(2)}`)
      .join(" | ");

    const order = await createOrder({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      deliveryAddress: address,
      placeId: place.placeId,
      deliveryMiles: distance.miles,
      eventAt: data.eventAt,
      deliveryFee: priced.deliveryFee,
      notes: data.notes || "",
      items: priced.lines.map((line) => ({
        itemId: line.key,
        name: line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
      })),
      subtotal: priced.subtotal,
      total: priced.total,
      depositPercent: priced.depositPercent,
      depositAmount: priced.depositAmount,
      balanceDue: priced.balanceDue,
      amountPaid: 0,
      status: "pending",
      adminNotes: "",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.customerEmail,
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/schedule?canceled=1`,
      phone_number_collection: { enabled: true },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: depositCents,
            product_data: {
              name: `Girlie's Kitchen catering deposit (${priced.depositPercent}%)`,
              description: `Order total $${priced.total.toFixed(2)}. Balance due $${priced.balanceDue.toFixed(2)}. Delivery $${priced.deliveryFee.toFixed(2)} (${distance.miles} mi).`,
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        deliveryAddress: address.slice(0, 450),
        placeId: place.placeId,
        deliveryMiles: String(distance.miles),
        deliveryFee: String(priced.deliveryFee),
        eventAt: data.eventAt,
        notes: (data.notes || "").slice(0, 450),
        depositPercent: String(priced.depositPercent),
        depositAmount: String(priced.depositAmount),
        orderTotal: String(priced.total),
        balanceDue: String(priced.balanceDue),
        lineSummary: summary.slice(0, 450),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 }
      );
    }

    await updateOrder(order.id, {
      stripeCheckoutSessionId: session.id,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
      depositAmount: priced.depositAmount,
      depositPercent: priced.depositPercent,
      total: priced.total,
      deliveryFee: priced.deliveryFee,
      miles: distance.miles,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

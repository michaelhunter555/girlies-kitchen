import { z } from "zod";
import { NextResponse } from "next/server";
import { dollarsToCents, priceOrder } from "@/lib/pricing";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";
import { DELIVERY_FEES } from "@/lib/constants";

const bodySchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email(),
  deliveryAddress: z.string().min(5),
  eventAt: z.string().min(1),
  notes: z.string().optional(),
  deliveryZoneId: z.enum(
    DELIVERY_FEES.map((d) => d.id) as [string, ...string[]]
  ),
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
    const priced = priceOrder({
      trays: data.trays,
      comboId: data.comboId || undefined,
      addonIds: data.addonIds,
      deliveryZoneId: data.deliveryZoneId,
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

    const summary = priced.lines
      .map((line) => `${line.name}: $${line.lineTotal.toFixed(2)}`)
      .join(" | ");

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
              description: `Order total $${priced.total.toFixed(2)}. Balance due $${priced.balanceDue.toFixed(2)}. Delivery fee $${priced.deliveryFee.toFixed(2)}.`,
            },
          },
        },
      ],
      metadata: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        deliveryAddress: data.deliveryAddress.slice(0, 450),
        eventAt: data.eventAt,
        notes: (data.notes || "").slice(0, 450),
        deliveryZoneId: data.deliveryZoneId,
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

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      depositAmount: priced.depositAmount,
      depositPercent: priced.depositPercent,
      total: priced.total,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

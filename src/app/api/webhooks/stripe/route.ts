import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  getOrderByStripeSession,
  updateOrder,
} from "@/lib/orders-store";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const order =
      (session.metadata?.orderId
        ? await import("@/lib/orders-store").then((m) =>
            m.getOrderById(session.metadata!.orderId!)
          )
        : null) || (await getOrderByStripeSession(session.id));

    if (order) {
      const paid = (session.amount_total || 0) / 100;
      await updateOrder(order.id, {
        status: "deposit_paid",
        amountPaid: paid,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}

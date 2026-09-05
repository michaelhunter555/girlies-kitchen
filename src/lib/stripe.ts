import Stripe from "stripe";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

let stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export function getAppBaseUrl() {
  return (
    process.env.STRIPE_TEST_SECURE_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3001"
  );
}

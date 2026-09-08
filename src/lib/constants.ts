export const BUSINESS = {
  name: "Girlie's Kitchen",
  tagline: "Jamaican Cuisine",
  phone: "443-467-0970",
  phoneHref: "tel:4434670970",
  location: "Belcamp, MD",
  email: "orders@girlieskitchen.com",
} as const;

export const DEPOSIT = {
  standardPercent: 50,
  premiumPercent: 75,
  premiumKeywords: ["oxtail", "goat", "fish"],
} as const;

/** Kitchen origin for delivery distance (Belcamp, MD area). */
export const KITCHEN_ORIGIN = {
  lat: 39.4757,
  lng: -76.2441,
  label: "Belcamp, MD",
} as const;

/**
 * Delivery pricing: $2 per driving mile from kitchen.
 * Min fee keeps short trips worthwhile; max caps extreme distances.
 */
export const DELIVERY_PRICING = {
  ratePerMile: 2,
  minimumFee: 15,
  maximumFee: 120,
  maximumMiles: 60,
} as const;

/** Brochure tiers kept for reference / marketing copy. */
export const DELIVERY_FEES = [
  { id: "near", label: "Within 10 miles", fee: 25 },
  { id: "mid", label: "11 to 20 miles", fee: 40 },
  { id: "baltimore", label: "Baltimore", fee: 60 },
] as const;

export function calcDeliveryFeeFromMiles(miles: number) {
  const { ratePerMile, minimumFee, maximumFee, maximumMiles } = DELIVERY_PRICING;
  if (miles > maximumMiles) {
    return {
      allowed: false as const,
      miles,
      fee: 0,
      reason: `Delivery is limited to about ${maximumMiles} miles from ${KITCHEN_ORIGIN.label}. Call us to discuss farther orders.`,
    };
  }
  const raw = miles * ratePerMile;
  const fee =
    Math.round(Math.min(maximumFee, Math.max(minimumFee, raw)) * 100) / 100;
  return { allowed: true as const, miles, fee, reason: null as string | null };
}

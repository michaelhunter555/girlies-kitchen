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

export const DELIVERY_FEES = [
  { id: "near", label: "Within 10 miles", fee: 25 },
  { id: "mid", label: "11 to 20 miles", fee: 40 },
  { id: "baltimore", label: "Baltimore", fee: 60 },
] as const;

export type TraySize = "small" | "large";

export type MenuItem = {
  id: string;
  name: string;
  category: "protein" | "side" | "pasta";
  prices: { small: number; large: number };
  /** Optional alternate price pair (e.g. Rasta Pasta with chicken) */
  alt?: { label: string; prices: { small: number; large: number } };
  premiumDeposit?: boolean;
  image?: string;
};

export type Combo = {
  id: string;
  name: string;
  size: "small" | "large";
  description: string;
  price: number;
};

export type Addon = {
  id: string;
  name: string;
  price: number;
};

export const TRAY_NOTE =
  "Small = Half Pan (serves 10-12). Large = Full Pan (serves 20-24). All trays include a lid and a spoon.";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "jerk-chicken",
    name: "Jerk Chicken",
    category: "protein",
    prices: { small: 150, large: 275 },
    image: "/menu/jerk-chicken.png",
  },
  {
    id: "curry-chicken",
    name: "Curry Chicken",
    category: "protein",
    prices: { small: 140, large: 255 },
    image: "/menu/curry-chicken.png",
  },
  {
    id: "brown-stew-chicken",
    name: "Brown Stew Chicken",
    category: "protein",
    prices: { small: 145, large: 265 },
  },
  {
    id: "curry-goat",
    name: "Curry Goat",
    category: "protein",
    prices: { small: 225, large: 410 },
    premiumDeposit: true,
  },
  {
    id: "oxtail",
    name: "Oxtail with Broad Beans",
    category: "protein",
    prices: { small: 255, large: 460 },
    premiumDeposit: true,
  },
  {
    id: "escovitch-fish",
    name: "Escovitch Fish Fillet",
    category: "protein",
    prices: { small: 195, large: 355 },
    premiumDeposit: true,
    image: "/menu/escovitch-fish.png",
  },
  {
    id: "rasta-pasta",
    name: "Rasta Pasta (plain)",
    category: "pasta",
    prices: { small: 120, large: 220 },
    alt: {
      label: "with chicken",
      prices: { small: 160, large: 300 },
    },
    image: "/menu/rasta-pasta.png",
  },
  {
    id: "rice-and-peas",
    name: "Rice and Peas",
    category: "side",
    prices: { small: 85, large: 155 },
    image: "/menu/rice-and-peas.png",
  },
  {
    id: "steam-cabbage",
    name: "Steam Cabbage",
    category: "side",
    prices: { small: 85, large: 155 },
    image: "/menu/steam-cabbage.png",
  },
  {
    id: "fried-plantains",
    name: "Fried Plantains",
    category: "side",
    prices: { small: 45, large: 85 },
  },
];

export const MENU_WITH_IMAGES = MENU_ITEMS.filter((item) => item.image);

export const COMBOS: Combo[] = [
  {
    id: "small-1-protein",
    name: "Small Combo",
    size: "small",
    description: "1 Protein + Rice & Peas + Cabbage",
    price: 290,
  },
  {
    id: "small-2-protein",
    name: "Small Combo",
    size: "small",
    description: "2 Proteins + Rice & Peas + Cabbage + Rasta Pasta",
    price: 520,
  },
  {
    id: "large-1-protein",
    name: "Large Combo",
    size: "large",
    description: "1 Protein + Rice & Peas + Cabbage",
    price: 530,
  },
];

export const ADDONS: Addon[] = [
  { id: "jerk-sauce", name: "Extra Jerk Sauce", price: 15 },
  { id: "escovitch-sauce", name: "Extra Escovitch Sauce", price: 20 },
  { id: "festival", name: "Festival (12 pcs)", price: 25 },
];

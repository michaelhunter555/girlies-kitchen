import { ADDONS, COMBOS, MENU_ITEMS, type TraySize } from "@/lib/menu";
import { DELIVERY_FEES, DEPOSIT } from "@/lib/constants";

export type CheckoutSelection = {
  trays: Array<{
    itemId: string;
    size: TraySize;
    /** Use alternate price (e.g. Rasta Pasta with chicken) */
    useAlt?: boolean;
  }>;
  comboId?: string;
  addonIds?: string[];
  deliveryZoneId: string;
};

export type PricedLine = {
  key: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  premiumDeposit?: boolean;
};

export type PricedOrder = {
  lines: PricedLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  premium: boolean;
  depositPercent: number;
  depositAmount: number;
  balanceDue: number;
};

/** Recalculate all money from static brochure prices. Never trust client totals. */
export function priceOrder(selection: CheckoutSelection): PricedOrder {
  const lines: PricedLine[] = [];
  let premium = false;

  for (const tray of selection.trays) {
    const item = MENU_ITEMS.find((m) => m.id === tray.itemId);
    if (!item) {
      throw new Error(`Unknown menu item: ${tray.itemId}`);
    }

    const size = tray.size === "large" ? "large" : "small";
    let unitPrice = item.prices[size];
    let name = `${item.name} (${size})`;

    if (tray.useAlt) {
      if (!item.alt) {
        throw new Error(`Item ${item.id} has no alternate price`);
      }
      unitPrice = item.alt.prices[size];
      name = `${item.name} ${item.alt.label} (${size})`;
    }

    if (item.premiumDeposit) premium = true;

    lines.push({
      key: `tray:${item.id}:${size}:${tray.useAlt ? "alt" : "base"}`,
      name,
      unitPrice,
      quantity: 1,
      lineTotal: unitPrice,
      premiumDeposit: item.premiumDeposit,
    });
  }

  if (selection.comboId) {
    const combo = COMBOS.find((c) => c.id === selection.comboId);
    if (!combo) {
      throw new Error(`Unknown combo: ${selection.comboId}`);
    }
    lines.push({
      key: `combo:${combo.id}`,
      name: `${combo.name}: ${combo.description}`,
      unitPrice: combo.price,
      quantity: 1,
      lineTotal: combo.price,
    });
  }

  for (const addonId of selection.addonIds ?? []) {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (!addon) {
      throw new Error(`Unknown add-on: ${addonId}`);
    }
    lines.push({
      key: `addon:${addon.id}`,
      name: addon.name,
      unitPrice: addon.price,
      quantity: 1,
      lineTotal: addon.price,
    });
  }

  const delivery = DELIVERY_FEES.find((d) => d.id === selection.deliveryZoneId);
  if (!delivery) {
    throw new Error(`Unknown delivery zone: ${selection.deliveryZoneId}`);
  }

  if (lines.length === 0) {
    throw new Error("Select at least one tray, combo, or add-on");
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const deliveryFee = delivery.fee;
  const total = subtotal + deliveryFee;
  const depositPercent = premium
    ? DEPOSIT.premiumPercent
    : DEPOSIT.standardPercent;
  const depositAmount = Math.round(total * (depositPercent / 100) * 100) / 100;
  const balanceDue = Math.round((total - depositAmount) * 100) / 100;

  return {
    lines,
    subtotal,
    deliveryFee,
    total,
    premium,
    depositPercent,
    depositAmount,
    balanceDue,
  };
}

export function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

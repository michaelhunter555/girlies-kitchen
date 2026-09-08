import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  CateringOrder,
  CreateOrderInput,
  OrderStatus,
} from "@/lib/order-types";

export type {
  CateringOrder,
  CreateOrderInput,
  OrderItem,
  OrderStatus,
} from "@/lib/order-types";
export { ORDER_STATUSES } from "@/lib/order-types";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    const seed = buildSeedOrders();
    await fs.writeFile(ORDERS_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readOrders(): Promise<CateringOrder[]> {
  await ensureStore();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CateringOrder[]) : [];
  } catch {
    return [];
  }
}

async function writeOrders(orders: CateringOrder[]) {
  await ensureStore();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function buildSeedOrders(): CateringOrder[] {
  const now = new Date();
  const event = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5);
  return [
    {
      id: randomUUID(),
      customerName: "Sample Customer",
      customerPhone: "443-555-0100",
      customerEmail: "sample@example.com",
      deliveryAddress: "Baltimore, MD, USA",
      placeId: "ChIJt4P01q4DyIkRWOcjQqiWSAQ",
      deliveryMiles: 26.3,
      eventAt: event.toISOString(),
      deliveryFee: 52.6,
      notes: "Demo order so the CRM is not empty. Safe to delete.",
      items: [
        {
          itemId: "jerk-chicken",
          name: "Jerk Chicken (large)",
          size: "large",
          quantity: 1,
          unitPrice: 275,
          lineTotal: 275,
        },
        {
          itemId: "rice-and-peas",
          name: "Rice and Peas (large)",
          size: "large",
          quantity: 1,
          unitPrice: 155,
          lineTotal: 155,
        },
      ],
      subtotal: 430,
      total: 482.6,
      depositPercent: 50,
      depositAmount: 241.3,
      balanceDue: 241.3,
      amountPaid: 241.3,
      status: "deposit_paid",
      adminNotes: "",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
}

export async function listOrders(filters?: {
  status?: OrderStatus | "all";
  q?: string;
}) {
  let orders = await readOrders();
  orders = orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (filters?.status && filters.status !== "all") {
    orders = orders.filter((o) => o.status === filters.status);
  }

  if (filters?.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    orders = orders.filter((o) =>
      [
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.deliveryAddress,
        o.id,
        o.notes || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  return orders;
}

export async function getOrderById(id: string) {
  const orders = await readOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function getOrderByStripeSession(sessionId: string) {
  const orders = await readOrders();
  return orders.find((o) => o.stripeCheckoutSessionId === sessionId) || null;
}

export async function createOrder(input: CreateOrderInput) {
  const orders = await readOrders();
  const now = new Date().toISOString();
  const order: CateringOrder = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function updateOrder(
  id: string,
  patch: Partial<
    Pick<
      CateringOrder,
      | "status"
      | "amountPaid"
      | "adminNotes"
      | "notes"
      | "stripePaymentIntentId"
      | "stripeCheckoutSessionId"
    >
  >
) {
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index < 0) return null;

  const updated: CateringOrder = {
    ...orders[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  orders[index] = updated;
  await writeOrders(orders);
  return updated;
}

export async function getDashboardStats() {
  const orders = await listOrders();
  const active = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "completed"
  );
  const depositPaid = orders.filter((o) => o.status === "deposit_paid").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const revenuePaid = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const outstanding = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "completed")
    .reduce((sum, o) => sum + Math.max(0, o.total - o.amountPaid), 0);

  return {
    totalOrders: orders.length,
    activeOrders: active.length,
    depositPaid,
    confirmed,
    revenuePaid: Math.round(revenuePaid * 100) / 100,
    outstanding: Math.round(outstanding * 100) / 100,
    upcoming: orders
      .filter((o) => o.status !== "cancelled" && o.status !== "completed")
      .sort(
        (a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime()
      )
      .slice(0, 5),
  };
}

import "server-only";

import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/models/Order";
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

type OrderDoc = {
  _id: { toString(): string };
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  placeId?: string;
  deliveryMiles?: number;
  eventAt: Date | string;
  deliveryFee: number;
  notes?: string;
  items: CateringOrder["items"];
  subtotal: number;
  total: number;
  depositPercent: number;
  depositAmount: number;
  balanceDue: number;
  amountPaid: number;
  status: OrderStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  adminNotes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function serializeOrder(doc: OrderDoc): CateringOrder {
  return {
    id: doc._id.toString(),
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    customerEmail: doc.customerEmail,
    deliveryAddress: doc.deliveryAddress,
    placeId: doc.placeId,
    deliveryMiles: doc.deliveryMiles,
    eventAt: toIso(doc.eventAt),
    deliveryFee: doc.deliveryFee,
    notes: doc.notes || "",
    items: doc.items || [],
    subtotal: doc.subtotal,
    total: doc.total,
    depositPercent: doc.depositPercent,
    depositAmount: doc.depositAmount,
    balanceDue: doc.balanceDue,
    amountPaid: doc.amountPaid,
    status: doc.status,
    stripeCheckoutSessionId: doc.stripeCheckoutSessionId,
    stripePaymentIntentId: doc.stripePaymentIntentId,
    adminNotes: doc.adminNotes || "",
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt),
  };
}

export async function listOrders(filters?: {
  status?: OrderStatus | "all";
  q?: string;
}) {
  await connectMongo();

  const query: Record<string, unknown> = {};
  if (filters?.status && filters.status !== "all") {
    query.status = filters.status;
  }

  if (filters?.q?.trim()) {
    const q = filters.q.trim();
    query.$or = [
      { customerName: { $regex: q, $options: "i" } },
      { customerEmail: { $regex: q, $options: "i" } },
      { customerPhone: { $regex: q, $options: "i" } },
      { deliveryAddress: { $regex: q, $options: "i" } },
      { notes: { $regex: q, $options: "i" } },
    ];
  }

  const docs = await Order.find(query).sort({ createdAt: -1 }).lean();
  return (docs as unknown as OrderDoc[]).map(serializeOrder);
}

export async function getOrderById(id: string) {
  await connectMongo();
  if (!id || !/^[a-f\d]{24}$/i.test(id)) return null;
  const doc = await Order.findById(id).lean();
  if (!doc) return null;
  return serializeOrder(doc as unknown as OrderDoc);
}

export async function getOrderByStripeSession(sessionId: string) {
  await connectMongo();
  const doc = await Order.findOne({ stripeCheckoutSessionId: sessionId }).lean();
  if (!doc) return null;
  return serializeOrder(doc as unknown as OrderDoc);
}

export async function createOrder(input: CreateOrderInput) {
  await connectMongo();
  const created = await Order.create({
    ...input,
    eventAt: new Date(input.eventAt),
    notes: input.notes || "",
    adminNotes: input.adminNotes || "",
  });
  return serializeOrder(created.toObject() as unknown as OrderDoc);
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
  await connectMongo();
  if (!id || !/^[a-f\d]{24}$/i.test(id)) return null;

  const updated = await Order.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true }
  ).lean();

  if (!updated) return null;
  return serializeOrder(updated as unknown as OrderDoc);
}

export async function getDashboardStats() {
  await connectMongo();
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

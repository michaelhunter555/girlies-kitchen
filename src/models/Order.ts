import mongoose, { Schema, models, model } from "mongoose";

export type OrderStatus =
  | "pending"
  | "deposit_paid"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface IOrderItem {
  itemId: string;
  name: string;
  size?: "small" | "large";
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IOrder {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  eventAt: Date;
  deliveryZone: string;
  deliveryFee: number;
  notes?: string;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  depositPercent: number;
  depositAmount: number;
  amountPaid: number;
  status: OrderStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, enum: ["small", "large"] },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    eventAt: { type: Date, required: true },
    deliveryZone: { type: String, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    notes: { type: String },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    depositPercent: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    amountPaid: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "deposit_paid", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    stripeCheckoutSessionId: String,
    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);

import mongoose, { Schema, models, model } from "mongoose";
import type { OrderStatus } from "@/lib/order-types";

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
  placeId?: string;
  deliveryMiles?: number;
  eventAt: Date;
  deliveryFee: number;
  notes?: string;
  items: IOrderItem[];
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
    customerEmail: { type: String, required: true, index: true },
    deliveryAddress: { type: String, required: true },
    placeId: { type: String },
    deliveryMiles: { type: Number },
    eventAt: { type: Date, required: true, index: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    notes: { type: String },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    depositPercent: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    balanceDue: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "deposit_paid", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    stripeCheckoutSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const Order =
  models.Order || model<IOrder>("Order", OrderSchema);

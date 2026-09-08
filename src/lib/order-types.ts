export type OrderStatus =
  | "pending"
  | "deposit_paid"
  | "confirmed"
  | "completed"
  | "cancelled";

export type OrderItem = {
  itemId: string;
  name: string;
  size?: "small" | "large";
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CateringOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  placeId?: string;
  deliveryMiles?: number;
  eventAt: string;
  deliveryFee: number;
  notes?: string;
  items: OrderItem[];
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
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = Omit<
  CateringOrder,
  "id" | "createdAt" | "updatedAt"
>;

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "deposit_paid",
  "confirmed",
  "completed",
  "cancelled",
];

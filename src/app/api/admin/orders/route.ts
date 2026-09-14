import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listOrders, type OrderStatus } from "@/lib/orders-store";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "all") as OrderStatus | "all";
    const q = searchParams.get("q") || "";

    const orders = await listOrders({ status, q });
    return NextResponse.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

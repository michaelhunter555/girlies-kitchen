import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/orders-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getDashboardStats();
  return NextResponse.json({ stats, admin: session });
}

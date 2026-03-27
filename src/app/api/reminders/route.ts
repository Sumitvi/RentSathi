import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const today = new Date().getDate();

  const tenants = await Tenant.find();

  const unpaidTenants = [];

  for (const t of tenants) {
    const payment = await Payment.findOne({
      tenantId: t._id,
      month: currentMonth,
      status: "paid",
    });

    const dueDate = t.dueDate || 5;
    const reminderDay = dueDate - 3;

    
    if (!payment && today === reminderDay) {
      unpaidTenants.push({
        name: t.name,
        email: t.email,
        phone: t.phone,
        rentAmount: t.rentAmount,
      });
    }
  }

  return NextResponse.json(unpaidTenants);
}
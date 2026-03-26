import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Tenant from "@/models/Tenant";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();


  const month = new Date().toISOString().slice(0, 7); 


  const tenant = await Tenant.findOne({
    _id: body.tenantId,
    landlordId: session.user.id,
  });

  if (!tenant) {
    return NextResponse.json(
      { message: "Unauthorized tenant access" },
      { status: 403 }
    );
  }


  const existing = await Payment.findOne({
    tenantId: body.tenantId,
    month,
  });

  if (existing) {
    return NextResponse.json(
      { message: "Already paid for this month" },
      { status: 400 }
    );
  }


  const payment = await Payment.create({
    tenantId: body.tenantId,
    amount: tenant.rentAmount, 
    status: "paid",
    month,
    paymentDate: new Date(),
    landlordId: session.user.id, 
  });

  return NextResponse.json(payment);
}


export async function GET(req: Request) {
  await connectDB();

  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  const query: any = {
    landlordId: session.user.id, 
  };

  if (month) {
    query.month = month;
  }

  const payments = await Payment.find(query);

  return NextResponse.json(payments);
}
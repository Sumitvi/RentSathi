import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ FIX: await params
  const { id } = await context.params;

  const deleted = await Tenant.findOneAndDelete({
    _id: id,
    landlordId: session.user.id,
  });

  if (!deleted) {
    return NextResponse.json(
      { message: "Tenant not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
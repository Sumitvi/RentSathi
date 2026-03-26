import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  tenantId: String,
  amount: Number,
  status: { type: String, default: "pending" },
  paymentDate: Date,
  month: String,
}, { timestamps: true });

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
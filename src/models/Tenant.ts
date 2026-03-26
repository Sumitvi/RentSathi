import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String },        
    phone: { type: String },       

    roomNumber: String,
    rentAmount: Number,

    dueDate: { type: Number, default: 5 }, 

    landlordId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tenant ||
  mongoose.model("Tenant", TenantSchema);
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { 
  Users, Wallet, Plus, Trash2, CheckCircle, UserPlus, 
  Home, Loader2, AlertCircle, Mail, Phone, CalendarDays 
} from "lucide-react";

interface Tenant {
  _id: string;
  name: string;
  rentAmount: number;
  roomNumber: string;
  email?: string;
  phone?: string;
  dueDate: number;
  isPaid?: boolean; 
}

export default function Dashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    rentAmount: "", 
    roomNumber: "", 
    email: "", 
    phone: "", 
    dueDate: "5" 
  });

  const fetchTenants = async () => {
    try {
      const currentMonth = new Date().toLocaleString("default", { month: "long" });
      const [tenantsRes, paymentsRes] = await Promise.all([
        axios.get("/api/tenants"),
        axios.get(`/api/payments?month=${currentMonth}`) 
      ]);

      const paidIds = new Set(paymentsRes.data.map((p: any) => p.tenantId));
      const updatedData = tenantsRes.data.map((t: Tenant) => ({
        ...t,
        isPaid: paidIds.has(t._id)
      }));

      setTenants(updatedData);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const addTenant = async () => {
    if (!form.name || !form.rentAmount || !form.email) {
      toast.error("Name, Rent, and Email are required");
      return;
    }
    
    setIsAdding(true);
    const loadingToast = toast.loading("Registering new tenant...");
    try {
      await axios.post("/api/tenants", {
        name: form.name,
        rentAmount: Number(form.rentAmount),
        roomNumber: form.roomNumber,
        email: form.email,
        phone: form.phone,
        dueDate: Number(form.dueDate),
      });
      
      setForm({ name: "", rentAmount: "", roomNumber: "", email: "", phone: "", dueDate: "5" });
      fetchTenants();
      toast.success("New tenant added successfully!", { id: loadingToast });
    } catch (err) {
      toast.error("Registration failed", { id: loadingToast });
    } finally {
      setIsAdding(false);
    }
  };

  const markPaid = async (tenant: Tenant) => {
    const loadingToast = toast.loading(`Recording payment for ${tenant.name}...`);
    try {
      await axios.post("/api/payments", {
        tenantId: tenant._id,
        amount: tenant.rentAmount,
        status: "paid",
        month: new Date().toLocaleString("default", { month: "long" }),
      });
      
      toast.success("Payment recorded! ✅", { id: loadingToast });
      fetchTenants(); 
    } catch (err) {
      toast.error("Payment failed", { id: loadingToast });
    }
  };

  const deleteTenant = async (id: string) => {
    if(!confirm("Are you sure you want to remove this tenant?")) return;
    try {
      await axios.delete(`/api/tenants/${id}`);
      toast.success("Tenant removed");
      fetchTenants();
    } catch (err) {
      toast.error("Could not delete tenant");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pb-20 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* 🟢 Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-8 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">Managing properties for {new Date().toLocaleString("default", { month: "long" })}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Tenants</p>
              <h2 className="text-3xl font-black text-slate-900">{tenants.length}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Expected Revenue</p>
              <h2 className="text-3xl font-black text-slate-900">
                ₹{tenants.reduce((acc, t) => acc + t.rentAmount, 0).toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* 🖋️ Registration Card (Dark Mode Theme) */}
        <div className="bg-slate-950 p-8 md:p-10 rounded-[2.5rem] mb-12 text-white shadow-2xl shadow-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <UserPlus className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Register New Tenant</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Basic Info</label>
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <input
                placeholder="Room Number"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact & Financial</label>
              <input
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <input
                placeholder="Rent Amount (₹)"
                type="number"
                value={form.rentAmount}
                onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Setup</label>
              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <input
                placeholder="Due Date (Day of Month)"
                type="number"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <button
            onClick={addTenant}
            disabled={isAdding}
            className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-emerald-500/10"
          >
            {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" strokeWidth={3} />}
            Confirm & Save Registration
          </button>
        </div>

        {/* 📋 Tenant Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-2xl font-black text-slate-900">Tenant Directory</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Total: {tenants.length}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <AlertCircle className="mx-auto w-12 h-12 text-slate-200 mb-2" />
              <p className="text-slate-400 font-medium">Your building is empty. Add your first tenant above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tenants.map((t) => (
                <div key={t._id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all ${t.isPaid ? 'bg-emerald-50 text-emerald-500 ring-4 ring-emerald-50/50' : 'bg-slate-50 text-slate-400 ring-4 ring-slate-50/50'}`}>
                      <Home className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-xl leading-tight">{t.name}</h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                          <DoorOpen className="w-3 h-3" /> Room {t.roomNumber}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          ₹{t.rentAmount.toLocaleString()} / mo
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> Due: {t.dueDate}th
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end mr-4">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Status</p>
                      {t.isPaid ? (
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">Verified Paid</span>
                      ) : (
                        <span className="text-xs font-black text-red-400 uppercase tracking-tighter">Payment Overdue</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => markPaid(t)}
                      disabled={t.isPaid}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
                        t.isPaid
                          ? "bg-emerald-50 text-emerald-500 cursor-not-allowed border border-emerald-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95"
                      }`}
                    >
                      {t.isPaid ? <CheckCircle className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                      {t.isPaid ? "Paid" : "Mark Paid"}
                    </button>

                    <button
                      onClick={() => deleteTenant(t._id)}
                      className="bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 p-3 rounded-2xl transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const DoorOpen = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h20"/><path d="M13 20V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16"/><path d="M6 12v.01"/><path d="M13 4l-2 2"/></svg>
);
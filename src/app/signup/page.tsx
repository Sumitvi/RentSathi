"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast"; // 🔥 Added
import { Building2, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 🔥 Using toast.promise for a high-end feel
    // This handles the loading, success, and error states in one block
    toast.promise(
      axios.post("/api/auth/signup", form),
      {
        loading: 'Creating your account...',
        success: (res) => {
          setIsLoading(false);
          setTimeout(() => router.push("/login"), 1500);
          return <b>Account created! Redirecting...</b>;
        },
        error: (err) => {
          setIsLoading(false);
          return <b>{err.response?.data?.message || "Something went wrong"}</b>;
        },
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 3000,
          icon: '🎉',
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center p-6 selection:bg-emerald-100">
      {/* 🔥 Flash Message Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* 🔝 Brand Logo */}
      <div 
        className="flex items-center gap-2 mb-8 cursor-pointer group" 
        onClick={() => router.push("/")}
      >
        <Building2 className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
        <span className="text-2xl font-extrabold tracking-tighter text-slate-950">
          rent<span className="text-emerald-600">ease</span>
        </span>
      </div>

      <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-8 md:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            Create an account
          </h1>
          <p className="text-slate-500">Join landlords managing properties with ease.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="name"
                required
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="password"
                type="password"
                required
                placeholder="Min. 8 characters"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl shadow-emerald-100 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account?{" "}
          <button 
            onClick={() => router.push("/login")}
            className="font-bold text-emerald-600 hover:text-emerald-700"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
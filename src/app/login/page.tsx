"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast"; 

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      // 🔥 Flash error message
      toast.error("Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      // 🔥 Flash success message before redirecting
      toast.success("Welcome back! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000); // Small delay to let the user see the success toast
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center p-6 selection:bg-emerald-100">
      {/* 🔥 Flash Message Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* 🔝 Logo Link */}
      <div 
        className="flex items-center gap-2 mb-8 cursor-pointer" 
        onClick={() => router.push("/")}
      >
        <Building2 className="w-8 h-8 text-emerald-600" />
        <span className="text-2xl font-extrabold tracking-tighter text-slate-950">
          rent<span className="text-emerald-600">ease</span>
        </span>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-8 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500">Enter your details to access your dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <button 
                type="button" 
                onClick={() => toast.loading("Password recovery coming soon...", { duration: 2000 })}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-slate-200 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Don't have an account?{" "}
          <button 
            onClick={() => router.push("/signup")}
            className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Create one for free
          </button>
        </p>
      </div>
    </div>
  );
}
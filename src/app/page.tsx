"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // 🔥 Added
import { 
  Building2, 
  UserPlus, 
  BarChart3, 
  BellRing, 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  LayoutDashboard, // 🔥 Added
  LogOut // 🔥 Added
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); // 🔥 Get auth state

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 selection:bg-emerald-100 font-sans">
      <Toaster position="top-center" />
      
      {/* 🔝 Professional Floating Header */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4">
        <nav className="flex justify-between items-center py-3 px-6 bg-white/90 backdrop-blur-md rounded-full border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Building2 className="w-7 h-7 text-emerald-600" />
            <span className="text-2xl font-extrabold tracking-tighter text-slate-950">
              rent<span className="text-emerald-600">sathi</span>
            </span>
          </div>

          <div className="flex gap-2.5 items-center">
            {status === "authenticated" ? (
              <>
                {/* 🔥 Authenticated UI: Dashboard + Logout */}
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-bold rounded-full transition-all active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : status === "loading" ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* 🔒 Guest UI: Login + Signup */}
                <button
                  onClick={() => router.push("/login")}
                  className="hidden md:block text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors px-4 py-2"
                >
                  Partner Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full transition-all shadow-sm active:scale-95"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* 🚀 Sleek Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-20 md:pt-32 md:pb-40 text-center px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(16,185,129,0.08)_0%,rgba(250,250,252,0)_100%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Trust & Security First</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-7 tracking-tighter text-slate-950 leading-[0.95]">
            Property Management<br />
            <span className="text-emerald-600">Done Right.</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
            Effortlessly manage tenants, track payments, and automate 
            communications—all within a unified, professional dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button
              onClick={() => router.push(status === "authenticated" ? "/dashboard" : "/signup")}
              className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-9 py-4 rounded-full text-lg font-bold transition-all active:scale-95 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]"
            >
              {status === "authenticated" ? "Access Dashboard" : "Start Free Trial"}
              <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-9 py-4 rounded-full text-lg font-semibold transition-all shadow-sm"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section and Footer remain same... */}
      <section className="py-24 px-6 relative bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Platform Core</span>
              <h3 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tighter text-slate-950">Maximize Your Yield</h3>
            </div>
            <p className="text-slate-500 max-w-sm text-base leading-relaxed">
              Designed for modern landlords who value precision. Our tools 
              reduce administrative overhead by up to 60%.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {[
              { title: "Tenant Onboarding", desc: "Digital applications, dynamic screening, and secure document vaults.", icon: UserPlus },
              { title: "Financial Ledger", desc: "Automated reconciliation, professional invoicing, and instant tax reports.", icon: BarChart3 },
              { title: "Automated Reminders", desc: "Intelligent notifications via WhatsApp/Email based on customized logic.", icon: BellRing }
            ].map((feature, i) => (
              <div key={i} className="group relative p-10 bg-white rounded-3xl border border-slate-100 hover:border-emerald-100 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-3xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl mb-8 border border-emerald-100">
                    <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-extrabold text-2xl mb-4 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-100 bg-[#fafafc] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-300" />
            <span>© {new Date().getFullYear()} RentSathi Technologies.</span>
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
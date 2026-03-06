import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Hero() {
  const { user } = useContext(AuthContext);

  // Stats shown in the bottom row
  const stats = [
    { value: "500+", label: "Local Stores" },
    { value: "10k+", label: "Products" },
    { value: "50k+", label: "Happy Buyers" },
    { value: "100+", label: "Cities" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 dark:from-indigo-800 dark:via-indigo-900 dark:to-violet-950 p-8 sm:p-12 mb-10 shadow-xl">

      {/* ── Background decorations ── */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-20 -translate-x-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* ── Floating badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Hyperlocal Marketplace — Now Live
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        {/* Left — Text */}
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight"
          >
            Discover Local Stores{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-pink-200">
              Near You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-indigo-200 text-base sm:text-lg mt-4 leading-relaxed"
          >
            Buy unique products from local sellers or launch your own store in minutes. Support your community, shop smart.
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 mt-7"
          >
            {/* Primary CTA — show based on role */}
            {(!user || user.role === "buyer") && (
              <Link
                to={user ? "/create-store" : "/signup"}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-700 font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
              >
                <span>🏪</span>
                Start Selling Free
              </Link>
            )}

            {user?.role === "seller" && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-700 font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
              >
                <span>⚡</span>
                Go to Dashboard
              </Link>
            )}

            
          </motion.div>

          {/* ── Trust indicators ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center gap-4 mt-6"
          >
            {/* Avatars */}
            <div className="flex -space-x-2">
              {["A", "R", "S", "K", "M"].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-300 to-violet-400 border-2 border-indigo-600 flex items-center justify-center text-white text-[10px] font-bold"
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-indigo-200 text-xs">
              <span className="text-white font-semibold">2,400+</span> sellers joined this week
            </p>
          </motion.div>
        </div>

        {/* Right — Feature cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col gap-3 min-w-[220px]"
        >
          {[
            { icon: "⚡", title: "Setup in minutes", desc: "No tech skills needed" },
            { icon: "🔒", title: "Secure payments", desc: "Safe & encrypted" },
            { icon: "📦", title: "Easy management", desc: "Track orders & products" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3"
            >
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{f.title}</p>
                <p className="text-indigo-300 text-xs">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
            className="text-center sm:text-left"
          >
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="text-indigo-300 text-xs mt-0.5 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
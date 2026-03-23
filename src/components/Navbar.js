import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/drivers", label: "Drivers" },
    { to: "/races", label: "Races" },
    { to: "/analytics", label: "Analytics" },
    { to: "/comparison", label: "Compare" },
    { to: "/strategy", label: "Strategy" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10"
    >
      {/* F1 Racing Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-pink-500 to-transparent opacity-80" />

      {/* Desktop Navbar */}
      <div className="hidden lg:flex px-10 py-3 justify-between items-center">
        
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">🏎️</span>
            </div>

            {/* Subtle Glow */}
            <div className="absolute inset-0 rounded-xl bg-red-500/20 blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
          </div>

          <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-white bg-clip-text text-transparent">
            F1 Analytics
          </h1>
        </motion.div>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {navItems.map(({ to, label }, i) => {
            const isActive = location.pathname === to;

            return (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={to} className="relative group">
                  
                  {/* Text */}
                  <span
                    className={`text-base font-semibold tracking-wide transition duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {label}
                  </span>

                  {/* Active Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(255,0,0,0.6)]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover Underline */}
                  {!isActive && (
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-300 group-hover:w-full" />
                  )}

                  {/* F1 Speed Flash */}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-red-400 opacity-0 group-hover:w-full group-hover:opacity-60 transition-all duration-500" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">F1</span>
        </div>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-md"
        >
          ☰
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-black/50 backdrop-blur-xl border-t border-white/10"
          >
            <div className="p-6 space-y-4">
              {navItems.map(({ to, label }, i) => {
                const isActive = location.pathname === to;

                return (
                  <motion.div
                    key={to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={to}
                      className={`block text-lg font-semibold transition ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {label}

                      {/* Mobile underline */}
                      {isActive && (
                        <div className="h-[2px] w-10 bg-red-500 mt-1 rounded-full" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
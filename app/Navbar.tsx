"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "features" },
    { label: "Contact Us", href: "contact-us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <>
      <nav 
        className={`flex justify-between items-center px-6 md:px-20 py-4 fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#222222]/80 backdrop-blur-md" 
            : "bg-transparent"
        }`}
      >
        <h1 className="font-bold text-xl text-[#fffbdf]">WORKFLOW</h1>
        <ul className="hidden md:flex items-center space-x-6 text-[#fffbdf]">
          {navLinks.map((link, index) => (
            <li key={index} className="hover:text-white transition">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <motion.button
          className="hidden md:block px-4 py-1 bg-[#fffbdf] rounded-lg transition text-black cursor-pointer font-medium"
          animate={{
            scale: [1, 1.3, 1],
            backgroundColor: ["#fffbdf", "#fff", "#fffbdf"],
          }}
          transition={{ repeat: 3, duration: 0.5, ease: "easeInOut" }}
        >
          Sign In
        </motion.button>
        
        {/* Mobile: Sign In button + Menu icon */}
        <div className="flex md:hidden items-center gap-4">
          <button className="px-3 py-1 bg-[#fffbdf] rounded-lg text-black text-sm font-semibold">
            Sign In
          </button>
          <button
            className="text-2xl text-[#fffbdf]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#222222] z-40 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl text-[#fffbdf] hover:text-white transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
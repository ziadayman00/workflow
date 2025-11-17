"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Track scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);
  
  return (
    <>
      <nav
        className={`flex items-center px-6 md:px-20 py-5 fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#222222]/90 backdrop-blur-md shadow-lg" 
            : "bg-transparent"
        }`}
      >
        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] opacity-50 bg-[#fffbdf] origin-left"
          style={{ scaleX }}
        />
        
        {/* logo */}
        <Logo/>

        {/* Desktop Navigation - Centered */}
        <ul className="hidden md:flex items-center space-x-1 text-[#fffbdf] absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link, index) => (
            <li key={index} className="relative">
              <Link
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors hover:bg-[#fffbdf]/5 ${
                  pathname === link.href
                    ? "text-[#fffbdf] bg-[#fffbdf]/10" 
                    : "text-[#fffbdf]/70 hover:text-[#fffbdf]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Sign In Button */}
        <motion.button
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#fffbdf] rounded-3xl cursor-pointer text-[#222222] font-thin hover:bg-[#fff5b8] transition-all group ml-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href='/sign-in'>
          Sign In
          </Link>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        
        {/* Mobile: Sign In button + Menu icon */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          <motion.button 
            className="px-4 py-2 bg-[#fffbdf] rounded-lg text-[#222222] text-sm font-semibold"
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
          <motion.button
            className="text-[#fffbdf] p-2 hover:bg-[#fffbdf]/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[75%] max-w-sm bg-[#222222] border-l border-[#fffbdf]/10 z-50 md:hidden shadow-2xl"
            >
              {/* Close button */}
              <div className="flex justify-end p-6">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#fffbdf] p-2 hover:bg-[#fffbdf]/10 rounded-lg transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col px-6 space-y-2 mt-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-2xl transition-colors py-4 px-4 rounded-lg ${
                        pathname === link.href
                          ? "text-[#fffbdf] bg-[#fffbdf]/10"
                          : "text-[#fffbdf]/70 hover:text-[#fff5b8] hover:bg-[#fffbdf]/5"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-8 left-6 right-6"
              >
                <div className="p-4 bg-[#fffbdf]/5 border border-[#fffbdf]/10 rounded-xl">
                  <p className="text-[#fffbdf]/70 text-sm mb-3">
                    Ready to get started?
                  </p>
                  <motion.button
                    className="w-full bg-[#fffbdf] px-4 py-3 rounded-lg text-[#222222] font-semibold hover:bg-[#fff5b8] transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Account
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
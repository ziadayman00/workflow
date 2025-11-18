"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { Menu, X, ArrowRight, User, LogOut, LayoutDashboard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";

// Memoized Nav Link Component for better performance
const NavLink = memo(({ link, pathname, onClick }: { 
  link: { label: string; href: string }; 
  pathname: string;
  onClick?: () => void;
}) => (
  <Link
    href={link.href}
    className={`px-4 py-2 rounded-lg transition-colors hover:bg-[#fffbdf]/5 ${
      pathname === link.href
        ? "text-[#fffbdf] bg-[#fffbdf]/10" 
        : "text-[#fffbdf]/70 hover:text-[#fffbdf]"
    }`}
    onClick={onClick}
  >
    {link.label}
  </Link>
));

NavLink.displayName = "NavLink";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
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

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  // Get first name from session
  const userName = session?.user?.name?.split(" ")[0] || "User";
  
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
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <NavLink link={link} pathname={pathname} />
            </li>
          ))}
        </ul>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {status === "loading" ? (
            <div className="w-8 h-8 border-2 border-[#fffbdf]/30 border-t-[#fffbdf] rounded-full animate-spin" />
          ) : session ? (
            <>
              {/* Dashboard Button */}
              <Link href="/dashboard">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 text-[#fffbdf] hover:bg-[#fffbdf]/5 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </motion.button>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#fffbdf]/5 transition-colors border border-[#fffbdf]/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#fffbdf]/20 flex items-center justify-center">
                      <User size={14} className="text-[#fffbdf]" />
                    </div>
                  )}
                  <span className="text-[#fffbdf] text-sm font-medium">{userName}</span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-lg shadow-xl z-20"
                      >
                        <div className="p-3 border-b border-[#fffbdf]/10">
                          <p className="text-sm font-medium text-[#fffbdf] truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-[#fffbdf]/60 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a]/50 transition-colors text-left"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link href="/signin">
              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 bg-[#fffbdf] rounded-3xl text-[#222222] font-thin hover:bg-[#fff5b8] transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          )}
        </div>
        
        {/* Mobile: Action buttons + Menu icon */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          {status === "loading" ? (
            <div className="w-6 h-6 border-2 border-[#fffbdf]/30 border-t-[#fffbdf] rounded-full animate-spin" />
          ) : session ? (
            <Link href="/dashboard">
              <motion.button 
                className="px-4 py-2 bg-[#fffbdf] rounded-lg text-[#222222] text-sm font-semibold"
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
              </motion.button>
            </Link>
          ) : (
            <Link href="/signin">
              <motion.button 
                className="px-4 py-2 bg-[#fffbdf] rounded-lg text-[#222222] text-sm font-semibold"
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </Link>
          )}
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
              onClick={closeMobileMenu}
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
                  onClick={closeMobileMenu}
                  className="text-[#fffbdf] p-2 hover:bg-[#fffbdf]/10 rounded-lg transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* User Info Section (if logged in) */}
              {session && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-6 pb-6 border-b border-[#fffbdf]/10"
                >
                  <div className="flex items-center gap-3 p-4 bg-[#fffbdf]/5 rounded-lg">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#fffbdf]/20 flex items-center justify-center">
                        <User size={20} className="text-[#fffbdf]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#fffbdf] font-medium truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-[#fffbdf]/60 text-sm truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col px-6 space-y-2 mt-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
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
                      onClick={closeMobileMenu}
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
                {session ? (
                  <div className="space-y-2">
                    <Link href="/dashboard" onClick={closeMobileMenu}>
                      <motion.button
                        className="w-full bg-[#fffbdf] px-4 py-3 rounded-lg text-[#222222] font-semibold hover:bg-[#fff5b8] transition-colors flex items-center justify-center gap-2"
                        whileTap={{ scale: 0.98 }}
                      >
                        <LayoutDashboard size={18} />
                        Go to Dashboard
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 rounded-lg text-red-400 font-semibold border border-red-400/30 hover:bg-red-400/10 transition-colors flex items-center justify-center gap-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut size={18} />
                      Sign Out
                    </motion.button>
                  </div>
                ) : (
                  <div className="p-4 bg-[#fffbdf]/5 border border-[#fffbdf]/10 rounded-xl">
                    <p className="text-[#fffbdf]/70 text-sm mb-3">
                      Ready to get started?
                    </p>
                    <Link href="/signin" onClick={closeMobileMenu}>
                      <motion.button
                        className="w-full bg-[#fffbdf] px-4 py-3 rounded-lg text-[#222222] font-semibold hover:bg-[#fff5b8] transition-colors"
                        whileTap={{ scale: 0.98 }}
                      >
                        Create Account
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navbar);
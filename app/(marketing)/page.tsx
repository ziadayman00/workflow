'use client'
import React, { memo, useMemo } from "react";
import { motion } from "motion/react";
import { Zap, Target, Rocket, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Memoized Background Blur Component - Reduced animations for performance
const BackgroundBlur = memo(() => (
  <div className="absolute inset-0 opacity-15 pointer-events-none">
    <motion.div 
      className="absolute top-20 left-10 w-72 h-72 bg-[#fffbdf] rounded-full filter blur-[100px]"
      animate={{
        x: [0, 30, 0],
        y: [0, 20, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <motion.div 
      className="absolute bottom-20 right-10 w-80 h-80 bg-[#fffbdf] rounded-full filter blur-[100px]"
      animate={{
        x: [0, -20, 0],
        y: [0, 30, 0],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </div>
));

BackgroundBlur.displayName = "BackgroundBlur";

// Memoized Feature Card Component
const FeatureCard = memo(({ icon: Icon, title, description, index }: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    className="p-6 sm:p-8 bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl hover:border-[#fffbdf]/30 hover:bg-[#2a2a2a]/70 transition-all group cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1.8 + (index * 0.1) }}
    whileHover={{ y: -5 }}
  >
    <div className="bg-[#fffbdf]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#fffbdf]/20 transition-all">
      <Icon className="w-7 h-7 text-[#fffbdf]" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-[#fffbdf] group-hover:text-[#fff5b8] transition-colors">
      {title}
    </h3>
    <p className="text-[#fffbdf]/80 leading-relaxed">
      {description}
    </p>
  </motion.div>
));

FeatureCard.displayName = "FeatureCard";

// Memoized Badge Component
const LiveBadge = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-xs sm:text-sm font-medium mb-8"
  >
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fffbdf] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fffbdf]"></span>
    </span>
    <span className="whitespace-nowrap">
      <span className="hidden sm:inline">New: Real-time collaboration features now live</span>
      <span className="inline sm:hidden">New: Real-time features live</span>
    </span>
  </motion.div>
));

LiveBadge.displayName = "LiveBadge";



function Home() {
  const { data: session } = useSession();

  // Memoized features data
  const features = useMemo(() => [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get up and running in minutes with our intuitive interface and smart onboarding."
    },
    {
      icon: Target,
      title: "Stay Focused",
      description: "Track what matters and eliminate distractions from your workflow with precision tools."
    },
    {
      icon: Rocket,
      title: "Scale Easily",
      description: "Grow from small teams to enterprise without missing a beat or compromising performance."
    }
  ], []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 py-28 bg-gradient-to-br from-[#222222] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated Background blurs - Optimized */}
      <BackgroundBlur />

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
        {/* Badge */}
        <LiveBadge />

        {/* Main Heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold max-w-5xl mb-6 leading-tight text-[#fffbdf]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Organize your team.
          <br />
          <span className="bg-gradient-to-r from-[#fffbdf] to-[#fff5b4] bg-clip-text text-transparent">
            Track your progress.
          </span>
          <br />
          Build better workflows.
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-center text-[#fffbdf]/70 max-w-3xl mb-10 leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Streamline collaboration and boost productivity with tools designed
          for modern teams. Get started in minutes, scale to enterprise.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex gap-4 flex-wrap justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href={session ? "/dashboard" : "/signin"}>
            <motion.button 
              className="bg-[#fffbdf] px-8 py-3.5 text-base font-medium text-[#222222] hover:bg-[#fff5b8] transition-all rounded-lg flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {session ? (
                <>
                  Go to Dashboard
                  <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              ) : (
                <>
                  Start Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </Link>
          <Link href="/features">
            <motion.button 
              className="bg-transparent border border-[#fffbdf]/30 px-8 py-3.5 text-base font-medium text-[#fffbdf] hover:border-[#fffbdf]/50 hover:bg-[#fffbdf]/5 transition-all rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>

        {/* Product Screenshots - Responsive Layout */}
        <motion.div 
          className="w-full px-4 mb-20 mt-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {/* Desktop 3D Layout */}
          <div className="hidden md:block relative max-w-6xl mx-auto h-[500px]" style={{ perspective: '2000px' }}>
            {/* Projects View (Left/Back) */}
            <motion.div
              className="absolute left-0 top-8 w-[52%] z-10 will-change-transform"
              initial={{ opacity: 0, x: -100, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 12 }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              whileHover={{ 
                rotateY: 2, 
                x: -30, 
                scale: 1.02,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-2 rounded-2xl border border-[#fffbdf]/30 shadow-[0_20px_60px_rgba(255,251,223,0.1)] overflow-hidden">
                <img 
                  src="hero1.png" 
                  alt="Project Management Dashboard"
                  className="w-full h-auto rounded-xl"
                  loading="eager"
                />
              </div>
            </motion.div>

            {/* Tasks View (Right/Front) */}
            <motion.div
              className="absolute right-0 top-0 w-[52%] z-20 will-change-transform"
              initial={{ opacity: 0, x: 100, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: -12 }}
              transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
              whileHover={{ 
                rotateY: -2, 
                x: 30, 
                scale: 1.02,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-2 rounded-2xl border border-[#fffbdf]/30 shadow-[0_25px_70px_rgba(255,251,223,0.15)] overflow-hidden">
                <img 
                  src="hero2.png" 
                  alt="Task Management Board"
                  className="w-full h-auto rounded-xl"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile Stack Layout */}
          <div className="md:hidden space-y-6 max-w-lg mx-auto">
            {/* Tasks View */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-2 rounded-2xl border border-[#fffbdf]/30 shadow-[0_25px_70px_rgba(255,251,223,0.15)] overflow-hidden">
                <img 
                  src="hero2.png" 
                  alt="Task Management Board"
                  className="w-full h-auto rounded-xl"
                  loading="eager"
                />
              </div>
            </motion.div>

            {/* Projects View */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-2 rounded-2xl border border-[#fffbdf]/30 shadow-[0_20px_60px_rgba(255,251,223,0.1)] overflow-hidden">
                <img 
                  src="hero1.png" 
                  alt="Project Management Dashboard"
                  className="w-full h-auto rounded-xl"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </motion.div>

      </div>
    </div>
  );
}

export default memo(Home);
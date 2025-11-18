'use client'
import React, { memo, useMemo } from "react";
import { motion } from "motion/react";
import { Zap, Target, Rocket, ArrowRight } from "lucide-react";

// Memoized Background Blur Component
const BackgroundBlur = memo(() => (
  <motion.div 
    className="absolute inset-0 opacity-20 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
    transition={{ duration: 1.5 }}
  >
    <motion.div 
      className="absolute top-20 left-10 w-72 h-72 bg-[#fffbdf] rounded-full filter blur-[120px]"
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute bottom-20 right-10 w-96 h-96 bg-[#fffbdf] rounded-full filter blur-[150px]"
      animate={{
        x: [0, -30, 0],
        y: [0, 50, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#fffbdf] rounded-full filter blur-[140px]"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </motion.div>
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
    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
    whileHover={{ y: -5 }}
  >
    <div className="bg-[#fffbdf]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#fffbdf]/20 transition-all">
      <Icon className="w-7 h-7 text-[#fffbdf]" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-[#fffbdf] group-hover:text-[#fff5b8] transition-colors">
      {title}
    </h3>
    <p className="text-[#fffbdf]/60 leading-relaxed">
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
    className="inline-flex items-center gap-2 px-4 py-2 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-sm font-medium mb-8"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fffbdf] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fffbdf]"></span>
    </span>
    New: Real-time collaboration features now live
  </motion.div>
));

LiveBadge.displayName = "LiveBadge";

// Memoized Trust Indicators Component
const TrustIndicators = memo(() => {
  const companies = useMemo(() => ["Company A", "Company B", "Company C", "Company D"], []);
  
  return (
    <motion.div
      className="mt-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <p className="text-sm text-[#fffbdf]/50 mb-4">TRUSTED BY TEAMS AT</p>
      <div className="flex flex-wrap justify-center gap-8 items-center opacity-40">
        {companies.map((company) => (
          <div key={company} className="text-[#fffbdf] font-semibold text-lg">
            {company}
          </div>
        ))}
      </div>
    </motion.div>
  );
});

TrustIndicators.displayName = "TrustIndicators";

function Home() {
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
      {/* Animated Background blurs */}
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
          <motion.button 
            className="bg-[#fffbdf] px-8 py-3.5 text-base font-medium text-[#222222] hover:bg-[#fff5b8] transition-all rounded-lg flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button 
            className="bg-transparent border border-[#fffbdf]/30 px-8 py-3.5 text-base font-medium text-[#fffbdf] hover:border-[#fffbdf]/50 hover:bg-[#fffbdf]/5 transition-all rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <TrustIndicators />
      </div>
    </div>
  );
}

export default memo(Home);
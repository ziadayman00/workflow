'use client'
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import {
  Kanban,
  RefreshCw,
  Users,
  CheckSquare,
} from "lucide-react";

interface FeatureCardProps {
  children: (props: {
    y: MotionValue<number>;
    opacity: MotionValue<number>;
    scale: MotionValue<number>;
    textY: MotionValue<number>;
    smoothProgress: MotionValue<number>;
  }) => React.ReactNode;
  index: number;
  reverse?: boolean;
}

function FeatureCard({ children, index, reverse = false }: FeatureCardProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values for parallax and fade effects
  const y = useTransform(smoothProgress, [0, 0.5, 1], [60, 0, -60]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], [0.9, 1, 1, 1, 0.9]);
  
  // Different animation for text based on position
  const textY = useTransform(smoothProgress, [0, 0.5, 1], reverse ? [-30, 0, 30] : [30, 0, -30]);

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
      {children({ y, opacity, scale, textY, smoothProgress })}
    </div>
  );
}

export default function Features() {
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222222] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated Background blurs */}
      <motion.div 
        className="absolute inset-0 opacity-20"
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

      <div className="relative z-10 px-4 sm:px-6 py-20 md:py-28">
        {/* Header with parallax */}
        <motion.div 
          ref={headerRef}
          className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 md:mb-20"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#fffbdf] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Everything you need to manage your team
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-[#fffbdf]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Workflow brings together all the tools your team needs to
            collaborate, track progress, and ship faster.
          </motion.p>
        </motion.div>

        {/* Features Grid with scroll animations */}
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-32">
          {/* Kanban Board */}
          <FeatureCard index={0}>
            {({ y, opacity, scale, textY }) => (
              <>
                <motion.div 
                  className="order-2 md:order-1"
                  style={{ y: textY, opacity }}
                >
                  <motion.div 
                    className="inline-block px-3 py-1 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Visual Organization
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-3 sm:mb-4">
                    Drag-and-drop Kanban boards
                  </h2>
                  <p className="text-sm sm:text-base text-[#fffbdf]/70 mb-4 sm:mb-6 leading-relaxed">
                    Organize tasks visually with customizable columns. Drag tasks
                    between To Do, In Progress, and Done with smooth animations that
                    make managing work feel effortless.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Smooth drag-and-drop with real-time updates",
                      "Custom columns for your workflow",
                      "Priority badges and due date indicators"
                    ].map((text, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-[#fffbdf]/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <span className="text-[#fffbdf] mt-1">✓</span>
                        <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div 
                  className="order-1 md:order-2 bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center"
                  style={{ y, scale, opacity }}
                >
                  <Kanban
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#fffbdf]/50"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </>
            )}
          </FeatureCard>

          {/* Real-time Collaboration */}
          <FeatureCard index={1} reverse>
            {({ y, opacity, scale, textY }) => (
              <>
                <motion.div 
                  className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center"
                  style={{ y, scale, opacity }}
                >
                  <RefreshCw
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#fffbdf]/50"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <motion.div style={{ y: textY, opacity }}>
                  <motion.div 
                    className="inline-block px-3 py-1 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Stay in Sync
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-3 sm:mb-4">
                    Real-time collaboration
                  </h2>
                  <p className="text-sm sm:text-base text-[#fffbdf]/70 mb-4 sm:mb-6 leading-relaxed">
                    See changes as they happen. When teammates move tasks, add
                    comments, or update details, everyone sees it instantly—no
                    refresh needed.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Live updates across all devices",
                      "Activity feed showing who did what",
                      "@mentions to notify team members"
                    ].map((text, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-[#fffbdf]/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <span className="text-[#fffbdf] mt-1">✓</span>
                        <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </>
            )}
          </FeatureCard>

          {/* Team Management */}
          <FeatureCard index={2}>
            {({ y, opacity, scale, textY }) => (
              <>
                <motion.div 
                  className="order-2 md:order-1"
                  style={{ y: textY, opacity }}
                >
                  <motion.div 
                    className="inline-block px-3 py-1 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Team Control
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-3 sm:mb-4">
                    Powerful team management
                  </h2>
                  <p className="text-sm sm:text-base text-[#fffbdf]/70 mb-4 sm:mb-6 leading-relaxed">
                    Invite team members, manage roles, and control access. Create
                    multiple workspaces for different projects or departments.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Role-based permissions (Admin, Member, Viewer)",
                      "Easy email invitations",
                      "Multiple workspaces per account"
                    ].map((text, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-[#fffbdf]/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <span className="text-[#fffbdf] mt-1">✓</span>
                        <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div 
                  className="order-1 md:order-2 bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center"
                  style={{ y, scale, opacity }}
                >
                  <Users
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#fffbdf]/50"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </>
            )}
          </FeatureCard>

          {/* Task Management */}
          <FeatureCard index={3} reverse>
            {({ y, opacity, scale, textY }) => (
              <>
                <motion.div 
                  className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center"
                  style={{ y, scale, opacity }}
                >
                  <CheckSquare
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#fffbdf]/50"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <motion.div style={{ y: textY, opacity }}>
                  <motion.div 
                    className="inline-block px-3 py-1 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    Never Miss a Thing
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-3 sm:mb-4">
                    Smart task tracking
                  </h2>
                  <p className="text-sm sm:text-base text-[#fffbdf]/70 mb-4 sm:mb-6 leading-relaxed">
                    Rich task details with descriptions, assignees, due dates, and
                    priorities. Add comments to discuss details and keep all context
                    in one place.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Assign tasks to team members",
                      "Set due dates and priority levels",
                      "Comment threads for discussion"
                    ].map((text, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-[#fffbdf]/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <span className="text-[#fffbdf] mt-1">✓</span>
                        <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </>
            )}
          </FeatureCard>
        </div>

        {/* CTA Section with scroll animation */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mt-16 sm:mt-20 md:mt-24 px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-4 sm:mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-base sm:text-lg text-[#fffbdf]/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join teams who are already working smarter with Workflow.
          </p>
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            <motion.button 
              className="bg-[#fffbdf] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-[#222222] hover:bg-[#fff5b8] transition-all rounded-lg w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button 
              className="bg-transparent border border-[#fffbdf]/30 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-[#fffbdf] hover:border-[#fffbdf]/50 hover:bg-[#fffbdf]/5 transition-all rounded-lg w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
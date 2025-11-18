'use client'
import React, { useRef, memo, useMemo } from "react";
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

// Memoized FeatureCard component
const FeatureCard = memo(({ children, index, reverse = false }: FeatureCardProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring animation - memoized config
  const springConfig = useMemo(() => ({
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  }), []);

  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Memoized transform ranges
  const transforms = useMemo(() => ({
    yRange: [60, 0, -60] as [number, number, number],
    opacityRange: [0, 1, 1, 1, 0] as [number, number, number, number, number],
    scaleRange: [0.9, 1, 1, 1, 0.9] as [number, number, number, number, number],
    textYRange: reverse ? [-30, 0, 30] as [number, number, number] : [30, 0, -30] as [number, number, number]
  }), [reverse]);

  // Transform values for parallax and fade effects
  const y = useTransform(smoothProgress, [0, 0.5, 1], transforms.yRange);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], transforms.opacityRange);
  const scale = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], transforms.scaleRange);
  const textY = useTransform(smoothProgress, [0, 0.5, 1], transforms.textYRange);

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
      {children({ y, opacity, scale, textY, smoothProgress })}
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Memoized feature list item component
const FeatureListItem = memo(({ text, index }: { text: string; index: number }) => (
  <motion.li 
    className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-[#fffbdf]/80"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <span className="text-[#fffbdf] mt-1">✓</span>
    <span>{text}</span>
  </motion.li>
));

FeatureListItem.displayName = "FeatureListItem";

// Memoized badge component
const FeatureBadge = memo(({ text }: { text: string }) => (
  <motion.div 
    className="inline-block px-3 py-1 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-xs sm:text-sm font-medium mb-3 sm:mb-4"
    whileInView={{ scale: [0.8, 1.1, 1] }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    {text}
  </motion.div>
));

FeatureBadge.displayName = "FeatureBadge";

// Memoized icon component
const FeatureIcon = memo(({ Icon, ...motionProps }: { Icon: React.ElementType } & any) => (
  <motion.div 
    className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center"
    {...motionProps}
  >
    <Icon
      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#fffbdf]/50"
      strokeWidth={1.5}
    />
  </motion.div>
));

FeatureIcon.displayName = "FeatureIcon";

// Memoized background blur component
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

function Features() {
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Memoized feature data
  const featuresData = useMemo(() => [
    {
      badge: "Visual Organization",
      title: "Drag-and-drop Kanban boards",
      description: "Organize tasks visually with customizable columns. Drag tasks between To Do, In Progress, and Done with smooth animations that make managing work feel effortless.",
      items: [
        "Smooth drag-and-drop with real-time updates",
        "Custom columns for your workflow",
        "Priority badges and due date indicators"
      ],
      Icon: Kanban,
      reverse: false
    },
    {
      badge: "Stay in Sync",
      title: "Real-time collaboration",
      description: "See changes as they happen. When teammates move tasks, add comments, or update details, everyone sees it instantly—no refresh needed.",
      items: [
        "Live updates across all devices",
        "Activity feed showing who did what",
        "@mentions to notify team members"
      ],
      Icon: RefreshCw,
      reverse: true
    },
    {
      badge: "Team Control",
      title: "Powerful team management",
      description: "Invite team members, manage roles, and control access. Create multiple workspaces for different projects or departments.",
      items: [
        "Role-based permissions (Admin, Member, Viewer)",
        "Easy email invitations",
        "Multiple workspaces per account"
      ],
      Icon: Users,
      reverse: false
    },
    {
      badge: "Never Miss a Thing",
      title: "Smart task tracking",
      description: "Rich task details with descriptions, assignees, due dates, and priorities. Add comments to discuss details and keep all context in one place.",
      items: [
        "Assign tasks to team members",
        "Set due dates and priority levels",
        "Comment threads for discussion"
      ],
      Icon: CheckSquare,
      reverse: true
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222222] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated Background blurs */}
      <BackgroundBlur />

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
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} index={index} reverse={feature.reverse}>
              {({ y, opacity, scale, textY }) => (
                <>
                  {feature.reverse ? (
                    <>
                      <FeatureIcon Icon={feature.Icon} style={{ y, scale, opacity }} />
                      <motion.div style={{ y: textY, opacity }}>
                        <FeatureBadge text={feature.badge} />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-3 sm:mb-4">
                          {feature.title}
                        </h2>
                        <p className="text-sm sm:text-base text-[#fffbdf]/70 mb-4 sm:mb-6 leading-relaxed">
                          {feature.description}
                        </p>
                        <ul className="space-y-2 sm:space-y-3">
                          {feature.items.map((item, i) => (
                            <FeatureListItem key={i} text={item} index={i} />
                          ))}
                        </ul>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div 
                        className="order-2 md:order-1"
                        style={{ y: textY, opacity }}
                      >
                        <FeatureBadge text={feature.badge} />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbdf] mb-3 sm:mb-4">
                          {feature.title}
                        </h2>
                        <p className="text-sm sm:text-base text-[#fffbdf]/70 mb-4 sm:mb-6 leading-relaxed">
                          {feature.description}
                        </p>
                        <ul className="space-y-2 sm:space-y-3">
                          {feature.items.map((item, i) => (
                            <FeatureListItem key={i} text={item} index={i} />
                          ))}
                        </ul>
                      </motion.div>
                      <FeatureIcon Icon={feature.Icon} className="order-1 md:order-2" style={{ y, scale, opacity }} />
                    </>
                  )}
                </>
              )}
            </FeatureCard>
          ))}
        </div>

        {/* CTA Section with scroll animation */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mt-16 sm:mt-20 md:mt-24 px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.3 }}
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

export default memo(Features);
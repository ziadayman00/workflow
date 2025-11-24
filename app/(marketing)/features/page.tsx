'use client'
import React, { useRef, memo, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

interface FeatureCardProps {
  children: (props: {
    y: MotionValue<number>;
    opacity: MotionValue<number>;
    scale: MotionValue<number>;
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

  // Memoized transform ranges
  const transforms = useMemo(() => ({
    yRange: [40, 0, -40] as [number, number, number],
    opacityRange: [0, 1, 1] as [number, number, number],
    scaleRange: [0.95, 1, 0.95] as [number, number, number]
  }), []);

  // Simplified transform values
  const y = useTransform(scrollYProgress, [0, 0.5, 1], transforms.yRange);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7], transforms.opacityRange);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], transforms.scaleRange);

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
      {children({ y, opacity, scale })}
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Memoized feature list item component
const FeatureListItem = memo(({ text, index }: { text: string; index: number }) => (
  <motion.li 
    className="flex items-start gap-3 text-base text-[#fffbdf]/75 leading-relaxed"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.8, margin: "0px" }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
  >
    <span className="text-[#fffbdf] mt-0.5 font-semibold text-lg">✓</span>
    <span>{text}</span>
  </motion.li>
));

FeatureListItem.displayName = "FeatureListItem";

// Memoized badge component
const FeatureBadge = memo(({ text }: { text: string }) => (
  <motion.div 
    className="inline-block px-4 py-1.5 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-full text-[#fffbdf] text-sm font-medium mb-5"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.8, margin: "0px" }}
    transition={{ duration: 0.3 }}
  >
    {text}
  </motion.div>
));

FeatureBadge.displayName = "FeatureBadge";

// Memoized image component
const FeatureImage = memo(({ src, alt, ...motionProps }: { src: string; alt: string } & any) => (
  <motion.div 
    className="relative border border-[#fffbdf]/15 rounded-2xl overflow-hidden will-change-transform"
    whileHover={{ borderColor: 'rgba(255, 251, 223, 0.25)' }}
    transition={{ duration: 0.3 }}
    {...motionProps}
  >
    {/* Subtle glow effect */}
    <div className="absolute inset-0 bg-[#fffbdf]/3 blur-xl -z-10 group-hover:bg-[#fffbdf]/5 transition-all duration-300" />
    <img 
      src={src}
      alt={alt}
      className="w-full h-auto"
      loading="lazy"
      decoding="async"
    />
  </motion.div>
));

FeatureImage.displayName = "FeatureImage";

// Simplified background blur component
const BackgroundBlur = memo(() => (
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-[#fffbdf] rounded-full filter blur-[80px]" />
    <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#fffbdf] rounded-full filter blur-[80px]" />
  </div>
));

BackgroundBlur.displayName = "BackgroundBlur";

function Features() {
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);
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
      image: "drag.png",
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
      image: "activity.png",
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
      image: "team.png",
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
      image: "progress.png",
      reverse: true
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222222] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
      {/* Static Background blurs */}
      <BackgroundBlur />

      <div className="relative z-10 px-4 sm:px-6 py-20 md:py-28">
        {/* Header with parallax */}
        <motion.div 
          ref={headerRef}
          className="max-w-4xl mx-auto text-center mb-16 sm:mb-20 md:mb-28"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#fffbdf] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Everything you need to manage your team
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-[#fffbdf]/60 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Workflow brings together all the tools your team needs to
            collaborate, track progress, and ship faster.
          </motion.p>
        </motion.div>

        {/* Features Grid with scroll animations */}
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28 md:space-y-40">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} index={index} reverse={feature.reverse}>
              {({ y, opacity, scale }) => (
                <>
                  {feature.reverse ? (
                    <>
                      <FeatureImage 
                        src={feature.image} 
                        alt={feature.title}
                        style={{ y, scale, opacity }} 
                      />
                      <motion.div 
                        style={{ opacity }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3, margin: "0px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <FeatureBadge text={feature.badge} />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffbdf] mb-4 leading-tight">
                          {feature.title}
                        </h2>
                        <p className="text-base sm:text-lg text-[#fffbdf]/60 mb-8 leading-relaxed">
                          {feature.description}
                        </p>
                        <ul className="space-y-4">
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
                        style={{ opacity }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3, margin: "0px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <FeatureBadge text={feature.badge} />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffbdf] mb-4 leading-tight">
                          {feature.title}
                        </h2>
                        <p className="text-base sm:text-lg text-[#fffbdf]/60 mb-8 leading-relaxed">
                          {feature.description}
                        </p>
                        <ul className="space-y-4">
                          {feature.items.map((item, i) => (
                            <FeatureListItem key={i} text={item} index={i} />
                          ))}
                        </ul>
                      </motion.div>
                      <FeatureImage 
                        src={feature.image} 
                        alt={feature.title}
                        className="order-1 md:order-2" 
                        style={{ y, scale, opacity }} 
                      />
                    </>
                  )}
                </>
              )}
            </FeatureCard>
          ))}
        </div>

        {/* CTA Section with scroll animation */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mt-20 sm:mt-28 md:mt-40 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px", amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffbdf] mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-lg sm:text-xl text-[#fffbdf]/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join teams who are already working smarter with Workflow.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <motion.button 
              className="bg-[#fffbdf] px-8 py-4 text-base font-semibold text-[#222222] hover:bg-[#fff5b8] transition-all rounded-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button 
              className="bg-transparent border-2 border-[#fffbdf]/20 px-8 py-4 text-base font-semibold text-[#fffbdf] hover:border-[#fffbdf]/40 hover:bg-[#fffbdf]/5 transition-all rounded-xl w-full sm:w-auto"
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
'use client'
import React, { useRef, useState, useCallback, useMemo, memo } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Clock,
} from "lucide-react";

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

// Memoized Contact Card Component
const ContactCard = memo(({ icon: Icon, title, subtitle, content, href, delay }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  href?: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay }}
    className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6 flex items-start gap-4"
    whileHover={{ scale: 1.02, borderColor: "rgba(255, 251, 223, 0.3)" }}
  >
    <div className="bg-[#fffbdf]/10 p-3 rounded-lg flex-shrink-0">
      <Icon className="w-6 h-6 text-[#fffbdf]" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-[#fffbdf] mb-1">{title}</h3>
      <p className="text-sm text-[#fffbdf]/70 mb-2">{subtitle}</p>
      {href ? (
        <a href={href} className="text-[#fffbdf] hover:text-[#fff5b8] transition-colors">
          {content}
        </a>
      ) : (
        <div className="text-[#fffbdf]">{content}</div>
      )}
    </div>
  </motion.div>
));

ContactCard.displayName = "ContactCard";

// Memoized Form Input Component
const FormInput = memo(({ 
  id, 
  name, 
  label, 
  type = "text", 
  required = false,
  placeholder,
  value,
  onChange,
  rows
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
}) => {
  const InputComponent = rows ? 'textarea' : 'input';
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#fffbdf]/80 mb-2">
        {label} {required && '*'}
      </label>
      <InputComponent
        type={!rows ? type : undefined}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder-[#fffbdf]/40 focus:outline-none focus:border-[#fffbdf]/50 focus:ring-2 focus:ring-[#fffbdf]/20 transition-all resize-none"
        placeholder={placeholder}
      />
    </div>
  );
});

FormInput.displayName = "FormInput";

function ContactUs() {
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  // Memoized submit handler
  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  }, [formData]);

  // Memoized change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoized contact info data
  const contactInfo = useMemo(() => [
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "Drop us a line anytime",
      content: "hello@workflow.com",
      href: "mailto:hello@workflow.com",
      delay: 0.4
    },
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "Mon-Fri from 8am to 5pm",
      content: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      delay: 0.45
    },
    {
      icon: MapPin,
      title: "Visit Us",
      subtitle: "Come say hello",
      content: (
        <>
          123 Workflow Street<br />
          San Francisco, CA 94103
        </>
      ),
      delay: 0.5
    }
  ], []);

  // Memoized support hours
  const supportHours = useMemo(() => [
    { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM EST", active: true },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST", active: true },
    { day: "Sunday", hours: "Closed", active: false }
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
            Let's start a conversation
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-[#fffbdf]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Have questions about Workflow? Want to explore how we can help your team?
            We'd love to hear from you.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 lg:items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fffbdf] mb-6">
              Send us a message
            </h2>
            <div className="space-y-4">
              <FormInput
                id="name"
                name="name"
                label="Your Name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              <FormInput
                id="company"
                name="company"
                label="Company"
                placeholder="Your Company"
                value={formData.company}
                onChange={handleChange}
              />

              <FormInput
                id="message"
                name="message"
                label="Message"
                required
                placeholder="Tell us about your project or question..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
              />

              <motion.button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#fffbdf] px-6 py-3 text-base font-medium text-[#222222] hover:bg-[#fff5b8] transition-all rounded-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Info & Cards */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <ContactCard key={index} {...info} />
              ))}
            </div>

            {/* Support Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#fffbdf]" />
                <h3 className="text-xl font-semibold text-[#fffbdf]">Support Hours</h3>
              </div>
              <div className="space-y-2 text-[#fffbdf]/80">
                {supportHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{schedule.day}</span>
                    <span className={schedule.active ? "text-[#fffbdf]" : "text-[#fffbdf]/60"}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-6 h-6 text-[#fffbdf]" />
                <h3 className="text-xl font-semibold text-[#fffbdf]">Have questions?</h3>
              </div>
              <p className="text-[#fffbdf]/70 mb-4">
                Check out our FAQ section for quick answers to common questions.
              </p>
              <motion.button
                className="text-[#fffbdf] border border-[#fffbdf]/30 px-4 py-2 rounded-lg hover:border-[#fffbdf]/50 hover:bg-[#fffbdf]/5 transition-all text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View FAQ
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-4xl mx-auto text-center mt-16 sm:mt-20 px-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#fffbdf] mb-4">
            Prefer to chat live?
          </h2>
          <p className="text-base sm:text-lg text-[#fffbdf]/70 mb-6">
            Our team is available for real-time support during business hours.
          </p>
          <motion.button
            className="bg-transparent border border-[#fffbdf]/30 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-[#fffbdf] hover:border-[#fffbdf]/50 hover:bg-[#fffbdf]/5 transition-all rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Live Chat
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(ContactUs)
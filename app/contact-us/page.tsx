'use client'
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Clock,
} from "lucide-react";

export default function ContactUs() {
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#fffbdf]/80 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder-[#fffbdf]/40 focus:outline-none focus:border-[#fffbdf]/50 focus:ring-2 focus:ring-[#fffbdf]/20 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#fffbdf]/80 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder-[#fffbdf]/40 focus:outline-none focus:border-[#fffbdf]/50 focus:ring-2 focus:ring-[#fffbdf]/20 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-[#fffbdf]/80 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder-[#fffbdf]/40 focus:outline-none focus:border-[#fffbdf]/50 focus:ring-2 focus:ring-[#fffbdf]/20 transition-all"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#fffbdf]/80 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] placeholder-[#fffbdf]/40 focus:outline-none focus:border-[#fffbdf]/50 focus:ring-2 focus:ring-[#fffbdf]/20 transition-all resize-none"
                  placeholder="Tell us about your project or question..."
                />
              </div>

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
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              {/* Email Card */}
              <motion.div
                className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6 flex items-start gap-4"
                whileHover={{ scale: 1.02, borderColor: "rgba(255, 251, 223, 0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-[#fffbdf]/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-[#fffbdf]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#fffbdf] mb-1">Email Us</h3>
                  <p className="text-sm text-[#fffbdf]/70 mb-2">Drop us a line anytime</p>
                  <a href="mailto:hello@workflow.com" className="text-[#fffbdf] hover:text-[#fff5b8] transition-colors">
                    hello@workflow.com
                  </a>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6 flex items-start gap-4"
                whileHover={{ scale: 1.02, borderColor: "rgba(255, 251, 223, 0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-[#fffbdf]/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-[#fffbdf]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#fffbdf] mb-1">Call Us</h3>
                  <p className="text-sm text-[#fffbdf]/70 mb-2">Mon-Fri from 8am to 5pm</p>
                  <a href="tel:+15551234567" className="text-[#fffbdf] hover:text-[#fff5b8] transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </motion.div>

              {/* Location Card */}
              <motion.div
                className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6 flex items-start gap-4"
                whileHover={{ scale: 1.02, borderColor: "rgba(255, 251, 223, 0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-[#fffbdf]/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#fffbdf]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#fffbdf] mb-1">Visit Us</h3>
                  <p className="text-sm text-[#fffbdf]/70 mb-2">Come say hello</p>
                  <p className="text-[#fffbdf]">
                    123 Workflow Street<br />
                    San Francisco, CA 94103
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Support Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#fffbdf]" />
                <h3 className="text-xl font-semibold text-[#fffbdf]">Support Hours</h3>
              </div>
              <div className="space-y-2 text-[#fffbdf]/80">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-[#fffbdf]">8:00 AM - 8:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-[#fffbdf]">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#fffbdf]/60">Closed</span>
                </div>
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
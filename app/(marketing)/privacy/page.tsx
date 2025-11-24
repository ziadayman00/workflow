'use client';
import React, { useState, useEffect } from "react";
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Globe, FileText, AlertCircle, CheckCircle, Download, Mail, Server, Cookie } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickLinks = [
    { icon: Database, title: "Data Collection", number: "2" },
    { icon: Eye, title: "Usage", number: "3" },
    { icon: Users, title: "Sharing", number: "4" },
    { icon: Lock, title: "Security", number: "5" },
    { icon: Shield, title: "Your Rights", number: "6" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] text-[#fffbdf] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#fffbdf]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fffbdf]/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#fffbdf]/3 rounded-full blur-3xl animate-pulse"></div>
      </div>



      <div className="max-w-6xl mx-auto py-20 px-4 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[#fffbdf]/70 hover:text-[#fffbdf] transition-all duration-300 mb-12 group hover:gap-3"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </button>

          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-[#fffbdf]/10 rounded-2xl backdrop-blur-sm border border-[#fffbdf]/20 mb-6 animate-pulse">
              <Lock className="w-12 h-12 text-[#fffbdf]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#fffbdf] via-[#fff5b8] to-[#fffbdf] bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-[#fffbdf]/60 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Quick navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {quickLinks.map((link, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-2 px-4 py-2 bg-[#fffbdf]/5 hover:bg-[#fffbdf]/10 border border-[#fffbdf]/10 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <link.icon className="w-4 h-4 text-[#fffbdf]/70 group-hover:text-[#fffbdf] transition-colors" />
                <span className="text-sm text-[#fffbdf]/70 group-hover:text-[#fffbdf] transition-colors">{link.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {/* Section 1 - Introduction */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                1
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Introduction</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg">
              Welcome to Workflow ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our workflow management application.
            </p>
          </div>

          {/* Section 2 - Information We Collect */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                2
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Information We Collect</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10">
                <h3 className="text-xl font-semibold text-[#fffbdf] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  2.1 Information You Provide
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Account Information", desc: "Name, email address, profile picture (from OAuth providers)" },
                    { label: "Project Data", desc: "Projects, tasks, comments, and other content you create" },
                    { label: "Team Information", desc: "Team names, member invitations, and collaboration data" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#fffbdf]/5 rounded-xl border border-[#fffbdf]/10 hover:bg-[#fffbdf]/10 transition-all">
                      <div className="font-semibold text-[#fffbdf] mb-1">{item.label}</div>
                      <div className="text-[#fffbdf]/70 text-sm">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10">
                <h3 className="text-xl font-semibold text-[#fffbdf] mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  2.2 Automatically Collected Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Usage Data", desc: "Pages visited, features used, time spent on the application" },
                    { label: "Device Information", desc: "Browser type, operating system, IP address" },
                    { label: "Cookies", desc: "Session cookies for authentication and functionality" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#fffbdf]/5 rounded-lg hover:bg-[#fffbdf]/10 transition-all">
                      <Cookie className="w-4 h-4 text-[#fffbdf] flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-[#fffbdf] text-sm">{item.label}</div>
                        <div className="text-[#fffbdf]/70 text-sm">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 - How We Use Your Information */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                3
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">How We Use Your Information</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg mb-6">
              We use the information we collect to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Provide, maintain, and improve our services",
                "Authenticate your account and provide access to your data",
                "Enable collaboration features within teams and projects",
                "Send you important updates about your account and projects",
                "Respond to your support requests and feedback",
                "Monitor and analyze usage patterns to improve user experience",
                "Detect and prevent fraud, abuse, and security issues"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-[#fffbdf]/5 rounded-xl border border-[#fffbdf]/10 hover:bg-[#fffbdf]/10 transition-all duration-300 hover:scale-105">
                  <CheckCircle className="w-5 h-5 text-[#fffbdf] flex-shrink-0 mt-0.5" />
                  <span className="text-[#fffbdf]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 - Information Sharing */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                4
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Information Sharing</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4 bg-[#fffbdf]/10 border border-[#fffbdf]/20 rounded-xl mb-6 flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#fffbdf] flex-shrink-0 mt-0.5" />
              <p className="text-[#fffbdf] font-medium">We do not sell your personal information.</p>
            </div>

            <p className="text-[#fffbdf]/80 mb-6">We may share your information in the following circumstances:</p>

            <div className="space-y-4">
              {[
                { title: "With Team Members", desc: "Project and task data is shared with team members you invite", icon: Users },
                { title: "Service Providers", desc: "Third-party services that help us operate our platform (hosting, analytics, email)", icon: Server },
                { title: "Legal Requirements", desc: "When required by law or to protect our rights and safety", icon: FileText },
                { title: "Business Transfers", desc: "In connection with a merger, acquisition, or sale of assets", icon: Globe }
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10 hover:border-[#fffbdf]/20 transition-all hover:scale-[1.01]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#fffbdf]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#fffbdf]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#fffbdf] mb-1">{item.title}</h3>
                      <p className="text-[#fffbdf]/70">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 - Data Security */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/8 to-transparent border-2 border-[#fffbdf]/20 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/30 to-[#fffbdf]/10 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/30">
                5
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Data Security</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information. This includes:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: Lock, text: "Encryption of data in transit (HTTPS/TLS)" },
                { icon: Shield, text: "Secure authentication via OAuth 2.0" },
                { icon: AlertCircle, text: "Regular security audits and updates" },
                { icon: CheckCircle, text: "Access controls and authentication requirements" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-[#fffbdf]/10 rounded-xl border border-[#fffbdf]/20 hover:bg-[#fffbdf]/15 transition-all">
                  <item.icon className="w-5 h-5 text-[#fffbdf] flex-shrink-0 mt-0.5" />
                  <span className="text-[#fffbdf]/80">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#fffbdf]/5 border border-[#fffbdf]/10 rounded-xl">
              <p className="text-[#fffbdf]/70 text-sm">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Section 6 - Your Rights */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/8 to-transparent border-2 border-[#fffbdf]/20 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/30 to-[#fffbdf]/10 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/30">
                6
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Your Rights</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg mb-6">You have the right to:</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { title: "Access", desc: "Request a copy of your personal data", icon: Eye },
                { title: "Correction", desc: "Update or correct inaccurate information", icon: FileText },
                { title: "Deletion", desc: "Request deletion of your account and associated data", icon: AlertCircle },
                { title: "Export", desc: "Download your data in a portable format", icon: Download },
                { title: "Opt-out", desc: "Unsubscribe from marketing communications", icon: Mail }
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-[#fffbdf]/10 rounded-2xl border border-[#fffbdf]/20 hover:border-[#fffbdf]/30 transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-[#fffbdf]" />
                    <h3 className="text-lg font-semibold text-[#fffbdf]">{item.title}</h3>
                  </div>
                  <p className="text-[#fffbdf]/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[#fffbdf]/10 rounded-2xl border border-[#fffbdf]/20 backdrop-blur-sm">
              <p className="text-[#fffbdf]/80">
                To exercise these rights, please contact us at{" "}
                <span className="text-[#fffbdf] font-medium">privacy@workflow.com</span>
              </p>
            </div>
          </div>

          {/* Remaining sections in compact format */}
          {[
            {
              num: "7",
              title: "Data Retention",
              content: "We retain your personal information for as long as your account is active or as needed to provide you services. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal purposes."
            },
            {
              num: "8",
              title: "Third-Party Services",
              content: "We use Google OAuth and GitHub OAuth for authentication (subject to their respective Privacy Policies), and Vercel for hosting and infrastructure. These services have their own privacy policies, and we encourage you to review them."
            },
            {
              num: "9",
              title: "Children's Privacy",
              content: "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately."
            },
            {
              num: "10",
              title: "International Data Transfers",
              content: "Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our service, you consent to such transfers."
            },
            {
              num: "11",
              title: "Changes to This Policy",
              content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. Your continued use of the service after changes constitutes acceptance of the updated policy."
            }
          ].map((section) => (
            <div key={section.num} className="group p-6 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-2xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#fffbdf]/10 rounded-lg flex items-center justify-center text-lg font-bold border border-[#fffbdf]/15">
                  {section.num}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffbdf] group-hover:text-[#fff5b8] transition-colors">{section.title}</h2>
                </div>
              </div>
              <p className="text-[#fffbdf]/70 leading-relaxed pl-13">{section.content}</p>
            </div>
          ))}

          {/* Contact Section */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/8 to-transparent border-2 border-[#fffbdf]/20 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/30 to-[#fffbdf]/10 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/30">
                12
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Contact Us</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 mb-6">If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
            <div className="p-6 bg-[#fffbdf]/10 rounded-2xl border border-[#fffbdf]/20 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#fffbdf]" />
                <div>
                  <p className="text-[#fffbdf]/60 text-sm">Email</p>
                  <p className="text-[#fffbdf] font-medium">privacy@workflow.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#fffbdf]" />
                <div>
                  <p className="text-[#fffbdf]/60 text-sm">Address</p>
                  <p className="text-[#fffbdf] font-medium">[Your Company Address]</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#fffbdf]/10">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[#fffbdf] hover:text-[#fff5b8] transition-all duration-300 group hover:gap-3"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
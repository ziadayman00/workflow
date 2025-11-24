'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Users, Lock, FileText, AlertCircle, CheckCircle, Briefcase, Globe } from "lucide-react";

export default function TermsPage() {
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

  const sections = [
    { icon: CheckCircle, title: "Acceptance", number: "1" },
    { icon: FileText, title: "Service", number: "2" },
    { icon: Users, title: "Accounts", number: "3" },
    { icon: Shield, title: "Conduct", number: "4" },
    { icon: Lock, title: "Privacy", number: "7" },
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
          <Link 
            href="/signin" 
            className="inline-flex items-center gap-2 text-[#fffbdf]/70 hover:text-[#fffbdf] transition-all duration-300 mb-12 group hover:gap-3"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-[#fffbdf]/10 rounded-2xl backdrop-blur-sm border border-[#fffbdf]/20 mb-6 animate-pulse">
              <Shield className="w-12 h-12 text-[#fffbdf]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#fffbdf] via-[#fff5b8] to-[#fffbdf] bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-[#fffbdf]/60 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Quick navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-2 px-4 py-2 bg-[#fffbdf]/5 hover:bg-[#fffbdf]/10 border border-[#fffbdf]/10 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <section.icon className="w-4 h-4 text-[#fffbdf]/70 group-hover:text-[#fffbdf] transition-colors" />
                <span className="text-sm text-[#fffbdf]/70 group-hover:text-[#fffbdf] transition-colors">{section.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                1
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Acceptance of Terms</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg">
              By accessing and using Workflow ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </div>

          {/* Section 2 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                2
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Description of Service</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg mb-6">
              Workflow is a project and task management platform that enables teams to collaborate, organize work, and track progress. The Service includes:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Project and task management tools",
                "Team collaboration features",
                "Real-time updates and notifications",
                "File and comment sharing",
                "Activity tracking and reporting"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-[#fffbdf]/5 rounded-xl border border-[#fffbdf]/10 hover:bg-[#fffbdf]/10 transition-all duration-300 hover:scale-105">
                  <CheckCircle className="w-5 h-5 text-[#fffbdf] flex-shrink-0 mt-0.5" />
                  <span className="text-[#fffbdf]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                3
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">User Accounts</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="pl-6 border-l-2 border-[#fffbdf]/20 hover:border-[#fffbdf]/40 transition-colors">
                <h3 className="text-xl font-semibold text-[#fffbdf] mb-3">3.1 Account Creation</h3>
                <p className="text-[#fffbdf]/80 mb-4">
                  To use the Service, you must create an account using a supported authentication provider (Google or GitHub). You agree to:
                </p>
                <div className="space-y-2">
                  {[
                    "Provide accurate and complete information",
                    "Maintain the security of your account",
                    "Promptly update any changes to your information",
                    "Accept responsibility for all activities under your account"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 hover:translate-x-1 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#fffbdf] mt-2 flex-shrink-0"></div>
                      <span className="text-[#fffbdf]/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pl-6 border-l-2 border-[#fffbdf]/20 hover:border-[#fffbdf]/40 transition-colors">
                <h3 className="text-xl font-semibold text-[#fffbdf] mb-3">3.2 Account Termination</h3>
                <p className="text-[#fffbdf]/80">
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activities.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                4
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">User Conduct</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="p-4 bg-[#fffbdf]/5 border border-[#fffbdf]/10 rounded-xl mb-4">
              <p className="text-[#fffbdf]/80 font-medium">You agree not to:</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Use the Service for any illegal or unauthorized purpose",
                "Violate any laws in your jurisdiction",
                "Infringe upon the rights of others",
                "Upload malicious code, viruses, or harmful content",
                "Attempt to gain unauthorized access to the Service",
                "Interfere with or disrupt the Service or servers",
                "Harass, abuse, or harm other users",
                "Impersonate any person or entity",
                "Collect or store personal data of other users"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-[#fffbdf]/3 rounded-lg hover:bg-[#fffbdf]/8 transition-all duration-300 hover:scale-105">
                  <AlertCircle className="w-4 h-4 text-[#fffbdf]/60 flex-shrink-0 mt-0.5" />
                  <span className="text-[#fffbdf]/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                5
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Content and Intellectual Property</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10">
                <h3 className="text-xl font-semibold text-[#fffbdf] mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  5.1 Your Content
                </h3>
                <p className="text-[#fffbdf]/80 mb-4">
                  You retain all rights to the content you create, upload, or share through the Service ("User Content"). By using the Service, you grant us a limited license to:
                </p>
                <div className="space-y-2">
                  {[
                    "Store, process, and display your User Content",
                    "Enable collaboration features with your team members",
                    "Back up and secure your data"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#fffbdf]/5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#fffbdf] mt-1.5 flex-shrink-0"></div>
                      <span className="text-[#fffbdf]/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10">
                <h3 className="text-xl font-semibold text-[#fffbdf] mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  5.2 Our Intellectual Property
                </h3>
                <p className="text-[#fffbdf]/80 mb-4">
                  The Service, including its design, features, and functionality, is owned by us and protected by copyright, trademark, and other intellectual property laws. You may not:
                </p>
                <div className="space-y-2">
                  {[
                    "Copy, modify, or distribute the Service",
                    "Reverse engineer or decompile the Service",
                    "Remove any copyright or proprietary notices",
                    "Use our trademarks without permission"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#fffbdf]/5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-[#fffbdf]/60 mt-0.5 flex-shrink-0" />
                      <span className="text-[#fffbdf]/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/5 to-transparent border border-[#fffbdf]/10 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/20 to-[#fffbdf]/5 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/20">
                6
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Team and Project Management</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10 hover:border-[#fffbdf]/20 transition-all">
                <Users className="w-8 h-8 text-[#fffbdf] mb-3" />
                <h3 className="text-lg font-semibold text-[#fffbdf] mb-2">Team Ownership</h3>
                <p className="text-[#fffbdf]/70 text-sm">
                  The person who creates a team is the team administrator and has full control over team settings, members, and projects.
                </p>
              </div>
              
              <div className="p-5 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10 hover:border-[#fffbdf]/20 transition-all">
                <Lock className="w-8 h-8 text-[#fffbdf] mb-3" />
                <h3 className="text-lg font-semibold text-[#fffbdf] mb-2">Project Access</h3>
                <p className="text-[#fffbdf]/70 text-sm">
                  Access to projects is controlled by project owners and administrators. You can only access projects to which you have been explicitly invited.
                </p>
              </div>

              <div className="p-5 bg-[#fffbdf]/5 rounded-2xl border border-[#fffbdf]/10 hover:border-[#fffbdf]/20 transition-all">
                <Briefcase className="w-8 h-8 text-[#fffbdf] mb-3" />
                <h3 className="text-lg font-semibold text-[#fffbdf] mb-2">Data Responsibility</h3>
                <p className="text-[#fffbdf]/70 text-sm">
                  Team administrators and project owners are responsible for managing access to their data and ensuring compliance with applicable laws.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="group p-8 bg-gradient-to-br from-[#fffbdf]/8 to-transparent border-2 border-[#fffbdf]/20 rounded-3xl backdrop-blur-sm hover:border-[#fffbdf]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fffbdf]/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#fffbdf]/30 to-[#fffbdf]/10 rounded-xl flex items-center justify-center text-xl font-bold border border-[#fffbdf]/30">
                7
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Privacy and Data Protection</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 leading-relaxed text-lg mb-4">
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
            <Link href="/privacy" className="inline-flex items-center gap-2 px-6 py-3 bg-[#fffbdf]/10 hover:bg-[#fffbdf]/15 text-[#fffbdf] rounded-xl border border-[#fffbdf]/20 transition-all duration-300 hover:scale-105 font-medium">
              View Privacy Policy →
            </Link>
          </div>

          {/* Remaining sections in compact format */}
          {[
            {
              num: "8",
              title: "Service Availability",
              content: "We strive to provide reliable service, but we do not guarantee that the Service will be available at all times without interruption, free from errors, bugs, or security vulnerabilities, or compatible with all devices and browsers. We reserve the right to modify, suspend, or discontinue the Service at any time."
            },
            {
              num: "9",
              title: "Limitation of Liability",
              content: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities. Our total liability shall not exceed the amount you paid us in the past 12 months, or $100, whichever is greater."
            },
            {
              num: "10",
              title: "Indemnification",
              content: "You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, violation of these Terms, violation of any rights of another party, or your User Content."
            },
            {
              num: "11",
              title: "Disclaimer of Warranties",
              content: "THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, OR SECURITY."
            },
            {
              num: "12",
              title: "Dispute Resolution",
              content: "These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, except where prohibited by law."
            },
            {
              num: "13",
              title: "Changes to Terms",
              content: "We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page, updating the 'Last updated' date, and sending email notifications for significant changes. Your continued use of the Service after changes constitutes acceptance."
            },
            {
              num: "14",
              title: "Severability",
              content: "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect."
            },
            {
              num: "15",
              title: "Entire Agreement",
              content: "These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the use of the Service and supersede all prior agreements."
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
                16
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#fffbdf] mb-2 group-hover:text-[#fff5b8] transition-colors">Contact Information</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#fffbdf] to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-[#fffbdf]/80 mb-6">If you have any questions about these Terms, please contact us at:</p>
            <div className="p-6 bg-[#fffbdf]/10 rounded-2xl border border-[#fffbdf]/20 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#fffbdf]" />
                <div>
                  <p className="text-[#fffbdf]/60 text-sm">Email</p>
                  <p className="text-[#fffbdf] font-medium">legal@workflow.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-[#fffbdf]" />
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
          <Link 
            href="/signin" 
            className="inline-flex items-center gap-2 text-[#fffbdf] hover:text-[#fff5b8] transition-all duration-300 group hover:gap-3"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
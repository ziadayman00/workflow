"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading("google");
      await signIn("google", { 
        callbackUrl: "/dashboard" // Redirect after successful sign in
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsLoading(null);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading("github");
      await signIn("github", { 
        callbackUrl: "/dashboard" // Redirect after successful sign in
      });
    } catch (error) {
      console.error("GitHub sign in error:", error);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222222] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#fffbdf] rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fffbdf] rounded-full filter blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#fffbdf] rounded-full filter blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md ">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="text-center mb-8">
          <p className="text-[#fffbdf]/70 text-sm md:text-base font-thin">
            Sign in to continue to your account
          </p>
        </div>

        <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#fffbdf]/10 rounded-2xl p-6 md:p-8">
          <div className="space-y-4">
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] hover:border-[#fffbdf]/40 hover:bg-[#1a1a1a]/70 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={isLoading === null ? { scale: 1.02 } : {}}
              whileTap={isLoading === null ? { scale: 0.98 } : {}}
            >
              {isLoading === "google" ? (
                <div className="w-5 h-5 border-2 border-[#fffbdf]/30 border-t-[#fffbdf] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </motion.button>

            <motion.button
              onClick={handleGitHubSignIn}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#1a1a1a]/50 border border-[#fffbdf]/20 rounded-lg text-[#fffbdf] hover:border-[#fffbdf]/40 hover:bg-[#1a1a1a]/70 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={isLoading === null ? { scale: 1.02 } : {}}
              whileTap={isLoading === null ? { scale: 0.98 } : {}}
            >
              {isLoading === "github" ? (
                <div className="w-5 h-5 border-2 border-[#fffbdf]/30 border-t-[#fffbdf] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              )}
              Continue with GitHub
            </motion.button>
          </div>

          <p className="text-xs text-[#fffbdf]/60 text-center mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#fffbdf] hover:text-[#fff5b8] transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#fffbdf] hover:text-[#fff5b8] transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#fffbdf]/70 hover:text-[#fffbdf] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
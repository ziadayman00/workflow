import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Workflow — Team Task & Project Manager",
    template: "%s | Workflow",
  },
  description:
    "Workflow is a modern, fast, and collaborative workspace to manage tasks, teams, and projects with real-time updates, Kanban boards, comments, and more.",
  keywords: [
    "project management",
    "task manager",
    "kanban board",
    "team collaboration",
    "workflow app",
    "task tracking",
    "productivity",
    "nextjs",
    "saas",
  ],
  authors: [{ name: "Ziad Ayman" }],
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "https://your-domain.com",
  },
  openGraph: {
    title: "Workflow — Modern Team & Task Management",
    description:
      "A clean and fast workspace to organize tasks, track progress, collaborate with teams, and manage projects all in one place.",
    url: "https://your-domain.com",
    siteName: "Workflow",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Workflow Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workflow — Modern Team & Task Management",
    description:
      "Manage tasks, teams, projects, and workflows with real-time updates in one clean dashboard.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

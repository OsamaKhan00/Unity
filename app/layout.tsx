import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/PublicShell";

export const metadata: Metadata = {
  title: "Apex Talent Group — Precision Recruitment for IT, Data Center & Pharma",
  description: "Seattle-based specialized recruitment firm connecting exceptional talent with industry-leading organizations across IT, Data Center, and Pharmaceutical sectors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased font-sans">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}

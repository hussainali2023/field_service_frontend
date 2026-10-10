import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";

export const metadata: Metadata = {
  title: "FieldPulse | Field Service Management Platform",
  description:
    "End-to-end field service management software. Dispatching, work orders, on-site technician reporting, invoices, and verified Stripe payments.",
  keywords: [
    "Field Service Management",
    "FSM",
    "Work Order Tracking",
    "Technician Dispatch",
    "Stripe Invoicing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

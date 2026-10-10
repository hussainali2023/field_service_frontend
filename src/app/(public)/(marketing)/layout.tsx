import * as React from "react";
import { PublicHeader } from "@/components/layout/public/Header";
import { PublicFooter } from "@/components/layout/public/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

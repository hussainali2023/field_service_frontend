import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Users, Clock, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 space-y-16">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="outline" className="text-primary border-primary/30">
          About FieldPulse
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Setting the standard for modern field service operations.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          FieldPulse was founded to eliminate the frustration of delayed service calls, surprise invoices, and opaque work orders. We provide residential and commercial customers with instant technician matching, real-time dispatch timelines, and transparent Stripe payments.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">100% Certified Workforce</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every technician is background checked, insured, and certified in their trade with proven on-the-job track records.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
            <Award className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Transparent Upfront Pricing</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No hidden service fees. You receive estimates before work begins and pay only after inspecting completed service reports.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
            <Clock className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Strict On-Time SLA</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our dispatch algorithms pair work orders based on travel radius, territory boundaries, and live technician availability.
          </p>
        </Card>
      </div>

      {/* Operational Story */}
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Our Technology & Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
          <p>
            FieldPulse is built on a resilient Next.js App Router architecture integrated with a TypeScript REST backend. We adhere to strict role-based access control across Admin, Customer, and Provider domains, ensuring private customer records and invoices remain protected.
          </p>
          <p>
            All billing is integrated with Stripe Checkout. Payment sessions are verified via secure webhook transactions and server-side reconciliation before invoices are marked as paid.
          </p>
        </div>
      </div>
    </div>
  );
}

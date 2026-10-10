"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OneClickDemoLogin from "@/components/auth/one-click-demo";
import { useServices } from "@/hooks/services.hook";
import { formatCurrency } from "@/lib/utils";
import {
  Wrench,
  ShieldCheck,
  CreditCard,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Activity,
  CalendarCheck,
  Star,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { data: servicesData, isLoading: loadingServices } = useServices({ limit: 4 });
  const services = servicesData?.data || [];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5 text-primary" />
                <span>Next-Gen Field Operations Management</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                Dispatch faster. <br />
                <span className="text-primary bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  Fix with confidence.
                </span>{" "}
                Get paid on site.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                FieldPulse connects customers, technicians, and dispatch operations in one seamless flow. From emergency leak repairs to HVAC overhauls, schedule visits and complete verified Stripe payments effortlessly.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="gap-2 shadow-md">
                  <Link href="/services">
                    <span>Explore Services</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/login">
                    <span>Test Role Sandboxes</span>
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border/60 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="font-medium text-foreground">Verified Technicians</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-indigo-600" />
                  <span className="font-medium text-foreground">Stripe Test Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-amber-600" />
                  <span className="font-medium text-foreground">Live Status Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Demo Login Box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Try Role-Based Portals
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    One-click login with instant access to role-specific capabilities.
                  </p>
                </div>

                <OneClickDemoLogin />

                <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground text-center">
                  Need custom access?{" "}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Create a new customer account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE WORKFLOW HIGHLIGHT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="outline" className="text-primary border-primary/30">
            How FieldPulse Works
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Seamless Workflow from Problem to Resolution
          </h2>
          <p className="text-sm text-muted-foreground">
            Authoritative lifecycle progression managed end-to-end with immutable status logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Customer Intake",
              desc: "Customers submit issues, select service category, and set preferred visit time slots.",
              icon: Wrench,
            },
            {
              step: "02",
              title: "Triage & Dispatch",
              desc: "Admins review scope, set price estimates, and assign certified technicians by skill.",
              icon: Users,
            },
            {
              step: "03",
              title: "On-Site Service",
              desc: "Technicians record arrival, perform work, list parts used, and file final reports.",
              icon: Activity,
            },
            {
              step: "04",
              title: "Stripe Payment & Review",
              desc: "Invoices generated instantly with secure Stripe checkout and post-service ratings.",
              icon: CreditCard,
            },
          ].map((flow) => {
            const Icon = flow.icon;
            return (
              <div
                key={flow.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-primary/80">
                      {flow.step}
                    </span>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="size-4.5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{flow.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {flow.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR SERVICES CATALOG PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="text-primary border-primary/30">
              Service Catalog
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Top Field Repair & Installation Offerings
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
            <Link href="/services">
              <span>View All Services</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingServices ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-muted/60 animate-pulse" />
            ))
          ) : services.length > 0 ? (
            services.map((srv) => (
              <Card key={srv.id} className="flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-xs">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">
                      {srv.category}
                    </Badge>
                    <span className="text-sm font-extrabold text-foreground">
                      {formatCurrency(srv.basePrice)}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">
                    {srv.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {srv.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      ~{srv.estimatedDurationHours}h duration
                    </span>
                    <Link
                      href="/dashboard/requests/new"
                      className="font-semibold text-primary hover:underline"
                    >
                      Book →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              Services are currently being loaded from backend...
            </div>
          )}
        </div>
      </section>

      {/* STATS & METRICS BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-muted/20 to-card p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">99.8%</p>
              <p className="mt-1 text-xs text-muted-foreground font-medium">On-Time Dispatch</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">4.9 ★</p>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Customer Rating</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">&lt; 2 hrs</p>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Emergency Response</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">100%</p>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Stripe Reconciled</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

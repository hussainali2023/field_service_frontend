"use client";

import Link from "next/link";
import { Wrench, Heart, Shield, CheckCircle } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wrench className="size-4" />
              </div>
              <span className="text-lg font-bold">FieldPulse</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise-grade field service operations platform. From request intake to dispatch, on-site diagnostics, instant invoicing, and verified Stripe checkout.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  HVAC Diagnostics & Repair
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Plumbing Leak Emergency
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Electrical Panel Upgrades
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Smart Thermostats & Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Role Demo Sandboxes
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Trust & Security
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Shield className="size-3.5 text-emerald-600" />
                <span>Stripe Certified Test Integration</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                All client-initiated payments are verified cryptographically with Stripe Webhook & server transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} FieldPulse Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built for Modern Field Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { RequestWizard } from "@/components/modules/request-wizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewServiceRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Request Certified Service
          </h1>
          <p className="text-xs text-muted-foreground">
            Book professional diagnostics, repairs, or installations with upfront pricing.
          </p>
        </div>
      </div>

      <RequestWizard />
    </div>
  );
}

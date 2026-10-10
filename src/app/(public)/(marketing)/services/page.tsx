"use client";

import * as React from "react";
import Link from "next/link";
import { useServices } from "@/hooks/services.hook";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, Clock, Search, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");

  const { data: servicesData, isLoading } = useServices();
  const allServices = servicesData?.data || [];

  const categories = ["ALL", ...Array.from(new Set(allServices.map((s) => s.category)))];

  const filteredServices = allServices.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <Badge variant="outline" className="text-primary border-primary/30">
          Official Service Catalog
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Comprehensive On-Site Repair & Installation
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse certified technician services with transparent upfront pricing, certified master technicians, and genuine parts warranty.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-md"
            >
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {service.category}
                  </Badge>
                  <span className="text-base font-extrabold text-foreground">
                    {formatCurrency(service.basePrice)}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold mt-3">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                <div className="space-y-2 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-primary" />
                    <span>Est. Service Duration: {service.estimatedDurationHours} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Includes Diagnostic Assessment & Tools</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full gap-2">
                    <Link href={`/dashboard/requests/new`}>
                      <span>Book Service</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <Wrench className="size-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No services found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or explore other categories.
          </p>
        </div>
      )}
    </div>
  );
}

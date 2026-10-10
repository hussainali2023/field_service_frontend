"use client";

import * as React from "react";
import { useServices } from "@/hooks/services.hook";
import { useCreateRequest } from "@/hooks/requests.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { UrgencyLevel, Service } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Wrench,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  AlertTriangle,
} from "lucide-react";

export function RequestWizard() {
  const router = useRouter();
  const { data: servicesData, isLoading: loadingServices } = useServices();
  const { mutate: createRequest, isPending: submitting } = useCreateRequest();

  const services = servicesData?.data || [];

  // Wizard state
  const [step, setStep] = React.useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [urgency, setUrgency] = React.useState<UrgencyLevel>("MEDIUM");
  const [address, setAddress] = React.useState<string>("");
  const [preferredDate, setPreferredDate] = React.useState<string>("");
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const selectedService = services.find((s) => s.id === selectedServiceId);

  // Auto-set tomorrow morning as preferred default date
  React.useEffect(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(9, 0, 0, 0);
    setPreferredDate(tomorrow.toISOString().slice(0, 16));
  }, []);

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!selectedServiceId) {
        errs.serviceId = "Please select a service to proceed";
      }
    } else if (currentStep === 2) {
      if (!title || title.trim().length < 3) {
        errs.title = "Title must be at least 3 characters";
      }
      if (!description || description.trim().length < 10) {
        errs.description = "Please describe the problem in at least 10 characters";
      }
    } else if (currentStep === 3) {
      if (!address || address.trim().length < 5) {
        errs.address = "Please enter a valid physical address";
      }
      if (!preferredDate) {
        errs.preferredDate = "Please choose a preferred visit date";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    createRequest(
      {
        serviceId: selectedServiceId,
        title,
        description,
        address,
        urgency,
        preferredDate: new Date(preferredDate).toISOString(),
      },
      {
        onSuccess: (res: any) => {
          toast.success("Service request submitted successfully!");
          router.push(`/dashboard/requests/${res?.data?.id || ""}`);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create request");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Step Indicators */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Select Service", icon: Wrench },
            { num: 2, label: "Describe Issue", icon: Sparkles },
            { num: 3, label: "Schedule & Location", icon: MapPin },
            { num: 4, label: "Confirm Request", icon: CheckCircle2 },
          ].map((item, idx) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            const Icon = item.icon;

            return (
              <div key={item.num} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl font-bold transition-all shadow-xs ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                </div>
                <span
                  className={`text-center text-xs font-semibold ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border/80 shadow-md">
        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div>
            <CardHeader>
              <CardTitle>Choose a Certified Service Category</CardTitle>
              <CardDescription>
                Select from our vetted on-site repair and installation services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingServices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-muted/60 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((srv) => {
                    const isSelected = selectedServiceId === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => {
                          setSelectedServiceId(srv.id);
                          setErrors({});
                          if (!title) setTitle(`${srv.name} Request`);
                        }}
                        className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                            : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              {srv.category}
                            </span>
                            <span className="text-sm font-extrabold text-foreground">
                              {formatCurrency(srv.basePrice)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {srv.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {srv.description}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            ~{srv.estimatedDurationHours} hours
                          </span>
                          <span className="font-semibold text-primary">
                            {isSelected ? "Selected ✓" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.serviceId && (
                <p className="text-xs font-semibold text-destructive">{errors.serviceId}</p>
              )}
            </CardContent>
          </div>
        )}

        {/* STEP 2: ISSUE DETAILS */}
        {step === 2 && (
          <div>
            <CardHeader>
              <CardTitle>Describe Your Issue or Requirement</CardTitle>
              <CardDescription>
                Provide detailed symptoms so our certified technicians bring the right tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field data-invalid={!!errors.title}>
                  <FieldLabel htmlFor="reqTitle">Request Title</FieldLabel>
                  <Input
                    id="reqTitle"
                    placeholder="e.g. AC compressor humming and blowing warm air"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <FieldError error={errors.title} />
                </Field>

                <Field data-invalid={!!errors.description}>
                  <FieldLabel htmlFor="reqDesc">Detailed Description</FieldLabel>
                  <Textarea
                    id="reqDesc"
                    placeholder="Describe symptoms, noise, model number, error codes, when it began..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  <FieldError error={errors.description} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="urgencySelect">Urgency Priority</FieldLabel>
                  <select
                    id="urgencySelect"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="LOW">Low (Routine maintenance)</option>
                    <option value="MEDIUM">Medium (Standard repair, within 48h)</option>
                    <option value="HIGH">High (Urgent disruption, within 24h)</option>
                    <option value="EMERGENCY">Emergency (Burst pipe, power outage, immediate dispatch)</option>
                  </select>
                </Field>

                {/* Optional Issue Photos & Evidence Upload */}
                <div className="pt-2">
                  <FileUpload
                    label="Attach Equipment Photos / Evidence (Optional)"
                    helperText="Upload photos of leaking pipes, damaged unit, error codes (up to 10MB)"
                    accept="image/*,application/pdf"
                    multiple={true}
                    onChange={(urls) => setAttachments(urls)}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </div>
        )}

        {/* STEP 3: SCHEDULE & LOCATION */}
        {step === 3 && (
          <div>
            <CardHeader>
              <CardTitle>Service Location & Preferred Time</CardTitle>
              <CardDescription>
                Where should the technician arrive and what is your preferred appointment slot?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field data-invalid={!!errors.address}>
                  <FieldLabel htmlFor="serviceAddress">Physical Service Address</FieldLabel>
                  <Input
                    id="serviceAddress"
                    placeholder="Street address, unit/apt #, city, postal code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FieldError error={errors.address} />
                </Field>

                <Field data-invalid={!!errors.preferredDate}>
                  <FieldLabel htmlFor="preferredDate">Preferred Appointment Date & Time</FieldLabel>
                  <Input
                    id="preferredDate"
                    type="datetime-local"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                  <FieldError error={errors.preferredDate} />
                </Field>
              </FieldGroup>
            </CardContent>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div>
            <CardHeader>
              <CardTitle>Review & Submit Request</CardTitle>
              <CardDescription>
                Please verify the service request details before final submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-border/80 bg-muted/30 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Service
                    </span>
                    <h4 className="text-base font-bold text-foreground">
                      {selectedService?.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Est. Base Rate
                    </span>
                    <p className="text-base font-extrabold text-foreground">
                      {formatCurrency(selectedService?.basePrice)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-muted-foreground">Title:</span>
                    <p className="font-medium text-foreground mt-0.5">{title}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Urgency:</span>
                    <p className="font-medium text-foreground mt-0.5">{urgency}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Location:</span>
                    <p className="font-medium text-foreground mt-0.5">{address}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Preferred Slot:</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {new Date(preferredDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-xs text-muted-foreground">Problem Description:</span>
                  <p className="text-xs text-foreground/90 mt-1 rounded-lg bg-card p-3 border border-border/50">
                    {description}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
                <CheckCircle2 className="size-5 shrink-0 text-blue-600 mt-0.5" />
                <p>
                  Upon submission, your request will be triaged by our operations dispatch team. An eligible technician matching skills and availability will be assigned to visit your location.
                </p>
              </div>
            </CardContent>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-border/70 p-6 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || submitting}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            <span>Previous</span>
          </Button>

          {step < 4 ? (
            <Button type="button" onClick={handleNext} className="gap-2">
              <span>Continue</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="success"
              onClick={handleSubmit}
              isLoading={submitting}
              className="gap-2"
            >
              <span>Submit Service Request</span>
              <CheckCircle2 className="size-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

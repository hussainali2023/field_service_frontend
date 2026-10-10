"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequest, useSubmitReport } from "@/hooks/requests.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/components/ui/toast";
import { ArrowLeft, CheckCircle2, AlertCircle, Camera } from "lucide-react";

export default function TechnicianReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: requestData, isLoading } = useRequest(id);
  const { mutate: submitReport, isPending } = useSubmitReport();
  const request = requestData?.data;

  const [serviceReport, setServiceReport] = React.useState("");
  const [partsUsed, setPartsUsed] = React.useState("");
  const [finalPrice, setFinalPrice] = React.useState<number>(100);
  const [evidenceFiles, setEvidenceFiles] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (request) {
      setServiceReport(request.serviceReport || "");
      setPartsUsed(request.partsUsed || "");
      setFinalPrice(request.finalPrice || request.estimatedPrice || request.service?.basePrice || 100);
    }
  }, [request]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4">
        <div className="h-64 rounded-xl bg-muted/60 animate-pulse" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertCircle className="size-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Work Order Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/provider">Back to Job Queue</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceReport || serviceReport.trim().length < 10) {
      toast.error("Please describe findings in at least 10 characters");
      return;
    }

    submitReport(
      {
        id: request.id,
        payload: {
          serviceReport,
          partsUsed: partsUsed || undefined,
          finalPrice: Number(finalPrice),
        },
      },
      {
        onSuccess: () => {
          toast.success("Service report filed & work order completed!");
          router.push(`/provider/jobs/${request.id}`);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to submit report");
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
        <Link href={`/provider/jobs/${request.id}`}>
          <ArrowLeft className="size-4" />
          <span>Back to Job Instructions</span>
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>File Service Report & Complete Work Order</CardTitle>
          <CardDescription>
            Work Order #{request.requestNumber}: {request.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="reportFindings">Detailed Service Findings & Resolution</FieldLabel>
                <Textarea
                  id="reportFindings"
                  placeholder="Record diagnostic testing, repairs executed, customer sign-off..."
                  value={serviceReport}
                  onChange={(e) => setServiceReport(e.target.value)}
                  rows={4}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="reportParts">Materials & Parts Installed</FieldLabel>
                <Input
                  id="reportParts"
                  placeholder="e.g. 1x Contactor 30A, 2x Copper coupling 1/2in"
                  value={partsUsed}
                  onChange={(e) => setPartsUsed(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="reportPrice">Final Total Billing Amount ($ USD)</FieldLabel>
                <Input
                  id="reportPrice"
                  type="number"
                  step="0.01"
                  min="1"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </Field>

              {/* Service Evidence & Job Photos Upload */}
              <div className="pt-2">
                <FileUpload
                  label="Work Evidence & Diagnostic Photos"
                  helperText="Upload before/after photos, diagnostic meter readings, or receipts"
                  accept="image/*,application/pdf"
                  multiple={true}
                  onChange={(urls) => setEvidenceFiles(urls)}
                />
              </div>
            </FieldGroup>

            <Button type="submit" variant="success" isLoading={isPending} className="w-full gap-2 mt-4">
              <CheckCircle2 className="size-4" />
              <span>Submit Report & Mark Completed</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

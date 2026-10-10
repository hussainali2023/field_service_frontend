"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequest } from "@/hooks/requests.hook";
import { useCreateReview } from "@/hooks/reviews.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { Star, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: requestData, isLoading } = useRequest(id);
  const { mutate: createReview, isPending } = useCreateReview();
  const request = requestData?.data;

  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState("");

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <div className="h-64 rounded-xl bg-muted/60 animate-pulse" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertCircle className="size-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Service Order Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 3) {
      toast.error("Please enter a brief review comment (at least 3 characters)");
      return;
    }

    createReview(
      { serviceRequestId: request.id, rating, comment },
      {
        onSuccess: () => {
          toast.success("Thank you for your rating! Feedback published.");
          router.push(`/dashboard/requests/${request.id}`);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to submit review");
        },
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
        <Link href={`/dashboard/requests/${request.id}`}>
          <ArrowLeft className="size-4" />
          <span>Back to Request</span>
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Rate Service for #{request.requestNumber}</CardTitle>
          <CardDescription>
            {request.title} • Completed by {request.technician?.user?.name || "Technician"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stars */}
            <div className="flex flex-col items-center justify-center gap-2 py-4 border-y border-border/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overall Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`size-8 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">
                {rating === 5
                  ? "⭐⭐⭐⭐⭐ Outstanding Experience"
                  : rating === 4
                  ? "⭐⭐⭐⭐ Great Work"
                  : rating === 3
                  ? "⭐⭐⭐ Satisfactory"
                  : rating === 2
                  ? "⭐⭐ Fair"
                  : "⭐ Needs Improvement"}
              </span>
            </div>

            {/* Comment */}
            <Field>
              <FieldLabel htmlFor="feedbackComment">Your Review Comments</FieldLabel>
              <Textarea
                id="feedbackComment"
                placeholder="What did the technician do well? How was arrival punctuality and resolution?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />
            </Field>

            <Button type="submit" isLoading={isPending} className="w-full gap-2">
              <CheckCircle2 className="size-4" />
              <span>Submit Verified Review</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

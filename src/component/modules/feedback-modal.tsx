"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/reviews.hook";
import { toast } from "@/components/ui/toast";
import { createReviewSchema } from "@/validation";
import { Star } from "lucide-react";
import { ServiceRequest } from "@/types";

interface FeedbackModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FeedbackModal({
  request,
  open,
  onOpenChange,
  onSuccess,
}: FeedbackModalProps) {
  const { mutate: createReview, isPending } = useCreateReview();

  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setRating(5);
      setComment("");
      setErrors({});
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    const payload = {
      serviceRequestId: request.id,
      rating,
      comment,
    };

    const validation = createReviewSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    createReview(payload, {
      onSuccess: () => {
        toast.success("Thank you for your feedback! Review published.");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to submit review");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Service Experience</DialogTitle>
          <DialogDescription>
            How was the service provided by {request?.technician?.user?.name || "our technician"}?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Star Rating Selector */}
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Rating
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-muted-foreground transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`size-7 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {rating === 5
                  ? "⭐⭐⭐⭐⭐ Outstanding"
                  : rating === 4
                  ? "⭐⭐⭐⭐ Great"
                  : rating === 3
                  ? "⭐⭐⭐ Good"
                  : rating === 2
                  ? "⭐⭐ Fair"
                  : "⭐ Poor"}
              </span>
            </div>

            {/* Comments */}
            <Field data-invalid={!!errors.comment}>
              <FieldLabel htmlFor="comment">Your Review Feedback</FieldLabel>
              <Textarea
                id="comment"
                placeholder="Share your thoughts on punctuality, professionalism, repair quality..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <FieldError error={errors.comment} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

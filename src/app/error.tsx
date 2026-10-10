"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 mb-4">
        <AlertCircle className="size-8" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {error?.message || "An unexpected error occurred while processing your request."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="size-4" />
          <span>Try again</span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    />
  );
}

function Field({
  className,
  ...props
}: React.ComponentProps<"div"> & { "data-invalid"?: boolean }) {
  return (
    <div
      data-slot="field"
      className={cn(
        "flex flex-col gap-1.5 data-[invalid=true]:text-destructive",
        className
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  error,
  errors,
  ...props
}: React.ComponentProps<"p"> & {
  error?: string | null;
  errors?: Array<{ message?: string } | string | undefined>;
}) {
  const message =
    error ||
    (errors && errors.length > 0
      ? typeof errors[0] === "string"
        ? errors[0]
        : errors[0]?.message
      : null);

  if (!message) return null;

  return (
    <p
      data-slot="field-error"
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative my-2 flex items-center justify-center", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      {children && (
        <span className="relative bg-background px-2 text-xs uppercase tracking-wider text-muted-foreground">
          {children}
        </span>
      )}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
};

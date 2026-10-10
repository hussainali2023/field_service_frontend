import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading FieldPulse...
      </p>
    </div>
  );
}

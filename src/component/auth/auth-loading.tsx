import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({ label = "Authenticating..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

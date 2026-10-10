import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      className={cn("size-4 animate-spin text-muted-foreground", className)}
      {...props}
    />
  );
}

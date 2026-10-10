import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <div className="rounded-full bg-rose-50 p-4 dark:bg-rose-950/40">
        <ShieldAlert className="size-10 text-rose-600 dark:text-rose-400" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          You do not have the required permissions to access this role-restricted area.
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Switch Account</Link>
        </Button>
      </div>
    </div>
  );
}

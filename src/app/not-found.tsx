import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-xs">
        <Wrench className="size-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
        404
      </h1>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The work order, dispatch route, or page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <Home className="size-4" />
            <span>Go Home</span>
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link href="/login">
            <ArrowLeft className="size-4" />
            <span>Go to Portal</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import OneClickDemoLogin from "@/components/auth/one-click-demo";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { Wrench, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { loginSchema } from "@/validation";
import { toast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [email, setEmail] = React.useState("admin@fieldservice.com");
  const [password, setPassword] = React.useState("Admin@12345");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // If already logged in, redirect to role dashboard only after auth initialization settles
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "ADMIN") router.replace("/admin");
      else if (user.role === "TECHNICIAN") router.replace("/provider");
      else router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "ADMIN") {
        router.push("/admin");
      } else if (loggedInUser.role === "TECHNICIAN") {
        router.push("/provider");
      } else {
        router.push("/dashboard");
      }
    } catch {
      // toast shown in login
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Wrench className="size-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              FieldPulse
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="text-xs text-muted-foreground">
            Sign in to access your dispatch operations, bookings, or job desk.
          </p>
        </div>

        {/* Login Box */}
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-5">
            {/* Standard Credential Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      autoComplete="email"
                    />
                  </div>
                  <FieldError error={errors.email} />
                </Field>

                <Field data-invalid={!!errors.password}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <span className="text-[11px] text-muted-foreground hover:text-primary cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <FieldError error={errors.password} />
                </Field>

                <Button type="submit" isLoading={isLoading} className="w-full gap-2 mt-2">
                  <span>Sign In</span>
                  <ArrowRight className="size-4" />
                </Button>
              </FieldGroup>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-card px-2 text-muted-foreground font-semibold">
                  Or continue with Google
                </span>
              </div>
            </div>

            {/* Google OAuth Component */}
            <GoogleLoginComponent />

            <FieldSeparator>OR QUICK ROLE ACCESS</FieldSeparator>

            {/* Mandatory One-Click Demo Role Login Component */}
            <OneClickDemoLogin />

            <div className="text-center text-xs text-muted-foreground pt-1">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

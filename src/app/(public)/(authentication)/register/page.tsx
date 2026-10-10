"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
import { useRegister } from "@/hooks/auth.hook";
import { setStoredToken, setStoredUser } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import OneClickDemoLogin from "@/components/auth/one-click-demo";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { registerSchema } from "@/validation";
import { toast } from "@/components/ui/toast";
import { Wrench, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const { refreshUser } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { name, email, password, phone };
    const validation = registerSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    register(payload, {
      onSuccess: async (res) => {
        const { user, accessToken } = res.data;
        setStoredToken(accessToken);
        setStoredUser(user);
        toast.success(`Account created! Welcome, ${user.name}`);
        await refreshUser();
        router.push("/dashboard");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to register account");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
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
            Create an Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Register as a customer to request technician services & manage bookings.
          </p>
        </div>

        {/* Card */}
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                {/* Full Name */}
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="regName">Full Name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="regName"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <FieldError error={errors.name} />
                </Field>

                {/* Email Address */}
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="regEmail">Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="regEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <FieldError error={errors.email} />
                </Field>

                {/* Phone */}
                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="regPhone">Phone Number</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="regPhone"
                      placeholder="+1-555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <FieldError error={errors.phone} />
                </Field>

                {/* Password */}
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="regPassword">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="regPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9"
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

                <Button type="submit" isLoading={isPending} className="w-full gap-2 mt-2">
                  <span>Register Customer Account</span>
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
                  Or register with Google
                </span>
              </div>
            </div>

            {/* Google OAuth Registration */}
            <GoogleLoginComponent />

            <FieldSeparator>OR QUICK DEMO</FieldSeparator>
            <OneClickDemoLogin />

            <div className="text-center text-xs text-muted-foreground pt-1">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

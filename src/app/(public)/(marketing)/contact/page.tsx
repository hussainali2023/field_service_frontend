"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Thank you! Your inquiry has been transmitted to our operations team.");
    setIsSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="outline" className="text-primary border-primary/30">
          Get in Touch
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Contact Our Operations Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Have an urgent question about an ongoing request or technician assignment? Reach out anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="text-base font-bold text-foreground">
              Direct Inquiries
            </h3>
            <div className="space-y-4 text-xs text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Emergency Hotline</p>
                  <p>+1-555-0100 (24/7 Operations Desk)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Support Email</p>
                  <p>support@fieldservice.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Headquarters</p>
                  <p>100 Enterprise Way, Suite 400, Metro Area</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            {isSent ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">Inquiry Received</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  An operations manager will review your submission and reply shortly.
                </p>
                <Button variant="outline" onClick={() => setIsSent(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="cName">Your Name</FieldLabel>
                    <Input
                      id="cName"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="cEmail">Email Address</FieldLabel>
                    <Input
                      id="cEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="cSubject">Subject</FieldLabel>
                  <Input
                    id="cSubject"
                    placeholder="e.g. Question about HVAC maintenance warranty"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cMsg">Message</FieldLabel>
                  <Textarea
                    id="cMsg"
                    placeholder="How can we assist you today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </Field>

                <Button type="submit" className="w-full gap-2">
                  <Send className="size-4" />
                  <span>Send Message</span>
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How does the dispatch and appointment scheduling process work?",
    a: "After you submit a service request, our operations dispatch team reviews the symptoms and required skill set (e.g. HVAC, Plumbing, Electrical). A certified technician in your service area is assigned, and you are notified immediately with confirmed arrival windows.",
  },
  {
    q: "How are payments handled securely on the platform?",
    a: "All payments are processed securely through Stripe Checkout. Technicians file an itemized service report with parts and final labor, generating an official invoice. You can pay with credit/debit card on our platform.",
  },
  {
    q: "Can I cancel or reschedule a service request?",
    a: "Yes. Customers can cancel a request prior to completion directly through their customer portal. You can also contact support to request a modified appointment time.",
  },
  {
    q: "What credentials do technicians possess?",
    a: "All technicians on FieldPulse hold verified trade certifications, master technician licenses where required by law, and carry minimum 5+ years of verified field service experience.",
  },
  {
    q: "How do the 1-Click Role Logins work for evaluators?",
    a: "On the login page, you will find three distinct buttons: Admin, Customer, and Provider. Clicking any button authenticates you instantly into that role's sandbox with preloaded test data.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="outline" className="text-primary border-primary/30">
          Knowledge Base
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-muted-foreground">
          Everything you need to know about FieldPulse service dispatching, technician certification, and billing.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card key={idx} className="p-6">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="size-4.5 text-primary shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6.5">
              {faq.a}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

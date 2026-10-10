"use client";

import * as React from "react";
import {
  useTechnicians,
  useCreateTechnician,
  useUpdateTechnician,
} from "@/hooks/technicians.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { Plus, Star, MapPin, Briefcase, Phone, Mail } from "lucide-react";

export default function AdminTechniciansPage() {
  const { data: techData, isLoading, refetch } = useTechnicians();
  const { mutate: createTechnician, isPending: creating } = useCreateTechnician();
  const { mutate: updateTechnician, isPending: updating } = useUpdateTechnician();

  const technicians = techData?.data || [];

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("Tech@12345");
  const [phone, setPhone] = React.useState("+1-555-0210");
  const [skills, setSkills] = React.useState("HVAC, Electrical");
  const [experienceYears, setExperienceYears] = React.useState<number>(5);
  const [hourlyRate, setHourlyRate] = React.useState<number>(60);
  const [serviceArea, setServiceArea] = React.useState("Downtown & Metro");
  const [bio, setBio] = React.useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill in technician name and email");
      return;
    }

    const payload = {
      name,
      email,
      password,
      phone,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      experienceYears: Number(experienceYears),
      hourlyRate: Number(hourlyRate),
      serviceArea,
      bio,
    };

    createTechnician(payload, {
      onSuccess: () => {
        toast.success("New technician onboarded to workforce");
        setModalOpen(false);
        refetch();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create technician");
      },
    });
  };

  const toggleAvailability = (techId: string, current: boolean) => {
    updateTechnician(
      { id: techId, payload: { isAvailable: !current } },
      {
        onSuccess: () => {
          toast.success(`Technician availability updated`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update availability");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Certified Technicians Roster
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage field specialists, skills certification, hourly rates, and live dispatch availability.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm" className="gap-2">
          <Plus className="size-4" />
          <span>Onboard Technician</span>
        </Button>
      </div>

      {/* Technicians Roster Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Specialized Skills</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Exp & Rating</TableHead>
                <TableHead>Hourly Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/60 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : technicians.length > 0 ? (
                technicians.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground">{tech.user?.name}</p>
                        <p className="text-[11px] text-muted-foreground">{tech.user?.email}</p>
                        {tech.user?.phone && (
                          <p className="text-[10px] text-muted-foreground">{tech.user.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {tech.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span>{tech.serviceArea}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {tech.experienceYears} yrs
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="size-3 fill-amber-400" />
                          {tech.rating}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-xs text-foreground">
                      {formatCurrency(tech.hourlyRate)}/hr
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tech.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            tech.isAvailable ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                        {tech.isAvailable ? "Available" : "Off Duty"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => toggleAvailability(tech.id, tech.isAvailable)}
                      >
                        {tech.isAvailable ? "Set Off Duty" : "Set Available"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No technicians found in system.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Onboard Technician Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Onboard Certified Technician</DialogTitle>
            <DialogDescription>
              Create credentials and assign trade competencies for field dispatching.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tName">Technician Name</FieldLabel>
                <Input
                  id="tName"
                  placeholder="e.g. Marcus Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="tEmail">Email Address</FieldLabel>
                  <Input
                    id="tEmail"
                    type="email"
                    placeholder="tech@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tPhone">Phone Number</FieldLabel>
                  <Input
                    id="tPhone"
                    placeholder="+1-555-0210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="tSkills">Skills (comma-separated)</FieldLabel>
                <Input
                  id="tSkills"
                  placeholder="HVAC, Electrical, Smart Thermostats, Heat Pumps"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="tExp">Experience (Years)</FieldLabel>
                  <Input
                    id="tExp"
                    type="number"
                    min="1"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tRate">Hourly Rate ($)</FieldLabel>
                  <Input
                    id="tRate"
                    type="number"
                    min="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="tArea">Service Area / Territory</FieldLabel>
                <Input
                  id="tArea"
                  placeholder="e.g. Downtown, North Metro & Suburbs"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tBio">Bio / Qualifications</FieldLabel>
                <Textarea
                  id="tBio"
                  placeholder="Master technician certification, licenses, previous contractor experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={creating}>
                Onboard Technician
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

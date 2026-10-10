"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth.provider";
import { useTechnician, useUpdateTechnician } from "@/hooks/technicians.hook";
import { useUpdateProfile } from "@/hooks/auth.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/components/ui/toast";
import { Wrench, Star, DollarSign, MapPin, CheckCircle2, Award } from "lucide-react";

export default function ProviderProfilePage() {
  const { user, refreshUser } = useAuth();
  const techProfile = user?.technicianProfile;
  const techId = techProfile?.id || "";

  const { data: techData, isLoading, refetch } = useTechnician(techId);
  const currentTech = techData?.data || techProfile;

  const { mutate: updateTechnician, isPending: saving } = useUpdateTechnician();
  const { mutate: updateProfile } = useUpdateProfile();

  const [avatar, setAvatar] = React.useState<string | null>(user?.avatar || null);
  const [certDocs, setCertDocs] = React.useState<string[]>([]);

  const [skills, setSkills] = React.useState("");
  const [hourlyRate, setHourlyRate] = React.useState<number>(65);
  const [experienceYears, setExperienceYears] = React.useState<number>(8);
  const [serviceArea, setServiceArea] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [isAvailable, setIsAvailable] = React.useState(true);

  React.useEffect(() => {
    if (currentTech) {
      setSkills(currentTech.skills?.join(", ") || "");
      setHourlyRate(currentTech.hourlyRate || 65);
      setExperienceYears(currentTech.experienceYears || 5);
      setServiceArea(currentTech.serviceArea || "");
      setBio(currentTech.bio || "");
      setIsAvailable(currentTech.isAvailable ?? true);
    }
  }, [currentTech]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techId) {
      toast.error("Technician profile not found for current user");
      return;
    }

    const payload = {
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      hourlyRate: Number(hourlyRate),
      experienceYears: Number(experienceYears),
      serviceArea,
      bio,
      isAvailable,
    };

    updateTechnician(
      { id: techId, payload },
      {
        onSuccess: () => {
          toast.success("Technician qualifications and rate updated");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update profile");
        },
      }
    );
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Technician Credentials & Availability
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configure your trade proficiencies, service territory, hourly labor rate, and shift status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/50">
                <Star className="size-3.5 fill-amber-400" />
                <span>{currentTech?.rating || 5.0} Rating</span>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Technician Profile Photo Upload */}
            <div className="pb-3 border-b border-border">
              <AvatarUpload
                currentAvatar={avatar}
                name={user?.name || "Technician"}
                onAvatarChange={(newUrl) => {
                  setAvatar(newUrl);
                  updateProfile(
                    { avatar: newUrl || undefined },
                    {
                      onSuccess: async () => {
                        await refreshUser();
                      },
                    }
                  );
                }}
              />
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tSkills">Certified Trade Skills (comma-separated)</FieldLabel>
                <Input
                  id="tSkills"
                  placeholder="e.g. HVAC, Water Heaters, Leak Detection"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="tRate">Hourly Billing Rate ($ USD)</FieldLabel>
                  <Input
                    id="tRate"
                    type="number"
                    step="0.01"
                    min="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="tExp">Years of Experience</FieldLabel>
                  <Input
                    id="tExp"
                    type="number"
                    min="1"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="tArea">Designated Service Area / Territory</FieldLabel>
                <Input
                  id="tArea"
                  placeholder="Metro North & Downtown"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tBio">Bio & Qualifications</FieldLabel>
                <Textarea
                  id="tBio"
                  placeholder="Master certifications, licenses, contractor history..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tAvail">Dispatch Availability Status</FieldLabel>
                <select
                  id="tAvail"
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="true">Active & Ready for Dispatch</option>
                  <option value="false">Off Duty / Break</option>
                </select>
              </Field>

              {/* Trade Certifications & Contractor License Upload */}
              <div className="pt-2">
                <FileUpload
                  label="Trade Licenses & Certifications"
                  helperText="PDF, JPG, PNG verification credentials (up to 10MB)"
                  accept="image/*,application/pdf"
                  multiple={true}
                  onChange={(urls) => setCertDocs(urls)}
                />
              </div>
            </FieldGroup>

            <Button type="submit" isLoading={saving} className="w-full gap-2 mt-4">
              <CheckCircle2 className="size-4" />
              <span>Save Technician Profile</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

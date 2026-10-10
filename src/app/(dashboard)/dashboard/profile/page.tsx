"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth.provider";
import { useUpdateProfile, useChangePassword } from "@/hooks/auth.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { User, Lock, Phone, Mail, Shield, Camera } from "lucide-react";

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();
  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();
  const { mutate: changePassword, isPending: changingPass } = useChangePassword();

  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [avatar, setAvatar] = React.useState<string | null>(user?.avatar || null);

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatar(newUrl);
    updateProfile(
      { avatar: newUrl || undefined },
      {
        onSuccess: async () => {
          await refreshUser();
        },
      }
    );
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      { name, phone, avatar: avatar || undefined },
      {
        onSuccess: async () => {
          toast.success("Profile updated successfully");
          await refreshUser();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update profile");
        },
      }
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please enter both current and new password");
      return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setOldPassword("");
          setNewPassword("");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to change password");
        },
      }
    );
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Account & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your personal contact details, notification phone, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span>Personal Details</span>
            </CardTitle>
            <CardDescription>
              Keep your contact details up-to-date for technician dispatch notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Profile Avatar Upload */}
              <div className="pb-2 border-b border-border">
                <AvatarUpload
                  currentAvatar={avatar}
                  name={name || user?.name || "Customer"}
                  onAvatarChange={handleAvatarChange}
                />
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="pName">Full Name</FieldLabel>
                  <Input
                    id="pName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="pEmail">Email Address (Read-only)</FieldLabel>
                  <Input
                    id="pEmail"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/40 cursor-not-allowed"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="pPhone">Contact Phone Number</FieldLabel>
                  <Input
                    id="pPhone"
                    placeholder="+1-555-0100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>

                <Button type="submit" isLoading={updatingProfile} className="w-full">
                  Save Changes
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>
              Ensure your account is protected with a strong, distinct password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="oldPass">Current Password</FieldLabel>
                  <Input
                    id="oldPass"
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="newPass">New Password</FieldLabel>
                  <Input
                    id="newPass"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Field>

                <Button type="submit" variant="outline" isLoading={changingPass} className="w-full">
                  Update Password
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

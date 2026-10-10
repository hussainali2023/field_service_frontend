"use client";

import * as React from "react";
import { uploadFile } from "@/lib/upload";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  name?: string;
  onAvatarChange: (url: string | null) => void;
  className?: string;
}

export function AvatarUpload({
  currentAvatar,
  name = "User",
  onAvatarChange,
  className = "",
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setAvatarUrl(currentAvatar || null);
  }, [currentAvatar]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadFile(file, (percent) => {
        setProgress(percent);
      });
      setAvatarUrl(result.url);
      onAvatarChange(result.url);
      toast.success("Profile photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarUrl(null);
    onAvatarChange(null);
    toast.info("Profile photo removed");
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className="group relative size-20 rounded-full border-2 border-border overflow-hidden bg-muted cursor-pointer hover:border-primary transition-all flex items-center justify-center shrink-0 shadow-sm"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="sr-only"
        />

        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="size-full object-cover group-hover:opacity-75 transition-opacity"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <User className="size-8" />
          </div>
        )}

        {/* Hover overlay with Camera icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
          <Camera className="size-5" />
        </div>

        {/* Uploading progress spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-[10px] font-bold mt-1">{progress}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs h-8 gap-1.5"
          >
            <Camera className="size-3.5" />
            <span>Change Photo</span>
          </Button>

          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
              className="text-xs h-8 text-destructive hover:text-destructive gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Remove</span>
            </Button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Square PNG, JPG, or WEBP up to 5MB.
        </p>
      </div>
    </div>
  );
}

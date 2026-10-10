"use client";

import * as React from "react";
import { formatFileSize, uploadFile, UploadResult } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCw,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export interface UploadedItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  file?: File;
}

interface FileUploadProps {
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  initialUrls?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
}

export function FileUpload({
  label = "Upload Files",
  helperText = "PNG, JPG, WEBP, or PDF up to 10MB",
  accept = "image/*,application/pdf",
  multiple = false,
  maxSizeMB = 10,
  initialUrls = [],
  onChange,
  className = "",
}: FileUploadProps) {
  const [items, setItems] = React.useState<UploadedItem[]>(() =>
    initialUrls.map((url, i) => ({
      id: `initial-${i}`,
      name: `Attachment ${i + 1}`,
      size: 0,
      type: url.startsWith("data:image") || url.includes("image") ? "image/jpeg" : "application/octet-stream",
      url,
      progress: 100,
      status: "completed" as const,
    }))
  );

  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const prevUrlsRef = React.useRef<string>("");

  // Sync URLs to parent only when completed URLs actually change
  React.useEffect(() => {
    const completedUrls = items
      .filter((it) => it.status === "completed" && it.url)
      .map((it) => it.url as string);
    const serialized = JSON.stringify(completedUrls);
    if (serialized !== prevUrlsRef.current) {
      prevUrlsRef.current = serialized;
      onChangeRef.current?.(completedUrls);
    }
  }, [items]);

  const processFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`"${file.name}" exceeds the maximum ${maxSizeMB}MB size limit.`);
      return;
    }

    const newItemId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: UploadedItem = {
      id: newItemId,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
      file,
    };

    setItems((prev) => (multiple ? [...prev, newItem] : [newItem]));

    try {
      const result = await uploadFile(file, (percent) => {
        setItems((prev) =>
          prev.map((it) => (it.id === newItemId ? { ...it, progress: percent } : it))
        );
      });

      setItems((prev) =>
        prev.map((it) =>
          it.id === newItemId
            ? {
                ...it,
                url: result.url,
                progress: 100,
                status: "completed",
              }
            : it
        )
      );
      toast.success(`"${file.name}" uploaded successfully`);
    } catch (err: any) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === newItemId
            ? {
                ...it,
                status: "error",
                error: err.message || "Upload failed",
              }
            : it
        )
      );
      toast.error(`Failed to upload "${file.name}"`);
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    if (!multiple && files.length > 1) {
      processFile(files[0]);
    } else {
      files.forEach((file) => processFile(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const retryItem = (item: UploadedItem) => {
    if (item.file) {
      processFile(item.file);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
          <span>{label}</span>
          <span className="font-normal text-muted-foreground">{helperText}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border hover:border-primary/60 hover:bg-muted/40 bg-card/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />

        <div className="flex flex-col items-center text-center space-y-2 pointer-events-none">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Click to upload or drag & drop files
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Supports images, documents, and service diagnostics
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Items List */}
      {items.length > 0 && (
        <div className="space-y-2 pt-1">
          {items.map((item) => {
            const isImage = item.type.startsWith("image/") || (item.url && item.url.startsWith("data:image"));

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card/60 shadow-xs"
              >
                {/* Thumbnail / Icon */}
                <div className="size-10 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
                  {isImage && item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  ) : isImage ? (
                    <ImageIcon className="size-5 text-primary" />
                  ) : (
                    <FileText className="size-5 text-primary" />
                  )}
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate text-foreground">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {item.size > 0 ? formatFileSize(item.size) : ""}
                    </span>
                  </div>

                  {item.status === "uploading" && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{item.progress}%</span>
                      </div>
                    </div>
                  )}

                  {item.status === "completed" && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="size-3.5" />
                      <span>Upload complete</span>
                    </div>
                  )}

                  {item.status === "error" && (
                    <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium">
                      <AlertCircle className="size-3.5" />
                      <span>{item.error || "Upload failed"}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {item.status === "error" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => retryItem(item)}
                      title="Retry upload"
                    >
                      <RotateCw className="size-3.5" />
                    </Button>
                  )}
                  {item.status === "uploading" ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Remove file"
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

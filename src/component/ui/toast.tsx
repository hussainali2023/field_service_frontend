"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title?: string;
  description: string;
  type?: ToastType;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(toast: Omit<ToastItem, "id">) {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast: ToastItem = { ...toast, id };
    this.toasts = [newToast, ...this.toasts];
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, 4500);

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(description: string, title = "Success") {
    return this.add({ title, description, type: "success" });
  }

  error(description: string, title = "Error") {
    return this.add({ title, description, type: "error" });
  }

  info(description: string, title = "Info") {
    return this.add({ title, description, type: "info" });
  }

  warning(description: string, title = "Warning") {
    return this.add({ title, description, type: "warning" });
  }
}

export const toast = new ToastManager();

export function ToastViewport() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 pointer-events-none"
    >
      {toasts.map((item) => {
        let Icon = Info;
        let colorClasses = "border-blue-200 bg-card text-card-foreground shadow-lg";

        if (item.type === "success") {
          Icon = CheckCircle2;
          colorClasses = "border-emerald-200 bg-card text-card-foreground shadow-lg shadow-emerald-500/10";
        } else if (item.type === "error") {
          Icon = XCircle;
          colorClasses = "border-rose-200 bg-card text-card-foreground shadow-lg shadow-rose-500/10";
        } else if (item.type === "warning") {
          Icon = AlertCircle;
          colorClasses = "border-amber-200 bg-card text-card-foreground shadow-lg shadow-amber-500/10";
        }

        return (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 animate-in slide-in-from-bottom-5",
              colorClasses
            )}
          >
            <Icon
              className={cn("size-5 shrink-0 mt-0.5", {
                "text-emerald-600": item.type === "success",
                "text-rose-600": item.type === "error",
                "text-amber-600": item.type === "warning",
                "text-blue-600": item.type === "info" || !item.type,
              })}
            />
            <div className="flex-1 space-y-0.5">
              {item.title && (
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <button
              type="button"
              onClick={() => toast.remove(item.id)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

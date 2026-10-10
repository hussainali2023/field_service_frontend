import { UrgencyLevel } from "@/types";
import { getUrgencyBadgeConfig } from "@/lib/utils";

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel | string }) {
  const config = getUrgencyBadgeConfig(urgency);

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

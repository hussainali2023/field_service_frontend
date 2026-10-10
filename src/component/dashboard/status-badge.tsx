import { RequestStatus } from "@/types";
import { getStatusBadgeConfig } from "@/lib/utils";

export function StatusBadge({ status }: { status: RequestStatus | string }) {
  const config = getStatusBadgeConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}

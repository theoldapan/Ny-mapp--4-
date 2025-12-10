import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType =
  | "Active"
  | "Inactive"
  | "Suspended"
  | "Expired"
  | "Available"
  | "InUse"
  | "Maintenance"
  | "OutOfOrder"
  | "Published"
  | "Draft"
  | "Archived"
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Cancelled";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-muted",
  Suspended: "bg-warning/10 text-warning border-warning/20",
  Expired: "bg-destructive/10 text-destructive border-destructive/20",
  Available: "bg-success/10 text-success border-success/20",
  InUse: "bg-info/10 text-info border-info/20",
  Maintenance: "bg-warning/10 text-warning border-warning/20",
  OutOfOrder: "bg-destructive/10 text-destructive border-destructive/20",
  Published: "bg-success/10 text-success border-success/20",
  Draft: "bg-muted text-muted-foreground border-muted",
  Archived: "bg-muted text-muted-foreground border-muted",
  Paid: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
  Cancelled: "bg-muted text-muted-foreground border-muted",
};

const statusLabels: Record<StatusType, string> = {
  Active: "Active",
  Inactive: "Inactive",
  Suspended: "Suspended",
  Expired: "Expired",
  Available: "Available",
  InUse: "In Use",
  Maintenance: "Maintenance",
  OutOfOrder: "Out of Order",
  Published: "Publiserad",
  Draft: "Utkast",
  Archived: "Arkiverad",
  Paid: "Paid",
  Pending: "Pending",
  Overdue: "Overdue",
  Cancelled: "Cancelled",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}

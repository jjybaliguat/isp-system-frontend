import { cn } from "@/lib/utils"
import { BillingStatus } from "@/types/billing"
import { Badge } from "../ui/badge"

export const getStatusBadge = (status: string) => {
      const colorClasses: Record<string, string> = {
        [BillingStatus.PAID]: "bg-green-500/15 text-green-600 border border-green-500/30",
        [BillingStatus.PENDING]: "bg-yellow-500/15 text-yellow-600 border border-yellow-500/30",
        [BillingStatus.PARTIALLY_PAID]: "bg-orange-500/15 text-orange-600 border border-orange-500/30",
        [BillingStatus.OVERDUE]: "bg-red-500/15 text-red-600 border border-red-500/30",
        [BillingStatus.CANCELLED]: "bg-gray-500/15 text-gray-600 border border-gray-500/30",
      }

      return (
        <Badge
          className={cn(
            "rounded-full font-medium px-3 py-0.5 capitalize",
            colorClasses[status] || "bg-gray-500/15 text-gray-600 border border-gray-500/30"
          )}
        >
          {status?.replace(/_/g, " ")}
        </Badge>
    )
  }
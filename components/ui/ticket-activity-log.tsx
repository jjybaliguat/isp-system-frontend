"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useGetTicketActivityLogsQuery, useGetTicketCommentsQuery } from "@/redux/fetures/tickets-api-slice"
import { formatDate } from "@/utils/formatDate"
import { formatDateTime, formatLocalDateTime } from "@/utils/formatDateTime"

interface TicketActivityLogProps {
  ticketId: string
}

export function TicketActivityLog({ ticketId }: TicketActivityLogProps) {
  const { data: comments } = useGetTicketCommentsQuery(ticketId)

  const {data: activityLogs} = useGetTicketActivityLogsQuery(ticketId)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Activity Log</h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activityLogs && activityLogs.length > 0 ? (
          activityLogs.map((log) => (
            <div key={log.id} className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">{log.user?.fullName?.charAt(0) || log.user?.employee?.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.user?.fullName || log.user?.employee?.fullName}</p>
                <p className="text-sm text-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatLocalDateTime(log.createdAt)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No activity yet</p>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, AlertCircle } from "lucide-react"
import { TicketDataSchema, TicketPriority } from "@/types/ticket"
import { formatDate } from "@/utils/formatDate"
import { TicketDetailsDrawer } from "./ticket-details-drawer"

interface TicketCardProps {
  ticket: TicketDataSchema
  onDragStart: () => void
  onDragEnd: () => void
}

const PRIORITY_CONFIG: Record<TicketPriority, { color: string; bgColor: string }> = {
  [TicketPriority.LOW]: { color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" },
  [TicketPriority.MEDIUM]: { color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" },
  [TicketPriority.HIGH]: { color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900" },
  [TicketPriority.URGENT]: { color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" },
}

export function TicketCard({ ticket, onDragStart, onDragEnd }: TicketCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const priorityConfig = PRIORITY_CONFIG[ticket.priority]
  const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date()

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={() => setIsDetailsOpen(true)}
        className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      >
        {/* Subject */}
        <h4 className="font-semibold text-sm mb-2 truncate max-w-50 line-clamp-2 hover:text-primary">{ticket.subject}</h4>
        <h4 className="font-medium text-sm mb-2 hover:text-primary text-muted-foreground">Ticket #: {ticket.ticketNumber}</h4>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`${priorityConfig.bgColor} ${priorityConfig.color} border-0`}>
            {ticket.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {ticket.category}
          </Badge>
        </div>

        {/* Client Name */}
        {ticket.client && <p className="text-xs text-muted-foreground mb-2">{ticket.client.fullName}</p>}

        {/* Due Date */}
        {ticket.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            {isOverdue ? (
              <>
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-500">Overdue</span>
              </>
            ) : (
              <>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(new Date(ticket.dueDate))}</span>
              </>
            )}
          </div>
        )}

        {/* Assigned User Avatar */}
        {ticket.assignedToTeam && (
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">{ticket.assignedToTeam.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{ticket.assignedToTeam?.name}</span>
          </div>
        )}
        {ticket.assignedToEmployee && (
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">{ticket.assignedToEmployee.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{ticket.assignedToEmployee?.fullName}</span>
          </div>
        )}
      </Card>

      {/* Details Drawer */}
      <TicketDetailsDrawer ticket={ticket} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}

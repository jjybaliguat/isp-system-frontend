"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, AlertCircle, Trash2 } from "lucide-react"
import DeleteConfirmAction from "@/components/dialogs/confirmation-dialog"
import { useDeleteTicketMutation } from "@/redux/fetures/tickets-api-slice"
import { toast } from "sonner"
import { TicketDataSchema, TicketPriority } from "@/types/ticket"
import { formatDate } from "@/utils/formatDate"
import { TicketDetailsDrawer } from "./ticket-details-drawer"
import { Button } from "./button"

interface TicketCardProps {
  ticket: TicketDataSchema
  onDragStart: () => void
  onDragEnd: () => void
  showDetails?: boolean
}

const PRIORITY_CONFIG: Record<TicketPriority, { color: string; bgColor: string }> = {
  [TicketPriority.LOW]: { color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" },
  [TicketPriority.MEDIUM]: { color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" },
  [TicketPriority.HIGH]: { color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900" },
  [TicketPriority.URGENT]: { color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" },
}

export function TicketCard({ ticket, onDragStart, onDragEnd, showDetails = true }: TicketCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const priorityConfig = PRIORITY_CONFIG[ticket.priority]
  const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date()
  const [deleteTicket, { isLoading: deleting }] = useDeleteTicketMutation()

  const handleDelete = async () => {
    try {
      await deleteTicket(ticket.id).unwrap()
      toast.success("Ticket deleted")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete ticket")
    }
  }

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "ONGOING":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "RESOLVED":
        return "bg-green-100 text-green-700 border-green-200"
      case "CLOSED":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "OVERDUE":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <>
      <div className="relative">
      <Card
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={() => showDetails && setIsDetailsOpen(true)}
        className="p-2 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow rounded-md"
      >
        {/* Subject */}
        <h4 className="font-semibold text-sm mb-1 truncate max-w-50 line-clamp-2 hover:text-primary">({ticket.category}) {ticket.subject}</h4>
        <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-2">
          <h4 className="font-medium text-xs hover:text-primary text-muted-foreground">#{ticket.ticketNumber}</h4>
          {/* compact badges row */}
          <div className="flex items-center gap-1">
            <Badge variant="outline" className={`${priorityConfig.bgColor} ${priorityConfig.color} text-xs px-2 py-0.5 border-0`}>
              {ticket.priority}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {ticket.category}
            </Badge>
            <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getStatusClasses(ticket.status)}`}>
              {ticket.status}
            </Badge>
          </div>
        </div>

        {/* Client Name */}
        {ticket.client && <p className="text-xs text-muted-foreground mb-1">{ticket.client.fullName}</p>}

        {/* Description (truncated preview) */}
        {ticket.description && (
          <p className="text-xs text-muted-foreground truncate max-w-[230px]">{ticket.description}</p>
        )}

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
        <div className="grid space-y-2">
          <p className="text-xs text-muted-foreground">Created By: {ticket.createdBy?.fullName}</p>
          {ticket.assignedToTeam && (
            <p className="text-xs text-muted-foreground">Assigned To: {ticket.assignedToTeam?.name}</p>
          )}
          {ticket.assignedToEmployee && (
              <p className="text-xs text-muted-foreground">Assigned To: {ticket.assignedToEmployee?.fullName}</p>
          )}
        </div>
      </Card>
      {/* delete button positioned absolute top-right */}
      <div className="absolute top-1 right-1">
        <DeleteConfirmAction
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket?"
          triggerButton={
            <Button size="icon" variant="ghost" className="h-7 w-7 p-0">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          }
          onConfirm={handleDelete}
        />
      </div>

  {/* Details Drawer (only rendered when showDetails=true) */}
  {showDetails && <TicketDetailsDrawer ticket={ticket} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />}
      </div>
    </>
  )
}

"use client"

import { useUpdateTicketMutation } from "@/redux/fetures/tickets-api-slice"
import { TicketDataSchema, TicketStatus } from "@/types/ticket"
import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { TicketCard } from "./ticket-card"

interface KanbanColumnProps {
  status: TicketStatus
  tickets: TicketDataSchema[]
  draggedTicket: TicketDataSchema | null
  onDragStart: (ticket: TicketDataSchema) => void
  onDragEnd: () => void
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  [TicketStatus.PENDING]: { label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950" },
  [TicketStatus.ONGOING]: { label: "Ongoing", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" },
  [TicketStatus.RESOLVED]: { label: "Resolved", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950" },
  [TicketStatus.CLOSED]: { label: "Closed", color: "text-gray-600", bgColor: "bg-gray-50 dark:bg-gray-950" },
  [TicketStatus.OVERDUE]: { label: "Overdue", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950" },
}

export function KanbanColumn({ status, tickets, draggedTicket, onDragStart, onDragEnd }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false)
  const [updateTicket] = useUpdateTicketMutation()

  const config = STATUS_CONFIG[status]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)

    if (!draggedTicket || draggedTicket.status === status) return

    try {
      // Optimistic update
      await updateTicket({
        id: draggedTicket.id,
        data: { status },
      }).unwrap()

      toast("Success", {
        description: `Ticket moved to ${config.label}`,
      })
    } catch (error) {
      toast("Error", {
        description: "Failed to update ticket status",
      })
    }

    onDragEnd()
  }

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-lg border-2 transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Tickets */}
      <div className="flex flex-col gap-3 min-h-96 max-h-[600px] overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">No tickets</div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onDragStart={() => onDragStart(ticket)} onDragEnd={onDragEnd} />
          ))
        )}
      </div>
    </div>
  )
}

"use client"

import { TicketDataSchema, TicketStatus } from "@/types/ticket"
import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
const STATUSES: TicketStatus[] = [
  TicketStatus.PENDING,
  TicketStatus.ONGOING,
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
  TicketStatus.OVERDUE,
]

interface KanbanBoardProps {
  tickets: TicketDataSchema[]
}

export function KanbanBoard({ tickets }: KanbanBoardProps) {
  const [draggedTicket, setDraggedTicket] = useState<TicketDataSchema | null>(null)

  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status)
  }

  const handleDragStart = (ticket: TicketDataSchema) => {
    setDraggedTicket(ticket)
  }

  const handleDragEnd = () => {
    setDraggedTicket(null)
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-max">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={getTicketsByStatus(status)}
            draggedTicket={draggedTicket}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

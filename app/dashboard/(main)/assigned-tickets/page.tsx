"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useAppSelector } from "@/redux/store/store"
import LoadingComponent from "@/components/Loading"
import { KanbanBoard } from "@/components/ui/kanban-board"
import { useGetAssignedTicketsQuery } from "@/redux/fetures/tickets-api-slice"

export default function EmployeeTicketsPage() {
  const user = useAppSelector((store) => store.auth)
  const userId = user?.id || ""

  const { data: tickets = [], isLoading, error } = useGetAssignedTicketsQuery({ userId }, { skip: !userId })

  const groupedTickets = useMemo(() => {
    return tickets
  }, [tickets])

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">User not authenticated</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <LoadingComponent />
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">Error loading tickets</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage your assigned tickets ({tickets.length} total)</p>
        </div>

        {/* Kanban Board */}
        {tickets.length > 0 ? (
          <KanbanBoard tickets={groupedTickets} />
        ) : (
          <div className="flex items-center justify-center min-h-96 border border-dashed border-border rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground">No tickets assigned to you yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

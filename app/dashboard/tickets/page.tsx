"use client"
import { CreateTicketDialog } from '@/components/dialogs/create-ticket-dialog'
import LoadingComponent from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { KanbanBoard } from '@/components/ui/kanban-board'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { useGetTicketsQuery } from '@/redux/fetures/tickets-api-slice'
import { Plus, PlusIcon } from 'lucide-react'
import React, { useState } from 'react'

export default function TicketsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data, isLoading, error } = useGetTicketsQuery({
    page: 1,
    limit: 100,
  })

  if (isLoading) {
    return (
      <LoadingComponent />
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading tickets</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper
      pageName="Tickets"
      description="Create, assign, and resolve tickets effortlessly to boost team productivity."
    >
      <div className='mb-4'>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>
      <KanbanBoard tickets={data?.data || []} />
      <CreateTicketDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </PageWrapper>
  )
}

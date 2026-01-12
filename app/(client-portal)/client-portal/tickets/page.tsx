"use client"

import React, { useState } from "react"
import { useGetUserTicketsQuery } from "@/redux/fetures/clientApiSlice"
import { TicketDataSchema } from "@/types/ticket"
import { Skeleton } from "@/components/ui/skeleton"
import { TicketCard } from "@/components/ui/ticket-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTicketDialogClient } from "@/components/dialogs/create-ticket-dialog-client"

export default function TicketsPage() {
  const { data, isLoading, isFetching } = useGetUserTicketsQuery()
  const loading = isLoading || isFetching
  const tickets: TicketDataSchema[] = data || []
  const [openCreate, setOpenCreate] = useState(false)

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">My Tickets</h1>
            <p className="text-sm text-muted-foreground">Support tickets and updates</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpenCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> New
          </Button>
        </header>

        <main className="space-y-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : tickets.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg font-medium">No tickets yet</p>
              <p className="text-sm">Create a ticket to get support</p>
              <div className="mt-4">
                <Button onClick={() => setOpenCreate(true)}>Create Ticket</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <TicketCard key={t.id} ticket={t} onDragStart={() => {}} onDragEnd={() => {}} showDetails={false} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateTicketDialogClient open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  )
}
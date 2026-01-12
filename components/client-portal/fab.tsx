"use client"

import React, { useState } from 'react'
import { CreateTicketDialogClient } from '../dialogs/create-ticket-dialog-client';
import { MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ClientPortalFab = () => {
    const [fabOpen, setFabOpen] = useState(false)
    const [openCreateTicket, setOpenCreateTicket] = useState(false)

  return (
    <>
        {/* Floating action button (FAB) */}
        <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end">
          {/* Expanded actions */}
          <div className="flex flex-col items-end space-y-3 mb-2">
            {fabOpen && (
              <>
                <button
                  type="button"
                  onClick={() => { setFabOpen(false); setOpenCreateTicket(true); }}
                  className="flex items-center gap-3 dark:bg-black bg-white text-sm px-3 py-2 rounded-full shadow-md hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setFabOpen(false); toast('Open messages'); }}
                  className="flex items-center gap-3 dark:bg-black bg-white text-sm px-3 py-2 rounded-full shadow-md hover:shadow-lg"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message</span>
                </button>
              </>
            )}
          </div>

          {/* Main FAB button */}
          <button
            aria-label="Quick actions"
            onClick={() => setFabOpen((v) => !v)}
            className="flex items-center justify-center bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-transform"
          >
            <Plus className={`h-5 w-5 transform ${fabOpen ? 'rotate-45' : ''}`} />
          </button>
        </div>

        <CreateTicketDialogClient
          open={openCreateTicket}
          onOpenChange={setOpenCreateTicket}
        />
    </>
  )
}

export default ClientPortalFab
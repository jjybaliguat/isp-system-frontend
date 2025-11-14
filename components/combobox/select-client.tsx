"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGetClientsQuery } from "@/redux/fetures/clientApiSlice"
import { ClientDataSchema } from "@/types/clients"

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function SelectClient({ onSelect }: { onSelect: (clientId: string) => void }) {
  const [comboboxOpen, setComboboxOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [selectedClient, setSelectedClient] = React.useState<ClientDataSchema | null>(null)
  
  const debouncedSearch = useDebounce(search, 500)
  const { data, isLoading } = useGetClientsQuery({ search: debouncedSearch, limit: 100 })
  const clients = data?.data || []

  return (
    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={comboboxOpen}
            className="w-full justify-between bg-transparent"
          >
            {selectedClient ? selectedClient.fullName : "Search client..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <input
            type="text"
            aria-label="Search by name, accountNo., email, phone"
            placeholder="Search by name, accountNo., email, phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="max-h-64 overflow-auto rounded-md border">
            {isLoading && (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading clients...
              </div>
            )}
            {!isLoading && (!clients || clients.length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                No client found.
              </div>
            )}
            {!isLoading && (!clients || clients.filter((client)=>client.odpPort == null).length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                All Clients are assigned to specific port.
              </div>
            )}
            {!isLoading && clients?.length > 0 && (
              <ul className="p-2">
                {clients.filter((client)=>client.odpPort == null).map(client => (
                  <li key={client.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left hover:bg-primary/10 flex items-center gap-3 rounded-md py-1 px-2"
                      )}
                      onClick={() => {
                        setSelectedClient(client)
                        onSelect(client.id)
                        setComboboxOpen(false)
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{client.fullName}</span>
                        <span className="text-xs text-muted-foreground">{client.phoneNumber}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
  )
}

"use client"

import * as React from "react"
import { ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ODP } from "@/types/networks"
import { useGetOdpsQuery } from "@/redux/fetures/network-hierarchy-api-slice"

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function SelectOdp({ onSelect, selected }: { onSelect: (odpId: ODP) => void, selected?: ODP | null }) {
  const [comboboxOpen, setComboboxOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [selectedOdp, setSelectedOdp] = React.useState<ODP | null>(null)
  
  const debouncedSearch = useDebounce(search, 500)
  const { data, isLoading } = useGetOdpsQuery({ search: debouncedSearch})
  const odps = data || []

  React.useEffect(()=>{
    if(selected){
      setSelectedOdp(selected)
    }
  }, [selected])

  return (
    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={comboboxOpen}
            className="w-full justify-between bg-transparent"
          >
            {selectedOdp ? selectedOdp.odpCode : "Search Odp/Nap..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <input
            type="text"
            aria-label="Search by odp/nap code"
            placeholder="Search by odp/nap code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="max-h-64 overflow-auto rounded-md border">
            {isLoading && (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading Odps...
              </div>
            )}
            {!isLoading && (!odps || odps.length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                No Odp found.
              </div>
            )}
            {!isLoading && odps?.length > 0 && (
              <ul className="p-2">
                {odps.map(odp => (
                  <li key={odp.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left hover:bg-primary/10 flex items-center gap-3 rounded-md py-1 px-2"
                      )}
                      onClick={() => {
                        setSelectedOdp(odp)
                        onSelect(odp)
                        setComboboxOpen(false)
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{odp.odpCode}</span>
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

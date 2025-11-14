"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { UsersTable } from "../tables/users-table"
import CreateUserDialog from "../dialogs/create-user-dialog"

export function UserstableWrapper() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debounceQuery, setDebouncedQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500) // delay in ms

    return () => clearTimeout(handler)
  }, [searchQuery])

  return (
    <>
      {/* Search and Add Button */}
      <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <UsersTable searchQuery={debounceQuery} />

      <CreateUserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

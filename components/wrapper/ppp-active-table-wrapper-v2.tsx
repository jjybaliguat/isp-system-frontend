"use client"
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import PPPActiveTable from '../tables/ppp-active-table'
import { useAppSelector } from '@/redux/store/store'
import PPPActiveTableV2 from '../tables/ppp-active-table-v2'

const PppActiveTableWrapperV2 = ({mikrotikId}: {mikrotikId: string}) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [debounceQuery, setDebouncedQuery] = useState("")
    const user = useAppSelector(store=>store.auth)

    if(user.providerType !== "MAIN") return null

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedQuery(searchQuery)
      }, 500) // delay in ms

      return () => clearTimeout(handler)
    }, [searchQuery])

  return (
    <>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ppp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <PPPActiveTableV2 mikrotikId={mikrotikId} searchQuery={debounceQuery}  />
    </>
  )
}

export default PppActiveTableWrapperV2
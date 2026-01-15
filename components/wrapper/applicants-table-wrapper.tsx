"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Settings2 } from "lucide-react"
import { useGetClientsQuery } from "@/redux/fetures/clientApiSlice"
import { ClientsTable } from "../tables/clients-data-table"
import { AddClientDialog } from "../dialogs/add-client-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useGetCoverageQuery } from "@/redux/fetures/converage-api-slice"
import { ApplicantsTable } from "../tables/applicants-table"
import { useUpdateApplicantMutation } from "@/redux/fetures/applicants-api-slice"
import { ApplicantDataSchema } from "@/types/applicant"

const STATUS_OPTIONS = ["ALL", "PENDING", "PROCESSING", "ONGOING", "INSTALLED", "REJECTED", "CANCELLED"]

export function ApplicantsTableWrapper() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debounceQuery, setDebouncedQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDataSchema | null>(null)
  const [initialClientValues, setInitialClientValues] = useState<any | undefined>(undefined)
  const [updateApplicant] = useUpdateApplicantMutation()

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500) // delay in ms

    return () => clearTimeout(handler)
  }, [searchQuery])

  const handleRequestInstall = (applicant: ApplicantDataSchema) => {
    // map applicant fields to add-client form defaults
    setSelectedApplicant(applicant)
    setInitialClientValues({
      fullName: applicant.name,
      email: applicant.email,
      phoneNumber: applicant.phone,
      address: applicant.address,
      servicePlanId: applicant.servicePlanId ?? applicant.servicePlan?.id,
      coverageId: applicant.coverageId ?? applicant.coverage?.id,
      notes: applicant.notes ?? undefined,
      installationDate: undefined,
    })
    setIsDialogOpen(true)
  }

  return (
    <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
    </div>
      <ApplicantsTable searchQuery={debounceQuery} onRequestInstall={handleRequestInstall} />

      <AddClientDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedApplicant(null)
            setInitialClientValues(undefined)
          }
        }}
        initialValues={initialClientValues}
        onSuccess={async (createdClient) => {
          // after creating client, update applicant status to INSTALLED
          try {
            if (selectedApplicant) {
              await updateApplicant({ id: selectedApplicant.id, body: { applicationStatus: 'INSTALLED' } }).unwrap()
              // success toast will come from mutation listeners; but show one here
              // toast?
            }
          } catch (err) {
            console.error(err)
          }
        }}
      />
    </>
  )
}

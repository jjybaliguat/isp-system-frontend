"use client"

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { UserRole, UsersDataSchema } from '@/types/users'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { toast } from 'sonner'

import { useGetEmployeesQuery } from '@/redux/fetures/employees-api-slice'
import { useCreateUserMutation } from '@/redux/fetures/users-api-slice'
import { useGetClientsQuery } from '@/redux/fetures/clientApiSlice'
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClientDataSchema } from '@/types/clients'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  selectedUser?: UsersDataSchema
}

type SourceType = 'employee' | 'client'

const CreateUserDialog = ({
  open,
  onOpenChange,
  isEditing
}: DialogProps) => {
  const { data: employees } = useGetEmployeesQuery({ page: 1, limit: 100 })
  
  const [createUser, { isLoading: creating }] = useCreateUserMutation()
  
  const [sourceType, setSourceType] = useState<SourceType>('employee')
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<ClientDataSchema | null>(null)
  
  const { data: clients, isLoading: isFetchingClients } = useGetClientsQuery({ search: debouncedSearch, page: 1, limit: 100 })

  const clientsData = clients?.data || []

  const [formData, setFormData] = useState({
    employeeId: '',
    clientId: '',
    role: '',
    password: 'admin123456'
  })

  const handleSourceChange = (value: SourceType) => {
    setSourceType(value)
    setFormData((prev) => ({
      ...prev,
      employeeId: '',
      clientId: ''
    }))
  }

  useEffect(() => {
      const handler = setTimeout(() => setDebouncedSearch(searchValue), 500)
      return () => clearTimeout(handler)
    }, [searchValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload =
      sourceType === 'employee'
        ? {
            employeeId: formData.employeeId,
            role: formData.role,
            password: formData.password
          }
        : {
            clientId: formData.clientId,
            role: formData.role,
            password: formData.password
          }

    try {
      await createUser(payload).unwrap()
      toast.success("User created")
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user")
    }
  }

  useEffect(() => {
    if (sourceType === 'client') {
      setFormData((prev) => ({
        ...prev,
        role: UserRole.CLIENT
      }))
    }else {
        setFormData((prev) => ({
          ...prev,
          role: ''
        }))
    }
  }, [sourceType])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-[500px] p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* SOURCE RADIO GROUP */}
          <div className="space-y-2">
            <Label>
              User Source <span className="text-destructive">*</span>
            </Label>

            <RadioGroup
              value={sourceType}
              onValueChange={handleSourceChange}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employee" id="employee" />
                <Label htmlFor="employee">Employee</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client">Client</Label>
              </div>
            </RadioGroup>
          </div>

          {/* EMPLOYEE SELECT */}
          {sourceType === 'employee' && (
            <div className="space-y-2">
              <Label>
                Employee <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.data?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* CLIENT SELECT */}
          {sourceType === 'client' && (
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between bg-transparent"
                    >
                    {selectedClient
                        ? `${selectedClient?.fullName}`
                        : "Select client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                
                    <PopoverContent className="w-full p-0">
                    <input
                        type="text"
                        aria-label="Search clients"
                        placeholder="Search by name, accountNo., email, phone"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <div className="max-h-64 overflow-auto rounded-md border">
                        {isFetchingClients && (
                        <div className="flex items-center justify-center p-4 text-muted-foreground">
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Loading clients...
                        </div>
                        )}
                        {!isFetchingClients && (!clientsData || clientsData.length === 0) && (
                        <div className="p-4 text-center text-muted-foreground">No client found.</div>
                        )}
                        {!isFetchingClients && clientsData?.length > 0 && (
                        <ul className="p-2">
                            {clientsData.map((client) => (
                            <li key={client.id}>
                                <button
                                type="button"
                                className={cn(
                                    "w-full text-left hover:bg-primary/10 flex items-center gap-3 rounded-md py-1 px-2",
                                    formData.clientId === client.id ? "bg-primary/20" : ""
                                )}
                                onClick={() => {setFormData({ ...formData, clientId: client.id }); setSelectedClient(client); setComboboxOpen(false)}}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.clientId === client.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">{client.fullName}</span>
                                    <span className="text-xs text-muted-foreground">Email: {client.email}</span>
                                </div>
                                </button>
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>
                    </PopoverContent>
                </Popover>
            </div>
          )}

          {/* ROLE */}
          <div className="space-y-2">
            <Label>
              Access Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
              required
              disabled={sourceType === 'client'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserDialog

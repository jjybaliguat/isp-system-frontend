"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, CreditCard, User, Edit2, Save, X } from "lucide-react"
import { toast } from "sonner"
import { EmployeesDataSchema, EmployeeStatus } from "@/types/employees"
import { useUpdateEmployeeMutation } from "@/redux/fetures/employees-api-slice"
import { useGetTeamsQuery } from "@/redux/fetures/teams-api-slice"

interface EmployeeDetailsDrawerProps {
  employee: EmployeesDataSchema | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeDetailsDrawer({ employee, open, onOpenChange }: EmployeeDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation()
  const {data: teams} = useGetTeamsQuery()

  const [formData, setFormData] = useState<Partial<EmployeesDataSchema>>({})

  // Reset form data when client changes or drawer opens
  useState(() => {
    if (employee) {
      setFormData(employee)
      setIsEditing(false)
    }
  })

  if (!employee) return null

  const handleEdit = () => {
    setFormData(employee)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(employee)
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateEmployee({ id: employee.id, data: formData as EmployeesDataSchema }).unwrap()
      setIsEditing(false)
      onOpenChange(false)
      toast("Success", {
          description: "Employee updated successfully",
        })
    } catch (error) {
        toast("Error", {
          description: "Failed to update employee. Please try again.",
        })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "inactive":
        return "bg-red-500/10 text-gray-500 hover:bg-red-500/20"
      default:
        return ""
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-6">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl">Employee Details</SheetTitle>
              <SheetDescription>{isEditing ? "Edit client information" : "View client information"}</SheetDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2 bg-transparent">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Client Avatar and Basic Info */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {employee.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{employee.fullName}</h3>
              <p className="text-sm text-muted-foreground">email: {employee.email}</p>
              <Badge variant="secondary" className={`mt-1 ${getStatusColor(employee.status)}`}>
                {employee.status}
              </Badge>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                </Label>
                {isEditing ? (
                    <Input
                    placeholder="full name"
                    id="fullName"
                    value={formData.fullName || ""}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{employee.fullName}</p>
                )}
                </div>

                <div className="space-y-2 flex-1">
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                </Label>
                {isEditing ? (
                    <Input
                    placeholder="email"
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                </Label>
                {isEditing ? (
                    <Input
                    placeholder="phone number"
                    id="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{employee.phoneNumber}</p>
                )}
                </div>

                <div className="space-y-2 flex-1">
                <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                </Label>
                {isEditing ? (
                    <Input
                    placeholder="address"
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{employee.address}</p>
                )}
                </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installationDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Hire Date
                </Label>
                {isEditing ? (
                  <Input
                    id="installationDate"
                    type="date"
                    value={
                        formData.hireDate
                        ? new Date(formData.hireDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                        setFormData({ ...formData, hireDate: e.target.value })
                    }
                    />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "N/A"}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="role">
                    Role
                </Label>
                {isEditing ? (
                    <Input
                      placeholder="role"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={(e)=>setFormData({...formData, role: e.target.value})}
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">

              <div className="flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                      <Select
                      value={formData.status || ""}
                      onValueChange={(value: EmployeeStatus) => setFormData({ ...formData, status: value })}
                      required
                      >
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.values(EmployeeStatus).map((stat)=> (
                              <SelectItem value={stat} key={stat}>{stat}</SelectItem>
                          ))}
                      </SelectContent>
                      </Select>
                  ) : (
                      <p className="text-sm text-muted-foreground capitalize">{employee.status}</p>
                  )}
                  </div>
              </div>
              <div className='flex flex-col gap-2 flex-1'>
                  <Label htmlFor='team'>Assigned to Team</Label>
                  {isEditing ? (
                      <Select value={formData.teamId}
                        onValueChange={(value: string)=>setFormData({...formData, teamId: value})}
                    >
                        <SelectTrigger id="team" className="w-full">
                            <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams?.map((team)=> (
                                <SelectItem value={team.id} key={team.id}>{team.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  ) : (
                      <p className="text-sm text-muted-foreground">{employee.team?.name}</p>
                  )}
              </div>
            </div>

          {isEditing && (
            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, CreditCard, User, Edit2, Save, X } from "lucide-react"
import { Accounts, ClientDataSchema, clientTypeSchema, servicePlanSchema } from "@/types/clients"
import { useDeleteClientAccountMutation, useUpdateClientMutation } from "@/redux/fetures/clientApiSlice"
import { formatCurrency } from "@/utils/formatCurrency"
import { toast } from "sonner"
import { useGetCoverageQuery } from "@/redux/fetures/converage-api-slice"
import { useGetServicePlanQuery } from "@/redux/fetures/service-plan-api-slice"
import { useGetClientTypesQuery } from "@/redux/fetures/client-type-slice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import EditAccountDialog from "../dialogs/create-account-dialog"
import CreateAccountDialog from "../dialogs/create-account-dialog"
import { IconPlus } from "@tabler/icons-react"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"


interface ClientDetailsDrawerProps {
  client: ClientDataSchema | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AddAccountProps {
  open: boolean
  isEditing: boolean
  selectedAccount: Accounts | null
}

export function ClientDetailsDrawer({ client, open, onOpenChange }: ClientDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [updateClient, { isLoading: updatingAccount }] = useUpdateClientMutation()
  const [deleteClientAccount, { isLoading: deletingAccount }] = useDeleteClientAccountMutation()
  const [selectedClient, setSelectedClient] = useState<ClientDataSchema | null>(client)
  const [clientAccounts, setClientAccounts] = useState<Accounts[] | null>(client?.accounts!)
  const [openAddAccount, setOpenAddAccount] = useState<AddAccountProps>({
    open: false,
    isEditing: false,
    selectedAccount: null
  })

  useEffect(()=>{
    console.log(client)
  }, [client])

  const [formData, setFormData] = useState<Partial<ClientDataSchema>>({})

// Reset form data when client changes or drawer opens
  useEffect(() => {
    if (client) {
      setFormData(client)
      setIsEditing(false)
      setSelectedClient(client)
      setClientAccounts(client.accounts!)
    }
  }, [client])

  if (!client) return null

  const handleEdit = () => {
    setFormData(client)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(client)
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updatedClient = await updateClient({ id: client.id, data: formData }).unwrap()
      setIsEditing(false)
      setSelectedClient(updatedClient)
      toast("Success", {
          description: "Client updated successfully",
        })
    } catch (error) {
        toast("Error", {
          description: "Failed to update client. Please try again.",
        })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "inactive":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return ""
    }
  }

  const handleDeleteAccount = async(id: string) => {
    try {
      await deleteClientAccount(id).unwrap()
      setClientAccounts((prev) => (prev ? prev.filter((acc) => acc.id !== id) : []));
      toast.success("Account Deleted Successfully")
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    }
  }

const handleAddClientAccount = (acc: Accounts) => {
  setClientAccounts((prev) => [...(prev ?? []), acc]);
};
const handleUpdateClientAccount = (acc: Accounts) => {
  setClientAccounts((prev) =>
    prev ? prev.map((item) =>
      item.id === acc.id ? { ...item, ...acc } : item
    ) : []
  );
};

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-6">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl">Client Details</SheetTitle>
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
              {client.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{selectedClient?.fullName}</h3>
              <p className="text-sm text-muted-foreground">Acc: {selectedClient?.accountNumber}</p>
              <Badge variant="secondary" className={`mt-1 ${getStatusColor(selectedClient?.status!)}`}>
                {client.status}
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
                    id="fullName"
                    value={formData.fullName || ""}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{selectedClient?.fullName}</p>
                )}
                </div>

                <div className="space-y-2 flex-1">
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                </Label>
                {isEditing ? (
                    <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{selectedClient?.email}</p>
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
                    id="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{selectedClient?.phoneNumber}</p>
                )}
                </div>

                <div className="space-y-2 flex-1">
                <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                </Label>
                {isEditing ? (
                    <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">{selectedClient?.address}</p>
                )}
                </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Account Number
                </Label>
                {isEditing ? (
                  <Input
                    id="accountNumber"
                    readOnly
                    value={formData.accountNumber || ""}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.accountNumber || "N/A"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mikrotikAccount">Mikrotik Account</Label>
                {isEditing ? (
                  <Input
                    id="mikrotikAccount"
                    value={formData.mikrotikAccount || ""}
                    onChange={(e) => setFormData({ ...formData, mikrotikAccount: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.mikrotikAccount || "N/A"}</p>
                )}
              </div>
            </div> */}

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installationDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Installation Date
                </Label>
                {isEditing ? (
                  <Input
                    id="installationDate"
                    type="date"
                    value={
                        formData.installationDate
                        ? new Date(formData.installationDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                        setFormData({ ...formData, installationDate: e.target.value })
                    }
                    />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {client.installationDate ? new Date(client.installationDate).toLocaleDateString() : "N/A"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingDay">Billing Day</Label>
                {isEditing ? (
                  <Input
                    id="billingDay"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.billingDay || ""}
                    onChange={(e) => setFormData({ ...formData, billingDay: Number(e.target.value) })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{client.billingDay || "N/A"}</p>
                )}
              </div>
            </div> */}
            <div className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                    <Select
                    value={formData.status || ""}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PARTIALLY_DISCONNECTED">Partially Disconnected</SelectItem>
                        <SelectItem value="TERMINATED">Terminated</SelectItem>
                    </SelectContent>
                    </Select>
                ) : (
                    <p className="text-sm text-muted-foreground capitalize">{client.status}</p>
                )}
                </div>

                {/* <div className="space-y-2 flex-1">
                    <Label htmlFor="servicePlanId">
                        Service Plan {isEditing && <span className="text-destructive">*</span>}
                    </Label>
                    {isEditing ? (
                        <Select
                        value={formData.servicePlanId}
                        onValueChange={(value) => setFormData({ ...formData, servicePlanId: value })}
                        required
                        >
                        <SelectTrigger id="servicePlanId" className="w-full">
                            <SelectValue placeholder="Select a service plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {servicePlans?.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                                {plan.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    ) : (
                        <p className="text-sm text-muted-foreground">{client.servicePlan?.name}</p>
                    )}
                </div> */}
            </div>
            {/* <div className="space-y-2">
                <Label htmlFor="servicePlanId">
                    Client Type {isEditing && <span className="text-destructive">*</span>}
                </Label>
                {isEditing ? (
                    <Select
                    value={formData.clientTypeId}
                    onValueChange={(value) => setFormData({ ...formData, clientTypeId: value })}
                    required
                    >
                    <SelectTrigger id="servicePlanId" className="w-full">
                        <SelectValue placeholder="Select a service plan" />
                    </SelectTrigger>
                    <SelectContent>
                        {clientTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                            {type.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                ) : (
                    <p className="text-sm text-muted-foreground">{client.clientType?.name}</p>
                )}
            </div> */}
            {/* <div className="space-y-2">
                <Label htmlFor="coverageId">
                Coverage
                </Label>
                {isEditing ? (
                  <Select
                  value={formData.coverageId}
                  onValueChange={(value) => setFormData({ ...formData, coverageId: value })}
                  required
                  >
                  <SelectTrigger id="coverageId" className="w-full">
                      <SelectValue placeholder="Select a coverage" />
                  </SelectTrigger>
                  <SelectContent>
                      {coverage?.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                          {area.name}
                      </SelectItem>
                      ))}
                  </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">{client.coverage?.name}</p>
                )}
            </div> */}
            {/* Associated Accounts Table */}
            {/* Associated Accounts Table */}
            {/* Associated Accounts */}
            {!isEditing && clientAccounts && clientAccounts.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Associated Accounts</h3>
                  {selectedClient && <Button type="button" size="sm" onClick={()=>setOpenAddAccount({open: true, isEditing: false, selectedAccount: null})}><IconPlus /> Add Account</Button>}
                </div>

                {clientAccounts.map((acc) => (
                  <Card key={acc.id} className="border rounded-xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-semibold">
                        Account #{acc.accountNumber}
                      </CardTitle>

                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8"
                          onClick={()=>setOpenAddAccount({open: true, isEditing: true, selectedAccount: acc})}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <DeleteConfirmAction
                          title="Delete Client Account"
                          message="Are you sure you want to delete this client associated account?"
                          triggerButton={
                            <Button disabled={deletingAccount} type="button" variant="destructive" size="icon" className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          onConfirm={()=>handleDeleteAccount(acc.id)}
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Service Plan:</span>
                        <span>{acc.servicePlan?.name || "N/A"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Monthly Fee:</span>
                        <span>
                          ₱{acc.servicePlan?.monthlyFee?.toLocaleString() ?? "0"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className="capitalize">{acc.status}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Coverage:</span>
                        <span className="capitalize">{acc.coverage?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Address:</span>
                        <span className="capitalize">{acc.address}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Billing Day:</span>
                        <span>{acc.billingDay}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Installation:</span>
                        <span>
                          {acc.installationDate
                            ? new Date(acc.installationDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">ODP PORT</span>
                        <span className="capitalize">{acc.odpPort?.portNumber || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Payment Type:</span>
                        <span className="capitalize">{acc.paymentType || "N/A"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updatingAccount}
                className="gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={updatingAccount} className="gap-2">
                <Save className="h-4 w-4" />
                {updatingAccount ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
      <CreateAccountDialog 
        open={openAddAccount.open} 
        isEditing={openAddAccount.isEditing} 
        onOpenChange={(open) => {setOpenAddAccount({open, isEditing: false, selectedAccount: null})}} 
        account={openAddAccount.selectedAccount!} 
        clientId={selectedClient?.id}
        onAddClientAccount={(acc) => handleAddClientAccount(acc)}
        onUpdateClientAccount={(acc)=>handleUpdateClientAccount(acc)}
      />
    </Sheet>
  )
}

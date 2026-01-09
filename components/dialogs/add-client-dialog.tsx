"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox"
import { RefreshCw } from "lucide-react"
import { clientApiSlice, useCreateClientMutation, useGetClientsQuery } from "@/redux/fetures/clientApiSlice"
import { BillType } from "@/types/billing"
import { ClientDataSchema, clientTypeSchema, servicePlanSchema } from "@/types/clients"
import { toast } from "sonner"
import { useGetCoverageQuery } from "@/redux/fetures/converage-api-slice"
import { CoverageDataSchema } from "@/types/coverage"
import { useGetServicePlanQuery } from "@/redux/fetures/service-plan-api-slice"
import { useGetClientTypesQuery } from "@/redux/fetures/client-type-slice"
import { SelectOdp } from "../combobox/select-odp"
import { ODP, OdpPort, PortStatus } from "@/types/networks"
import { id } from "zod/v4/locales"
import { useGetOdpPortsMutation } from "@/redux/fetures/network-hierarchy-api-slice"
import { generateAccountNumber } from "@/utils/generateAccountNumber"

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const {data: servicePlans} = useGetServicePlanQuery()
  const {data: clientTypes} = useGetClientTypesQuery()
  const {data: coverage} = useGetCoverageQuery()
  const [selectedOdp, setSelectedOdp] = useState<ODP | null>(null)

  const [formData, setFormData] = useState({
    code: `CLT-${Date.now().toString().slice(-6)}`, // Auto-generated code
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    installationDate: "",
    accountNumber: "",
    mikrotikAccount: "",
    billingDay: 0,
    servicePlanId: "",
    clientTypeId: "",
    coverageId: "",
    odpPortId: "",
    notes: "",
    proRatedDays: "",
  })

  const [createBill, setCreateBill] = useState<BillType>()
  const [showCreateBilling, setShowCreateBilling] = useState(false)
  const [createClient, {isLoading}] = useCreateClientMutation()
  const [getOdpPorts] = useGetOdpPortsMutation()
  const [errorMess, setErrorMess] = useState("")
  const [odpPorts, setOdpPorts] = useState<OdpPort[] | null>(null)
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setErrorMess("")
    try {
      await createClient({...formData, createBill}).unwrap()
        setFormData({
          code: `CLT-${Date.now().toString().slice(-6)}`,
          fullName: "",
          email: "",
          phoneNumber: "",
          address: "",
          installationDate: "",
          accountNumber: "",
          mikrotikAccount: "",
          billingDay: 0,
          servicePlanId: "",
          clientTypeId: "",
          coverageId: "",
          odpPortId: "",
          notes: "",
          proRatedDays: ""
        })
        onOpenChange(false)
        toast("Success", {
            description: "Client added successfully",
          })
    } catch (error: any) {
      console.log(error)
      setErrorMess(error.data.error || error.data.message)
      toast("Error", {
            description: error.data.error || error.data.message,
          })
    }
  }

  const getPorts = async(odpId: string) => {
    try {
      const odpPorts = await getOdpPorts(odpId).unwrap()
      setOdpPorts(odpPorts)
    } catch (error) {
      console.log(error)
      setOdpPorts(null)
    }
  }

  useEffect(()=>{
    if(selectedOdp){
      getPorts(selectedOdp.id)
    }
  }, [selectedOdp])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[600px] 
        p-4 sm:p-6 rounded-xl"
      >
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Fill in the client information below to add a new client to your system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auto-generated Code */}
          {errorMess && <p className="text-destructive text-center font-medium">{errorMess}</p>}
          <div className="space-y-2">
            <Label htmlFor="code">Client Code</Label>
            <Input id="code" value={formData.code} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Auto-generated client code</p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            {/* Full Name */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                />
            </div>

            {/* Email */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
                </Label>
                <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {/* Phone Number */}
            <div className="space-y-2 md:max-w-[40%] flex-1">
                <Label htmlFor="phoneNumber">
                Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                id="phoneNumber"
                type="tel"
                placeholder="0990 123 4567"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                />
            </div>

            {/* Address */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="address">
                Address <span className="text-destructive">*</span>
                </Label>
                <Input
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            {/* Installation Date */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="installationDate" className="p-3">Installation Date <span className="text-destructive">*</span></Label>
                <Input
                id="installationDate"
                type="date"
                value={formData.installationDate}
                onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                required
                />
            </div>

            {/* Account Number */}
            <div className="space-y-2 flex-1">
                <div className="flex items-center gap-1">
                  <Label htmlFor="accountNumber">Account Number <span className="text-destructive">*</span></Label>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md"
                    onClick={()=>setFormData({...formData, accountNumber: generateAccountNumber()})}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Generate
                  </Button>
                </div>
                <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
                />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {/* Mikrotik Account */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="mikrotikAccount">Mikrotik Account <span className="text-destructive">*</span></Label>
                <Input
                id="mikrotikAccount"
                placeholder="Enter Mikrotik account"
                value={formData.mikrotikAccount}
                onChange={(e) => setFormData({ ...formData, mikrotikAccount: e.target.value })}
                />
            </div>

            {/* Billing Day */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="billingDay">Billing Day <span className="text-destructive">*</span></Label>
                <Input
                id="billingDay"
                type="number"
                min="1"
                max="28"
                placeholder="Day of month (1-28)"
                value={formData.billingDay}
                onChange={(e) => setFormData({ ...formData, billingDay: Number(e.target.value) })}
                required
                />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {/* Service Plan */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="servicePlanId">
                Service Plan <span className="text-destructive">*</span>
                </Label>
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
            </div>

            {/* Client Type */}
            <div className="space-y-2 flex-1">
                <Label htmlFor="clientTypeId">
                Client Type <span className="text-destructive">*</span>
                </Label>
                <Select
                value={formData.clientTypeId}
                onValueChange={(value) => setFormData({ ...formData, clientTypeId: value })}
                required
                >
                <SelectTrigger id="clientTypeId" className="w-full">
                    <SelectValue placeholder="Select a client type" />
                </SelectTrigger>
                <SelectContent>
                    {clientTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                        {type.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="coverageId">
              Coverage
              <span className="text-destructive">*</span>
              </Label>
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
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="odp">Select ODP/NAP</Label>
              <div className="w-full" id="odp">
                <SelectOdp onSelect={setSelectedOdp} />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="odpPort">Select Port Number</Label>
              <div className="w-full" id="odpPort">
                <Select
                  value={formData.odpPortId}
                  onValueChange={(value) => setFormData({ ...formData, odpPortId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Port Number" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                      {odpPorts?.map((port) => (
                      <SelectItem disabled={port.status === PortStatus.OCCUPIED} key={port.id} value={port.id}>
                          Port {port.portNumber} - {port.status}
                      </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex-1">
              <Label htmlFor="notes">Notes</Label>
              <Input
              id="notes"
              placeholder="extra notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox onCheckedChange={(checked: boolean)=>{setShowCreateBilling(checked); setCreateBill(null)}} id="terms" />
            <Label htmlFor="terms">Generate Bill</Label>
          </div>
          {showCreateBilling && (
            <>
                <div className="ml-4 flex items-center gap-4">
                    {(["Full", "ThisMonth", "NextMonth", "ProRated"] as const).map((type) => (
                        <div key={type} className="flex items-center gap-2">
                            <Checkbox
                                id={type.toLowerCase()}
                                checked={createBill === type}
                                onCheckedChange={(checked) => setCreateBill(checked ? type : null)}
                            />
                            <Label htmlFor={type.toLowerCase()}>{type}</Label>
                        </div>
                    ))}
                </div>
                {createBill === "Full" && <p className="text-muted-foreground text-sm">Note: This feature generates a full bill for a selected customer package</p>}
                {createBill === "ProRated" && (
                    <div>
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="proRatedDays">Number of Days</Label>
                            <Input
                            id="proRatedDays"
                            type="number"
                            min="0"
                            placeholder=""
                            value={formData.proRatedDays}
                            onChange={(e) => setFormData({ ...formData, proRatedDays: e.target.value })}
                            />
                        </div>
                        <p className="text-muted-foreground text-sm">Note: This feature generates a prorated bill for the selected customer package, calculating charges based on the number of days used. The package price is divided over 30 days.</p>
                    </div>
                )}
            </>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">{isLoading ? "Creating..." : "Add Client"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

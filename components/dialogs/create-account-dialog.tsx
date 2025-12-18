"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Accounts, ClientDataSchema } from '@/types/clients'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectOdp } from '../combobox/select-odp'
import { useGetServicePlanQuery } from '@/redux/fetures/service-plan-api-slice'
import { useGetClientTypesQuery } from '@/redux/fetures/client-type-slice'
import { useGetCoverageQuery } from '@/redux/fetures/converage-api-slice'
import { ODP, OdpPort, PortStatus } from '@/types/networks'
import { BillType } from '@/types/billing'
import { useGetOdpPortMutation, useGetOdpPortsMutation } from '@/redux/fetures/network-hierarchy-api-slice'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { formatDate } from '@/utils/formatDate'
import { useCreateAccountMutation, useUpdateClientAccountMutation } from '@/redux/fetures/clientApiSlice'
import { RefreshCw } from 'lucide-react'
import { generateAccountNumber } from '@/utils/generateAccountNumber'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: Accounts
  isEditing?: boolean,
  clientId?: string,
  onAddClientAccount: (acc: Accounts) => void
  onUpdateClientAccount?: (acc: Accounts) => void
}

const CreateAccountDialog = ({
  open,
  onOpenChange,
  account,
  isEditing,
  clientId,
  onAddClientAccount,
  onUpdateClientAccount
}: DialogProps) => {

  const { data: servicePlans } = useGetServicePlanQuery()
  const { data: clientTypes } = useGetClientTypesQuery()
  const { data: coverage } = useGetCoverageQuery()

  const [selectedOdp, setSelectedOdp] = useState<ODP | null>(null)
  const [selectedOdpPort, setSelectedOdpPort] = useState<OdpPort | null>(null)
  const [odpPorts, setOdpPorts] = useState<OdpPort[] | null>(null)

  const [getOdpPorts] = useGetOdpPortsMutation()
  const [getOdpPort] = useGetOdpPortMutation()
  const [createAccount, { isLoading: creating }] = useCreateAccountMutation()
  const [updateAccount, { isLoading: updating }] = useUpdateClientAccountMutation()

  const [showCreateBilling, setShowCreateBilling] = useState(false)
  const [createBill, setCreateBill] = useState<BillType>()

  const [formData, setFormData] = useState({
    accountNumber: "",
    address: "",
    installationDate: "",
    mikrotikAccount: "",
    billingDay: 0,
    servicePlanId: "",
    clientTypeId: "",
    coverageId: "",
    odpPortId: "",
    notes: "",
    status: "ACTIVE",
    proRatedDays: "",
  })

  // Load ports when ODP is selected
  const loadPorts = async (odpId: string) => {
    try {
      const ports = await getOdpPorts(odpId).unwrap()
      setOdpPorts(ports)
    } catch (error) {
      console.error(error)
      setOdpPorts(null)
    }
  }

  useEffect(() => {
    if (selectedOdp) loadPorts(selectedOdp.id)
  }, [selectedOdp])

  useEffect(() => {
    console.log(clientId)
  if (isEditing && account) {
    setSelectedOdp(account.odpPort?.odp ?? null)
    setSelectedOdpPort(account.odpPort ?? null)

    // Prefill form
    setFormData({
      accountNumber: account.accountNumber,
      address: account.address ?? "",
      installationDate: account.installationDate
        ? account.installationDate.split("T")[0]
        : "",
      mikrotikAccount: account.mikrotikAccount ?? "",
      billingDay: account.billingDay ?? 0,
      servicePlanId: account.servicePlanId ?? "",
      clientTypeId: account.clientTypeId ?? "",
      coverageId: account.coverageId ?? "",
      odpPortId: account.odpPort?.id ?? "",
      notes: account.notes ?? "",
      status: account.status ?? "ACTIVE",
      proRatedDays: "",
    })

    // Fetch the latest port
    // getNewSelectedPort()
  } else {
    setFormData((prev) => ({ ...prev, clientId }))
  }
}, [isEditing, account])


  const resetForm = () => {
    setFormData({
        accountNumber: "",
      address: "",
      installationDate: "",
      mikrotikAccount: "",
      billingDay: 0,
      servicePlanId: "",
      clientTypeId: "",
      coverageId: "",
      odpPortId: "",
      notes: "",
      status: "ACTIVE",
      proRatedDays: "",
    })
    setShowCreateBilling(false)
    setCreateBill(undefined)
    setSelectedOdp(null)
    setSelectedOdpPort(null)
    setOdpPorts(null)
  }

const getNewSelectedPort = async () => {
  if (!account?.id) return

  const currentAccountId = account.id // capture current account ID

  try {
    const port = await getOdpPort(currentAccountId).unwrap()
    if (account.id !== currentAccountId) return

    if (port) {
      setSelectedOdpPort(port)
      setFormData((prev) => ({
        ...prev,
        odpPortId: port.id
      }))
    }
  } catch (error) {
    console.error("Failed to fetch ODP port:", error)
  }
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && account) {
        // UPDATE ACCOUNT
        const newAcc = await updateAccount({
          id: account.id,
          data: {...formData, clientId},
        }).unwrap()
        onUpdateClientAccount && onUpdateClientAccount(newAcc)
      } else {
        // CREATE ACCOUNT
        const newAccount = await createAccount({
          ...formData,
          generateBill: showCreateBilling ? createBill : null,
          proRatedDays: formData.proRatedDays || undefined,
          clientId
        }).unwrap()
        onAddClientAccount(newAccount)
      }
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o) }}>
      <DialogContent
        className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[600px] 
        p-4 sm:p-6 rounded-xl"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit Account ${account?.accountNumber}` : "Add Account"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Address + Install Date */}
        {!isEditing && <div className="space-y-2 flex-1">
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
        </div>}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="space-y-2 flex-1">
              <Label>Address <span className="text-destructive">*</span></Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label>Installation Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.installationDate}
                onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Mikrotik + Billing Day */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="space-y-2 flex-1">
              <Label>Mikrotik Account</Label>
              <Input
                value={formData.mikrotikAccount}
                onChange={(e) => setFormData({ ...formData, mikrotikAccount: e.target.value })}
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label>Billing Day <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min="1"
                max="28"
                value={formData.billingDay}
                onChange={(e) => setFormData({ ...formData, billingDay: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Service Plan + Client Type */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="space-y-2 flex-1">
              <Label>Service Plan</Label>
              <Select
                value={formData.servicePlanId}
                onValueChange={(value) => setFormData({ ...formData, servicePlanId: value })}
                required
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {servicePlans?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label>Client Type</Label>
              <Select
                value={formData.clientTypeId}
                onValueChange={(value) => setFormData({ ...formData, clientTypeId: value })}
                required
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {clientTypes?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Coverage */}
          <div className="space-y-2">
            <Label>Coverage</Label>
            <Select
              value={formData.coverageId}
              onValueChange={(value) => setFormData({ ...formData, coverageId: value })}
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {coverage?.map((area) => (
                  <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ODP + Port */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label>Select ODP/NAP</Label>
              <SelectOdp onSelect={setSelectedOdp} selected={selectedOdp} />
            </div>

            <div className="flex-1 space-y-2">
              <Label>Select Port</Label>
                <Select
                value={formData.odpPortId} // fallback to selectedOdpPort
                onValueChange={(v) => {
                    setFormData({ ...formData, odpPortId: v })
                    const selected = odpPorts?.find((p) => p.id === v)
                    setSelectedOdpPort(selected || null)
                }}
                >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Port" />
                </SelectTrigger>

                <SelectContent className="max-h-[210px] overflow-y-auto">
                    {odpPorts?.map((port) => (
                    <SelectItem
                        key={port.id}
                        value={port.id}
                        disabled={port.status === PortStatus.OCCUPIED}
                        onClick={()=>setSelectedOdpPort(port)}
                    >
                        Port {port.portNumber} — {port.status}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>

          {isEditing && <div className="space-y-2">
            <Label>Account Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {["ACTIVE", "PARTIALLY_DISCONNECTED", "TERMINATED"]?.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Billing options (only for create) */}
          {!isEditing && (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  onCheckedChange={(checked: boolean) => {
                    setShowCreateBilling(checked)
                    setCreateBill(undefined)
                  }}
                />
                <Label>Generate Bill</Label>
              </div>

              {showCreateBilling && (
                <>
                  <div className="ml-4 flex items-center gap-4">
                    {(["Full", "ThisMonth", "NextMonth", "ProRated"] as const).map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <Checkbox
                          checked={createBill === t}
                          onCheckedChange={(checked) =>
                            setCreateBill(checked ? t : undefined)
                          }
                        />
                        <Label>{t}</Label>
                      </div>
                    ))}
                  </div>

                  {createBill === "ProRated" && (
                    <div className="space-y-2 ml-4">
                      <Label>Number of Days</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.proRatedDays}
                        onChange={(e) =>
                          setFormData({ ...formData, proRatedDays: e.target.value })
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating || updating}>
              {creating || updating
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Add Account"}
            </Button>
          </div>

        </form>

      </DialogContent>
    </Dialog>
  )
}

export default CreateAccountDialog

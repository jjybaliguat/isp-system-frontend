"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreateBillingMutation, useUpdateBillingMutation } from "@/redux/fetures/billing-api-slice"
import { useGetAccountsQuery } from "@/redux/fetures/clientApiSlice"
import { toast } from "sonner"
import { Accounts } from "@/types/clients"
import { formatCurrency } from "@/utils/formatCurrency"
import { BillingDataSchema, CreateBillingForAccountInput } from "@/types/billing"

interface CreateBillingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  billing?: BillingDataSchema
  onUpdateBill?: (bill: BillingDataSchema) => void
}

const MONTHS = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

interface DiscountItem {
  description: string
  amount: number
}

interface FormDataProps {
  accountId: string
  month: string
  year: string
  discount: DiscountItem[]
}

export function CreateBillingDialog({ open, onOpenChange, billing, onUpdateBill }: CreateBillingDialogProps) {
  const today = new Date()
  const currentMonthIndex = today.getMonth()

  // edit mode flag
  const isEdit = Boolean(billing)

  const [formData, setFormData] = useState<FormDataProps>({
    accountId: billing?.account?.id || "",
    month: billing?.period?.split(" ")[0] || MONTHS[currentMonthIndex],
    year: billing?.period?.split(" ")[1] || `${today.getFullYear()}`,
    discount: billing?.discounts?.map(d => ({ description: d.description || "", amount: Number(d.amount) })) || [],
  })

  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [createBilling, { isLoading: isCreating }] = useCreateBillingMutation()
  const [updateBilling, { isLoading: isUpdating }] = useUpdateBillingMutation()

  const { data, isLoading: isFetchingClients } = useGetAccountsQuery({
    search: debouncedSearch,
  })

  const accountsData = data?.data || []

  const selectedAccount = useMemo(() => {
    return isEdit? billing?.account : accountsData?.find((acc) => acc.id === formData.accountId)
  }, [accountsData, formData.accountId, billing])

  const baseAmount = useMemo(() => {
    return Number(selectedAccount?.servicePlan?.monthlyFee) || 0
  }, [selectedAccount])

  const totalDiscount = useMemo(() => {
    return formData.discount?.reduce((sum, d) => sum + Number(d.amount || 0), 0)
  }, [formData.discount])

  const calculatedTotal = useMemo(() => {
    const total = baseAmount - totalDiscount
    return total >= 0 ? total : 0
  }, [baseAmount, totalDiscount])

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchValue), 500)
    return () => clearTimeout(handler)
  }, [searchValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.accountId) {
      toast.error("Please select a client account")
      return
    }

    try {
      const period = `${formData.month} ${formData.year}`
      const monthIndex = MONTHS.indexOf(formData.month) + 1
      const billingDay = selectedAccount?.billingDay ?? 1
      const dueDateString = `${formData.year}-${String(monthIndex).padStart(2, "0")}-${String(billingDay).padStart(2, "0")}`

      const payload = {
        accountId: formData.accountId,
        period,
        amount: calculatedTotal,
        dueDate: dueDateString,
        discounts: formData.discount.map((d) => ({ description: d.description || null, amount: Number(d.amount) })),
      }

      if (isEdit && billing?.id) {
        const newBill = await updateBilling({ id: billing.id, data: payload } as {id: string, data: CreateBillingForAccountInput}).unwrap()
        onUpdateBill && onUpdateBill(newBill)
        toast.success("Billing updated successfully")
      } else {
        await createBilling(payload as any).unwrap()
        toast.success("Billing created successfully")
      }

      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error(isEdit ? "Failed to update billing" : "Failed to create billing")
    }
  }

  useEffect(()=> {
    setFormData({
      accountId: billing?.account?.id || "",
      month: billing?.period?.split(" ")[0] || MONTHS[currentMonthIndex],
      year: billing?.period?.split(" ")[1] || `${today.getFullYear()}`,
      discount: billing?.discounts?.map(d => ({ description: d.description || "", amount: Number(d.amount) })) || [],
    })
  }, [billing])

  const handleSelectAccount = (acc: Accounts) => {
    setFormData({ ...formData, accountId: acc.id })
    setComboboxOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[700px] p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Billing" : "Create New Bill"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update billing details" : "Fill in the details to create a new billing invoice"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client selector */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Client *</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between bg-transparent"
                  disabled={isEdit}
                >
                  {selectedAccount
                    ? `${selectedAccount?.client?.fullName} | BillingDay - ${selectedAccount?.billingDay}`
                    : "Select client..."}
                  {!isEdit && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
              </PopoverTrigger>

              {!isEdit && (
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
                    {!isFetchingClients && (!accountsData || accountsData.length === 0) && (
                      <div className="p-4 text-center text-muted-foreground">No client found.</div>
                    )}
                    {!isFetchingClients && accountsData?.length > 0 && (
                      <ul className="p-2">
                        {accountsData.map((acc) => (
                          <li key={acc.id}>
                            <button
                              type="button"
                              className={cn(
                                "w-full text-left hover:bg-primary/10 flex items-center gap-3 rounded-md py-1 px-2",
                                formData.accountId === acc.id ? "bg-primary/20" : ""
                              )}
                              onClick={() => handleSelectAccount(acc)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.accountId === acc.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{acc.client?.fullName} ({acc.accountNumber})</span>
                                <span className="text-xs text-muted-foreground">Billing Day: {acc.billingDay}</span>
                                <span className="text-xs text-muted-foreground">Address: {acc.address}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          </div>

          {/* Month / Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Billing Month *</Label>
              <Select
                value={formData.month}
                onValueChange={(value) => setFormData({ ...formData, month: value })}
                required
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Billing Year *</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => setFormData({ ...formData, year: value })}
                required
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discounts editor */}
          <div className="space-y-2">
            <Label>Discounts</Label>
            {formData.discount.length === 0 && <div className="text-sm text-muted-foreground">No discounts applied.</div>}
            {formData.discount.map((d, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  placeholder="Description (optional)"
                  value={d.description}
                  onChange={(e) => {
                    const updated = [...formData.discount]
                    updated[idx] = { ...updated[idx], description: e.target.value }
                    setFormData({ ...formData, discount: updated })
                  }}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={d.amount === 0 ? "" : String(d.amount)}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseFloat(e.target.value)
                    const updated = [...formData.discount]
                    updated[idx] = { ...updated[idx], amount: Number.isNaN(val) ? 0 : val }
                    setFormData({ ...formData, discount: updated })
                  }}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const updated = formData.discount.filter((_, i) => i !== idx)
                    setFormData({ ...formData, discount: updated })
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setFormData({
                  ...formData,
                  discount: [...formData.discount, { description: "", amount: 0 }],
                })
              }
            >
              + Add Discount
            </Button>
          </div>

          {/* Billing Details Preview */}
          {selectedAccount && (
            <div className="space-y-2">
              <Label>Billing Details</Label>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Acc</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Discounts</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{selectedAccount.client.fullName}</TableCell>
                      <TableCell className="font-medium">{selectedAccount.accountNumber}</TableCell>
                      <TableCell className="text-right">{formatCurrency(baseAmount)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalDiscount)}
                        {formData.discount.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1 text-right">
                            {formData.discount.map((d, i) => (
                              <div key={i}>
                                {d.description ? `${d.description}: ` : ""}
                                {formatCurrency(Number(d.amount || 0))}
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(calculatedTotal)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isEdit ? (isUpdating ? "Updating..." : "Update Bill") : isCreating ? "Creating..." : "Create Bill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

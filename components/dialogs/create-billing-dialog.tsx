"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useCreateBillingMutation,
  useUpdateBillingMutation,
} from "@/redux/fetures/billing-api-slice"
import { useGetAccountsQuery } from "@/redux/fetures/clientApiSlice"
import { toast } from "sonner"
import { Accounts } from "@/types/clients"
import { formatCurrency } from "@/utils/formatCurrency"
import {
  BillingDataSchema,
  CreateBillingForAccountInput,
} from "@/types/billing"
import { set } from "lodash"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

enum BillingType {
  REGULAR = "REGULAR",
  PRORATED = "PRORATED",
  INSTALLATION_FEE = "INSTALLATION_FEE",
  LATE_FEE = "LATE_FEE",
}

interface DiscountItem {
  description: string
  amount: number
}

interface BillingChargeItem {
  name: string
  amount: number
  description?: string
}

interface FormDataProps {
  accountId: string
  month: string
  year: string
  billingType: BillingType
  proratedDays?: number
  charges: BillingChargeItem[]
  discount: DiscountItem[]
  remarks: string
}

interface CreateBillingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  billing?: BillingDataSchema | null
  onUpdateBill?: (bill: BillingDataSchema) => void
}

export function CreateBillingDialog({
  open,
  onOpenChange,
  billing,
  onUpdateBill,
}: CreateBillingDialogProps) {
  const today = new Date()
  const currentMonthIndex = today.getMonth()
  const isEdit = Boolean(billing)

  const [formData, setFormData] = useState<FormDataProps>({
    accountId: billing?.account?.id || "",
    month: billing?.period?.split(" ")[0] || MONTHS[currentMonthIndex],
    year: billing?.period?.split(" ")[1] || `${today.getFullYear()}`,
    billingType: billing?.billingType || BillingType.REGULAR,
    proratedDays: undefined,
    charges:
      billing?.billingCharges?.map(c => ({
        name: c.name,
        amount: Number(c.amount),
        description: c.description || "",
      })) || [],
    discount:
      billing?.discounts?.map(d => ({
        description: d.description || "",
        amount: Number(d.amount),
      })) || [],
    remarks: billing?.remarks || "",
  })

  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [createBilling, { isLoading: isCreating }] =
    useCreateBillingMutation()
  const [updateBilling, { isLoading: isUpdating }] =
    useUpdateBillingMutation()

  const { data, isLoading: isFetchingClients } = useGetAccountsQuery({
    search: debouncedSearch,
  })

  const accountsData = data?.data || []

  const selectedAccount = useMemo(() => {
    return isEdit
      ? billing?.account
      : accountsData.find(acc => acc.id === formData.accountId)
  }, [accountsData, formData.accountId, billing, isEdit])

  const baseAmount = Number(selectedAccount?.servicePlan?.monthlyFee || 0)

  /* Auto-add default service plan charge */
  useEffect(() => {
    if (!selectedAccount || formData.charges.length > 0) return

    setFormData(prev => ({
      ...prev,
      charges: [
        {
          name: selectedAccount.servicePlan?.name || "Monthly Service",
          amount: baseAmount,
        },
      ],
    }))
  }, [selectedAccount, baseAmount, formData.charges.length])

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchValue), 500)
    return () => clearTimeout(handler)
  }, [searchValue])

useEffect(() => {
  if (!selectedAccount) return

  const isDefaultCharge =
    formData.charges.length === 0 ||
    formData.charges.length === 1 &&
      (
        formData.charges[0].name === selectedAccount.servicePlan?.name ||
        formData.charges[0].name.toUpperCase()?.startsWith("PRORATED") ||
        formData.charges[0].name === formData.billingType.replace("_", " ")
      )

  // ⛔ If editing AND user already customized charges → do nothing
  if (isEdit && !isDefaultCharge) return

  if (formData.billingType === BillingType.PRORATED && formData.proratedDays) {
    // console.log("Setting prorated charge")
    setFormData(prev => ({
      ...prev,
      charges: [
        {
          name: `ProRated Charge ${prev.proratedDays} days`,
          amount: parseFloat(
            ((baseAmount / 30) * prev.proratedDays!).toFixed(2)
          ),
        },
      ],
    }))
  } else if (formData.billingType === BillingType.REGULAR) {
    setFormData(prev => ({
      ...prev,
      proratedDays: undefined,
      charges: [
        {
          name: selectedAccount.servicePlan?.name || "Monthly Service",
          amount: baseAmount,
        },
      ],
    }))
  } else {
    setFormData(prev => ({
      ...prev,
      proratedDays: undefined,
      charges: [
        {
          name: prev.billingType.replace("_", " "),
          amount: 0,
        },
      ],
    }))
  }
}, [
  formData.billingType,
  formData.proratedDays,
  baseAmount,
  selectedAccount,
  isEdit,
])


  const chargesTotal = useMemo(() => {
    return formData.charges.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  }, [formData.charges])



  const totalDiscount = useMemo(
    () => formData.discount.reduce((s, d) => s + d.amount, 0),
    [formData.discount]
  )

  const calculatedTotal = Math.max(chargesTotal - totalDiscount, 0)

  useEffect(()=> {
    // console.log("Form Data Changed:", formData)
    setFormData({
      accountId: billing?.account?.id || "",
      month: billing?.period?.split(" ")[0] || MONTHS[currentMonthIndex],
      year: billing?.period?.split(" ")[1] || `${today.getFullYear()}`,
      billingType: billing?.billingType || BillingType.REGULAR,
      proratedDays: undefined,
      charges:
        billing?.billingCharges?.map(c => ({
          name: c.name,
          amount: Number(c.amount),
          description: c.description || "",
        })) || [],
      discount:
        billing?.discounts?.map(d => ({
          description: d.description || "",
          amount: Number(d.amount),
        })) || [],
      remarks: billing?.remarks || "",
    })
  }, [billing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // console.log("Submitting form data:", formData)

    if (!formData.accountId) {
      toast.error("Please select a client")
      return
    }

    try {
      const period = `${formData.month} ${formData.year}`
      const monthIndex = MONTHS.indexOf(formData.month) + 1
      const billingDay = selectedAccount?.billingDay ?? 1
      const dueDate = `${formData.year}-${String(monthIndex).padStart(
        2,
        "0"
      )}-${String(billingDay).padStart(2, "0")}`

      const payload: CreateBillingForAccountInput = {
        accountId: formData.accountId,
        period,
        dueDate,
        amount: calculatedTotal,
        billingType: formData.billingType,
        remarks: formData.remarks || null,
        discounts: formData.discount.map(d => ({
          description: d.description || null,
          amount: d.amount,
        })),
        billingCharges: formData.charges.map(c => ({
          name: c.name,
          amount: c.amount,
          description: c.description || null,
        })),
      }

      if (isEdit && billing?.id) {
        const updated = await updateBilling({
          id: billing.id,
          data: payload,
        }).unwrap()
        onUpdateBill?.(updated)
        toast.success("Billing updated successfully")
      } else {
        await createBilling(payload as any).unwrap()
        toast.success("Billing created successfully")
      }

      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to save billing")
    }
  }

  const handleSelectAccount = (acc: Accounts) => {
    setFormData({ ...formData, accountId: acc.id })
    setComboboxOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Billing" : "Create Billing"}
          </DialogTitle>
          <DialogDescription>
            Billing information and charges
          </DialogDescription>
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
                <SelectTrigger id="month" className="w-full">
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
                <SelectTrigger id="year" className="w-full">
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

          {/* BILLING TYPE */}
          <div className="space-y-2">
            <Label htmlFor="billingType">Billing Type</Label>
            <Select
              value={formData.billingType}
              onValueChange={v =>
                setFormData({ ...formData, billingType: v as BillingType })
              }
            >
              <SelectTrigger id="billingType"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(BillingType).map(t => (
                  <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PRORATED */}
          {formData.billingType === BillingType.PRORATED && (
            <Input
              type="number"
              min={1}
              max={30}
              placeholder="Prorated days"
              value={formData.proratedDays || ""}
              onChange={e =>
                setFormData({
                  ...formData,
                  proratedDays: Number(e.target.value),
                })
              }
              required
            />
          )}

          {/* CHARGES */}
          <Label>Billing Charges</Label>
          {formData.charges.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={c.name}
                onChange={e => {
                  const arr = [...formData.charges]
                  arr[i].name = e.target.value
                  setFormData({ ...formData, charges: arr })
                }}
              />
              <Input
                type="number"
                value={c.amount}
                onChange={e => {
                  const arr = [...formData.charges]
                  arr[i].amount = Number(e.target.value)
                  setFormData({ ...formData, charges: arr })
                }}
                className="w-32"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  setFormData({
                    ...formData,
                    charges: formData.charges.filter((_, idx) => idx !== i),
                  })
                }
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
                charges: [...formData.charges, { name: "", amount: 0 }],
              })
            }
          >
            + Add Charge
          </Button>

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

          {/* REMARKS */}
          <Input
            placeholder="Remarks (optional)"
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(calculatedTotal)}</span>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isEdit ? "Update Billing" : "Create Billing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

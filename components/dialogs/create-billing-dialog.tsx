"use client"

import type React from "react"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreateBillingMutation } from "@/redux/fetures/billing-api-slice"
import { useGetAccountsQuery, useGetClientsQuery } from "@/redux/fetures/clientApiSlice"
import { toast } from "sonner"
import { Accounts, ClientDataSchema } from "@/types/clients"
import { formatCurrency } from "@/utils/formatCurrency"

interface CreateBillingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

export function CreateBillingDialog({ open, onOpenChange }: CreateBillingDialogProps) {
  const today = new Date()
  const currentMonthIndex = today.getMonth();
  const [formData, setFormData] = useState({
    accountId: "",
    month: MONTHS[currentMonthIndex],
    year: `${today.getFullYear()}`,
    discount: "0",
  })

  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [createBilling, { isLoading: isCreatingBilling }] = useCreateBillingMutation()

  const { data, isLoading: isFetchingClients } = useGetAccountsQuery({
    search: debouncedSearch
  })

  console.log(data)

  const accountsData = data?.data || []

  // const [selectedAccount, setSelectedAccount] = useState<Accounts | null>(
  //   formData.accountId
  //     ? accountsData?.find((c) => c.id === formData.accountId) ?? null
  //     : null
  // );

  const selectedAccount = useMemo(() => {
    return accountsData?.find((acc) => acc.id === formData.accountId)
  }, [accountsData, formData.accountId])

  const calculatedTotal = useMemo(() => {
    const amount = Number(selectedAccount?.servicePlan.monthlyFee) || 0
    const discount = Number.parseFloat(formData.discount) || 0
    return amount - discount
  }, [formData.discount])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, 500) // delay in ms

    return () => clearTimeout(handler)
  }, [searchValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const period = `${formData.month} ${formData.year}`

      await createBilling({
        accountId: formData.accountId,
        period,
        amount: calculatedTotal,
        dueDate: `${formData.year}-${MONTHS.indexOf(formData.month)+1}-${selectedAccount?.billingDay}`
      }).unwrap()

      toast("Success", {
        description: "Billing created successfully",
      })

      setFormData({
        accountId: "",
        month: MONTHS[currentMonthIndex],
        year: `${today.getFullYear()}`,
        discount: "0",
      })
      // setSelectedClientName(null)
      setSearchValue("")
      onOpenChange(false)
    } catch (error) {
      console.log(error)
      toast("Error" , {
        description: "Failed to create billing",
      })
    }
  }

  const handleSelectAccount = (acc: Accounts) => {
    setFormData({ ...formData, accountId: acc.id });
    // setSelectedClientName(acc.fullName); // store name separately
    setComboboxOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
            className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[500px] 
            p-4 sm:p-6 rounded-xl"
        >
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogDescription>Fill in the details to create a new billing invoice</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client * - (Search by (name, accountNo., email, phone))</Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedAccount ? `${selectedAccount?.client.fullName} | BillingDay - ${selectedAccount?.billingDay}` : "Select client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <input
                    type="text"
                    aria-label="Search by name, accountNo., email, phone"
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
                      <div className="p-4 text-center text-muted-foreground">
                        No client found.
                      </div>
                    )}

                    {!isFetchingClients && accountsData?.length > 0 && (
                      <ul className="p-2">
                        {accountsData.map(acc => (
                          <li key={acc.id}>
                            <button
                              type="button"
                              className={cn(
                                "w-full text-left hover:bg-primary/10 flex items-center gap-3 rounded-md py-1 px-2",
                                formData.accountId === acc.id ? "bg-primary/20" : ""
                              )}
                              onClick={() => {
                                handleSelectAccount(acc)
                                setComboboxOpen(false)
                              }}
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
              </Popover>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="account">Select Client Account *</Label>
              <Select>
                <SelectTrigger id="account" className="w-full">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {selectedClient?.accounts?.map((acc) => (
                    <SelectItem
                      key={acc.id}
                      value={acc.id}
                      className="flex flex-col p-2 hover:bg-primary/10 rounded-md"
                      title={acc.address} // full address on hover
                    >
                      <span className="font-medium text-sm text-gray-900 truncate">Acc: {acc.accountNumber}</span>
                      <span className="text-xs text-gray-500 truncate">Billing Day: {acc.billingDay}</span>
                      <span className="text-xs text-gray-500 truncate">Address: {acc.address}</span>
                      {acc.mikrotikAccount && (
                        <span className="text-xs text-gray-400 truncate">Mikrotik: {acc.mikrotikAccount}</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>

          {selectedAccount && (
            <div className="space-y-2">
              <Label>Billing Details</Label>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Acc</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{selectedAccount.client.fullName}</TableCell>
                      <TableCell className="font-medium">{selectedAccount.accountNumber}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(selectedAccount?.servicePlan.monthlyFee))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number.parseFloat(formData.discount || "0"))}
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
            <Button type="submit" disabled={isCreatingBilling}>
              {isCreatingBilling ? "Creating..." : "Create Bill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

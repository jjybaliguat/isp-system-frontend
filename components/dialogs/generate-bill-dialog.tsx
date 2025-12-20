"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useGenerateBillMutation } from '@/redux/fetures/billing-api-slice';
import { toast } from 'sonner';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const MONTHS = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

interface FormDataProps {
  month: string
  year: string
  startDay: string
  endDay: string
}

const getDaysInMonth = (month: string, year: string) => {
  const monthIndex = MONTHS.indexOf(month)
  const y = Number(year)
  const daysInMonth = new Date(y, monthIndex + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
}

const GenerateBillDialog = ({ open, onOpenChange }: DialogProps) => {
    const [generateBill, { isLoading }] =  useGenerateBillMutation()
    const today = new Date()
    const currentMonthIndex = today.getMonth()
    const currentYear = today.getFullYear()

    const defaultEnd = new Date(currentYear, currentMonthIndex + 1, 0)

    const [formData, setFormData] = useState<FormDataProps>({
      month: MONTHS[currentMonthIndex],
      year: `${currentYear}`,
      startDay: '1',
      endDay: defaultEnd.getDate().toString(),
    })

    const handleMonthYearChange = (month: string, year: string) => {
      const days = getDaysInMonth(month, year)
      setFormData((prev) => ({
        ...prev,
        month,
        year,
        startDay: '1',
        endDay: days[days.length - 1],
      }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response: any = await generateBill(formData).unwrap()

        toast.success(
          `${response.message}; Total Bills Generated: ${response.generated || 0}`
        )
        onOpenChange(false)
      } catch (error) {
        toast.error("Failed to generate bills")
        console.error(error)
      }
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Generate Bill</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2 flex-1">
                        <Label htmlFor="month">Month *</Label>
                        <Select
                            value={formData.month}
                            onValueChange={(value) =>
                              handleMonthYearChange(value, formData.year)
                            }
                            required
                        >
                            <SelectTrigger id="month" className='w-full'>
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
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="year">Year *</Label>
                        <Select
                            value={formData.year}
                            onValueChange={(value) =>
                              handleMonthYearChange(formData.month, value)
                            }
                            required
                        >
                            <SelectTrigger id="year" className='w-full'>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Start Date *</Label>
                    <Select
                      value={formData.startDay}
                      onValueChange={(value) => setFormData({ ...formData, startDay: value })}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Start Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDaysInMonth(formData.month, formData.year).map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label>End Date *</Label>
                    <Select
                      value={formData.endDay}
                      onValueChange={(value) => setFormData({ ...formData, endDay: value })}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="End Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDaysInMonth(formData.month, formData.year)
                          .filter((day) => Number(day) >= Number(formData.startDay))
                          .map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Generate
                  </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default GenerateBillDialog
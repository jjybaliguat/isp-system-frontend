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
}

const GenerateBillDialog = ({ open, onOpenChange }: DialogProps) => {
    const [generateBill, { isLoading }] =  useGenerateBillMutation()
    const today = new Date()
    const currentMonthIndex = today.getMonth()
    const [formData, setFormData] = useState<FormDataProps>({
      month: MONTHS[currentMonthIndex],
      year: `${today.getFullYear()}`
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response: any = await generateBill(formData).unwrap()
        toast.success(`${response.message}; Total Bills Generated: ${response.generated || 0}`)
        onOpenChange(false)
      } catch (error) {
        toast.error('Failed to generate bills')
        console.error('Failed to generate bills:', error)
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
                            onValueChange={(value) => setFormData({ ...formData, month: value })}
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
                            onValueChange={(value) => setFormData({ ...formData, year: value })}
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
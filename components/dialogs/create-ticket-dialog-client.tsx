"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TicketCategory, TicketPriority } from "@/types/ticket"
import { useCreateTicketMutation, useGetTicketsQuery } from "@/redux/fetures/tickets-api-slice"
import { toast } from "sonner"

const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  category: z.nativeEnum(TicketCategory),
  priority: z.nativeEnum(TicketPriority),
  // dueDate intentionally omitted from the client portal dialog UI
  assignedToId: z.string().optional(),
  clientId: z.string().optional(),
})

type CreateTicketFormValues = z.infer<typeof createTicketSchema>

interface CreateTicketDialogClientProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: Partial<CreateTicketFormValues>
}

function generateRandomNumber(length = 6) {
  let result = ''
  const characters = '0123456789'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function CreateTicketDialogClient({ open, onOpenChange, initialValues }: CreateTicketDialogClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createTicket] = useCreateTicketMutation()
  const { refetch } = useGetTicketsQuery({ page: 1, limit: 100 })
  const yearPrefix = `${new Date().getFullYear()}${new Date().getDate()}`
  const ticketNumber = `${yearPrefix}${generateRandomNumber()}`

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      // client portal defaults: category = BILLING, priority = LOW
      category: TicketCategory.BILLING,
      priority: TicketPriority.LOW,
    },
  })

  // Reset form whenever initialValues or open changes so dialog opens with prefilled data
  useEffect(() => {
    if (initialValues) {
      form.reset({ ...form.getValues(), ...initialValues })
    } else if (open) {
      // ensure defaults when opening without initial values
      form.reset({
        subject: "",
        description: "",
        category: TicketCategory.BILLING,
        priority: TicketPriority.LOW,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, open])

  const onSubmit = async (values: CreateTicketFormValues) => {
    setIsSubmitting(true)
    try {
      await createTicket({ ...values, ticketNumber }).unwrap()
      toast("Success", {
        description: "Ticket created successfully",
      })
      form.reset()
      onOpenChange(false)
      refetch()
    } catch (error: any) {
        console.log(error)
      toast("Error", {
        description: `Failed: ${error.data.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[500px] 
            p-4 sm:p-6 rounded-xl"
      >
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>Fill in the details to create a new support ticket</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <p className="text-muted-foreground">Ticket Number: {ticketNumber}</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Category */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TicketCategory).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ticket subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter ticket description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note: dueDate intentionally omitted in client portal dialog */}

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

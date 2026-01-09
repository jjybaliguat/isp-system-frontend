import React, { useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import { SmsSettingsTemplate } from "@/types/sms"
import { useGetSmsSettingsQuery, useSaveSmsintegrationSettingsMutation } from "@/redux/fetures/provider-api-slice"
import { toast } from "sonner"

interface SmsTemplateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SmsTemplates {
  sendWhenBillIsMadeTemplate: string
  sendWhenBillIsDueTemplate: string
  sendWhenPaymentIsMadeTemplate: string
  sendWhenCustomerAddedTemplate: string
  sendDaysBeforeDueTemplate: string
}

const SmsTemplateDrawer = ({ open, onOpenChange }: SmsTemplateDrawerProps) => {
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<SmsSettingsTemplate | "">(SmsSettingsTemplate.SendWhenBillIsMadeTemplate)
    const [saveSmsintegrationSettings] = useSaveSmsintegrationSettingsMutation()

    const {data: smsSettingsData, isLoading: isSmsSettingsLoading} = useGetSmsSettingsQuery();

  const [smsTemplates, setSmsTemplates] = React.useState<
    SmsTemplates
  >({
    sendWhenBillIsMadeTemplate: smsSettingsData?.sendWhenBillIsMadeTemplate || "",
    sendWhenBillIsDueTemplate: smsSettingsData?.sendWhenBillIsDueTemplate || "",
    sendWhenPaymentIsMadeTemplate: smsSettingsData?.sendWhenPaymentIsMadeTemplate || "",
    sendWhenCustomerAddedTemplate: smsSettingsData?.sendWhenCustomerAddedTemplate || "",
    sendDaysBeforeDueTemplate: smsSettingsData?.sendDaysBeforeDueTemplate || "",
  })

  useEffect(() => {
    if (!isSmsSettingsLoading && smsSettingsData) {
        setSmsTemplates({
        sendWhenBillIsMadeTemplate: smsSettingsData.sendWhenBillIsMadeTemplate || "",
        sendWhenBillIsDueTemplate: smsSettingsData.sendWhenBillIsDueTemplate || "",
        sendWhenPaymentIsMadeTemplate: smsSettingsData.sendWhenPaymentIsMadeTemplate || "",
        sendWhenCustomerAddedTemplate: smsSettingsData.sendWhenCustomerAddedTemplate || "",
        sendDaysBeforeDueTemplate: smsSettingsData.sendDaysBeforeDueTemplate || "",
      })
    }
    }, [isSmsSettingsLoading, smsSettingsData])

  const handleContentChange = (value: string) => {
    if (!selectedTemplate) return

    setSmsTemplates((prev) => ({
      ...prev,
      [selectedTemplate]: value,
    }))
  }

  const handleSaveSettings = async() => {
      try {
        await saveSmsintegrationSettings(smsTemplates).unwrap()
        toast("Success", {
          description: "Sms Integration Settings saved"
        })
      } catch (error) {
        toast("Error", {
          description: "Something went wrong, please try again"
        })
        console.log(error)
      }
    }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto px-6">
        <SheetHeader>
          <SheetTitle className="text-2xl">SMS Templates</SheetTitle>
        </SheetHeader>

        <form className="mt-6 space-y-5">
          {/* Template selector */}
          <div className="space-y-2">
            <Label>SMS Trigger</Label>
            <Select
              value={selectedTemplate}
              onValueChange={(value) =>
                setSelectedTemplate(value as SmsSettingsTemplate)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select when this SMS is sent" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SmsSettingsTemplate).map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template editor */}
          {selectedTemplate && (
            <div className="space-y-2">
              <Label>Message Content</Label>
              <Textarea
                placeholder="Enter SMS message..."
                className="h-[300px] resize-y"
                value={smsTemplates[selectedTemplate]}
                onChange={(e) =>
                  handleContentChange(e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Tip: You can use variables like{" "}
                <code>{"{name}"}</code>,{" "}
                <code>{"{amount}"}</code>,{" "}
                <code>{"{accNum}"}</code>,{" "}
                <code>{"{dueDate}"}</code>,{" "}
                <code>{"{link}"}</code>,{" "}
                <code>{"{billingDay}"}</code>,{" "}
                <code>{"{email}"}</code>,{" "}
                <code>{"{phone}"}</code>,{" "}
                <code>{"{companyName}"}</code>,{" "}
                <code>{"{period}"}</code>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!selectedTemplate}
              onClick={handleSaveSettings}
            >
              Save Template
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default SmsTemplateDrawer

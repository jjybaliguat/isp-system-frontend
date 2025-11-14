"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "../ui/button"
import dynamic from "next/dynamic"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import { useGetProviderQuery } from "@/redux/fetures/provider-api-slice"
import { BillingSettingsSchema, DocumentSettingsProps, NotificationsDataSchema, useUpdateBillingSettingsMutation, useUpdateDocumentSettingsMutation, useUpdateNotificationSettingsMutation, useUpdatePaymentSettingsMutation } from "@/redux/fetures/settings-api-slice"
import { toast } from "sonner"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

const SettingsCards = () => {
  const { data: providerData } = useGetProviderQuery();
const [settings, setSettings] = useState<any>({});
const [updateNotificationSettings, {isLoading: loadingNotification}] = useUpdateNotificationSettingsMutation();
const [updatePaymentSettings, {isLoading: loadingPaymentSettings}] = useUpdatePaymentSettingsMutation();
const [updateBillingSettings, {isLoading: loadingBillingSettings}] = useUpdateBillingSettingsMutation();
const [updateDocumentSettings, {isLoading: loadingDocumentSettings}] = useUpdateDocumentSettingsMutation();

useEffect(() => {
  if (providerData?.settings) {
    setSettings(providerData.settings);
  }
}, [providerData]);

const [billingSettings, setBillingSettings] = useState<BillingSettingsSchema>({
  autoInvoicing: false,
  invoiceGenerationDaysBeforeDue: 0,
  sendInvoiceReminderDaysBeforeDue: '',
});
const [notificationSettings, setNotificationSettings] = useState<NotificationsDataSchema>({
  enabled: false,
  emailUser: '',
  emailPass: '',
  emailHost: '',
  emailPort: 0,
  senderName: '',
  invoiceReminderTemplate: '',
  paymentConfirmationTemplate: '',
  overdueNoticeTemplate: ''
});
const [documentSettings, setDocumentSettings] = useState<DocumentSettingsProps>({
  numberPrefix:   '',
  startingNumber: 0,
  includeTax:     false,
  taxRate:        0,
  companyLogoUrl: '',
  footerMessage:  ''
});
const [latePaymentGracePeriod, setLatePaymentGracePeriod] = useState<number>(0);

useEffect(() => {
  if (settings) {
    setBillingSettings(settings?.billing || {
      autoInvoicing: false,
      invoiceGenerationDaysBeforeDue: 0,
      sendInvoiceReminderDaysBeforeDue: 0,
    });
    setNotificationSettings(settings?.notifications || {
      enabled: settings?.notifications?.enabled || false,
      invoiceReminderTemplate: settings?.notifications?.invoiceReminderTemplate || "",
      paymentConfirmationTemplate: settings?.notifications?.paymentConfirmationTemplate || "",
      overdueNoticeTemplate: settings?.notifications?.overdueNoticeTemplate || ""
    })
    setDocumentSettings(settings?.invoiceDocument || {
      numberPrefix:   settings?.invoiceDocument?.numberPrefix || '',
      startingNumber: settings?.invoiceDocument?.startingNumber || 0,
      includeTax:     settings?.invoiceDocument?.includeTax || false,
      taxRate:        settings?.invoiceDocument?.taxRate || 0,
      companyLogoUrl: settings?.invoiceDocument?.companyLogoUrl || '',
      footerMessage:  settings?.invoiceDocument?.footerMessage || ''
    });
    setLatePaymentGracePeriod(settings?.payment?.latePaymentGracePeriod || 0);
  }
}, [settings]);

const handleSavenotificationSettings = async() => {
  try {
    await updateNotificationSettings({
      ...notificationSettings
    }).unwrap();
    toast.success("Notification settings updated successfully.");
  } catch (error) {
    console.log("Failed to update notification settings:", error);
    toast.error("Failed to update notification settings.");
  }
}

const handleSavePaymentSettings = async() => {
  try {
    await updatePaymentSettings({
      latePaymentGracePeriod: latePaymentGracePeriod,
    }).unwrap();
    toast.success("Payment settings updated successfully.");
  } catch (error) {
    console.log("Failed to update payment settings:", error);
    toast.error("Failed to update payment settings.");
  }
}

const handleSaveBillingAutomations = async() => {
  try {
    await updateBillingSettings({
      ...billingSettings
    }).unwrap();
    toast.success("Billing settings updated successfully.");
  } catch (error) {
    console.log("Failed to update billing settings:", error);
    toast.error("Failed to update billing settings.");
  }
}

const handleSaveDocumentsSettings = async() => {
  try {
    await updateDocumentSettings({
      ...documentSettings
    }).unwrap();
    toast.success("Document settings updated successfully.");
  } catch (error) {
    console.log("Failed to update document settings:", error);
    toast.error("Failed to update document settings.");
  }
}


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ------------------ Billing Automations ------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Automations</CardTitle>
          <CardDescription>Configure automatic invoice generation and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch checked={billingSettings.autoInvoicing} onCheckedChange={(checked)=>setBillingSettings({...billingSettings, autoInvoicing: checked})} id="auto-invoice" />
            <Label htmlFor="auto-invoice">Enable Automatic Invoicing</Label>
          </div>
          <p className="text-sm text-gray-600">
            Automatically generate and send invoices to clients on a recurring basis.
          </p>

          {billingSettings.autoInvoicing && (
            <div className="grid gap-3 mt-3">
              <div className="space-y-2">
                <Label htmlFor="invoice-gen-days">
                  Invoice date generation (days before client due)
                </Label>
                <Input id="invoice-gen-days" type="number" placeholder="e.g., 3"
                  value={billingSettings.invoiceGenerationDaysBeforeDue}
                  onChange={(e)=>setBillingSettings({...billingSettings, invoiceGenerationDaysBeforeDue: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-days">
                  Send invoice reminder (days before invoice due). Separate numbers with comma for multiple days (eg. 5, 3, 2, 0)
                </Label>
                <Input id="reminder-days" type="string" placeholder="e.g., 5, 3, 2, 1, 0"
                  value={billingSettings.sendInvoiceReminderDaysBeforeDue}
                  onChange={(e)=>setBillingSettings({...billingSettings, sendInvoiceReminderDaysBeforeDue: e.target.value})}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={loadingBillingSettings} onClick={handleSaveBillingAutomations}>{loadingBillingSettings? "Saving...": "Save Billing Automations"}</Button>
        </CardFooter>
      </Card>

      {/* ------------------ Payment Settings ------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Configure payment rules and overdue policies. The system will automatically mark invoices as overdue once the grace period expires.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grace-period">Late Payment Grace Period (days)</Label>
            <Input id="grace-period" type="number" placeholder="e.g., 5" value={latePaymentGracePeriod} 
            onChange={(e)=>setLatePaymentGracePeriod(Number(e.target.value))} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={loadingPaymentSettings} onClick={handleSavePaymentSettings}>
            {loadingPaymentSettings? "Saving..." : "Save Payment Settings"}
          </Button>
        </CardFooter>
      </Card>

       {/* ------------------ Notification Settings ------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Write custom Markdown templates for email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-color-mode="light">
          <div className="flex items-center space-x-2">
            <Switch checked={notificationSettings.enabled} onCheckedChange={(checked)=>setNotificationSettings({...notificationSettings, enabled: checked})} id="enable-emails" />
            <Label htmlFor="enable-emails">Enable Email Notifications</Label>
          </div>

          {notificationSettings.enabled && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="email-host">SMTP HOST (eg. smtp.gmail.com)</Label>
                  <Input
                    id="email-host"
                    name="email-host"
                    value={notificationSettings.emailHost}
                    onChange={(e)=>setNotificationSettings({...notificationSettings, emailHost: e.target.value})}
                    placeholder="SMTP host"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-port">SMTP PORT (eg. 587)</Label>
                  <Input
                    id="email-port"
                    name="email-port"
                    type="number"
                    value={notificationSettings.emailPort ?? ''} // <-- use empty string if undefined
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailPort: Number(e.target.value),
                      })
                    }
                    placeholder="SMTP port"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-user">Email User (eg. provider@gmail.com)</Label>
                  <Input
                    id="email-user"
                    name="email-user"
                    value={notificationSettings.emailUser}
                    onChange={(e)=>setNotificationSettings({...notificationSettings, emailUser: e.target.value})}
                    placeholder="Email User"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-pass">Email Password</Label>
                  <Input
                    id="email-user"
                    type="password"
                    name="email-pass"
                    value={notificationSettings.emailPass}
                    onChange={(e)=>setNotificationSettings({...notificationSettings, emailPass: e.target.value})}
                    placeholder="Email Pass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Sender Name (eg. YourCompanyName)</Label>
                  <Input
                    id="email-user"
                    type="text"
                    name="sender-name"
                    value={notificationSettings.senderName}
                    onChange={(e)=>setNotificationSettings({...notificationSettings, senderName: e.target.value})}
                    placeholder="Sender Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-template">Invoice Reminder Email Template (Markdown)</Label>
                <p className="text-muted-foreground text-sm">
                  You can use the following placeholders in your email templates:{" "}
                  <code>{`{{clientName}}`}</code>, <code>{`{{invoiceNumber}}`}</code>,{" "}
                  <code>{`{{amount}}`}</code>, <code>{`{{paymentUrl}}`}</code> and <code>{`{{dueDate}}`}</code>.{" "}
                  These will automatically be replaced with real data when sending emails.{" "}
                </p>
                <div className="mt-2 border rounded-md overflow-hidden">
                  <MDEditor
                    value={notificationSettings.invoiceReminderTemplate}
                    onChange={(val) => setNotificationSettings({...notificationSettings, invoiceReminderTemplate: val || ""})}
                    height={200}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-template">Payment Confirmation Email Template (Markdown)</Label>
                <p className="text-muted-foreground text-sm">
                  You can use the following placeholders in your email templates:{" "}
                  <code>{`{{clientName}}`}</code>, <code>{`{{invoiceNumber}}`}</code>,{" "}
                  <code>{`{{amount}}`}</code>, <code>{`{{paymentDate}}`}</code>, <code>{`{{paymentMethod}}`}</code> and <code>{`{{receiptUrl}}`}</code>.{" "}
                  These will automatically be replaced with real data when sending emails.{" "}
                </p>
                <div className="mt-2 border rounded-md overflow-hidden">
                  <MDEditor
                    value={notificationSettings.paymentConfirmationTemplate}
                    onChange={(val) => setNotificationSettings({...notificationSettings, paymentConfirmationTemplate: val || ""})}
                    height={200}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overdue-template">Overdue Notice Email Template (Markdown)</Label>
                <p className="text-muted-foreground text-sm">
                  You can use the following placeholders in your email templates:{" "}
                  <code>{`{{clientName}}`}</code>, <code>{`{{invoiceNumber}}`}</code>,{" "}
                  <code>{`{{amount}}`}</code>, <code>{`{{paymentUrl}}`}</code> and <code>{`{{dueDate}}`}</code>.{" "}
                  These will automatically be replaced with real data when sending emails.{" "}
                </p>
                <div className="mt-2 border rounded-md overflow-hidden">
                  <MDEditor
                    value={notificationSettings.overdueNoticeTemplate}
                    onChange={(val) => setNotificationSettings({...notificationSettings, overdueNoticeTemplate: val || ""})}
                    height={200}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={loadingNotification} onClick={handleSavenotificationSettings}>{loadingNotification? "Saving..." : "Save Notification Settings"}</Button>
        </CardFooter>
      </Card>

      {/* ------------------ Invoice & Document Settings ------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice & Document Settings</CardTitle>
          <CardDescription>Customize invoice numbering, appearance, and tax rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prefix">Invoice Number Prefix</Label>
            <Input id="prefix" placeholder='e.g., "SNI-" for Sierra Networks Inc.'
              value={documentSettings.numberPrefix}
              onChange={(e)=>setDocumentSettings({...documentSettings, numberPrefix: e.target.value})}
            />
          </div>
{/* 
          <div>
            <Label htmlFor="start-num">Starting Invoice Number</Label>
            <Input id="start-num" type="number" placeholder="e.g., 1000"
              value={documentSettings.startingNumber}
              onChange={(e)=>setDocumentSettings({...documentSettings, startingNumber: Number(e.target.value)})}
            />
          </div> */}

          {/* <div className="flex items-center space-x-2">
            <Switch checked={documentSettings.includeTax} onCheckedChange={(checked)=>setDocumentSettings({...documentSettings, includeTax: checked})} id="include-tax" />
            <Label htmlFor="include-tax">Include Tax in Invoice</Label>
          </div> */}

          {/* {documentSettings.includeTax && (
            <div>
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" placeholder="e.g., 12"
                value={documentSettings.taxRate}
                onChange={(e)=>setDocumentSettings({...documentSettings, taxRate: Number(e.target.value)})}
              />
            </div>
          )} */}

          {/* <div className="space-y-2">
            <Label htmlFor="logo">Company Logo (URL). You can host a logo in <a href="https://cloudinary.com/" target="_blank" className="underline">Cloudinary</a></Label>
            <Input id="logo" type="url" value={documentSettings.companyLogoUrl}
              onChange={(e)=>setDocumentSettings({...documentSettings, companyLogoUrl: e.target.value})}
            placeholder="https://example.com/logo.png" />
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="footer">Footer Message</Label>
            <Textarea id="footer" placeholder='e.g., "Thank you for your business!"' />
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveDocumentsSettings} disabled={loadingDocumentSettings}>{loadingDocumentSettings? "" : "Save Document Settings"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SettingsCards

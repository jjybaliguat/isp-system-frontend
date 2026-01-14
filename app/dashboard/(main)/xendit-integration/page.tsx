"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { cn } from '@/lib/utils'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { setXendit } from '@/redux/authSlice'
import { useGetStoredKeyQuery, useSaveXenditIntegrationMutation, useTestXenditKeyMutation } from '@/redux/fetures/provider-api-slice'
import { useAppSelector } from '@/redux/store/store'
import { UserRole } from '@/types/users'
import Image from 'next/image'
import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const XENDIT_DEV_SETTINGS_URL = "https://dashboard.xendit.co/settings/developers#webhooks"
const XENDIT_IP_ALLOWLIST_URL = "https://dashboard.xendit.co/settings/developers#ip-allowlist"

interface XenditProps {
  apiKey: string | null,
  convenienceFee: number | null,
  expiration: number | null
}

const XenditIntegrationPage = () => {
  const { data, isLoading } = useGetStoredKeyQuery();
  const [saveXenditIntegration, {isLoading: submittting}] = useSaveXenditIntegrationMutation();
  const xenditFromStore = useAppSelector((state) => state.auth.xendit);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const token = useAppSelector((store)=>store.auth.accessToken)
  const [testing, setTesting] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const dispatch = useDispatch()
  const [xenditTest] = useTestXenditKeyMutation()

  const [formData, setFormData] = useState<XenditProps>({
    apiKey: '',
    convenienceFee: 15,
    expiration: 1
  })

  useEffect(() => {
    if (!isLoading && data) {
      setFormData({...data.xendit});
      dispatch(setXendit(data.xendit));
    } else if (xenditFromStore) {
      setFormData(xenditFromStore);
      dispatch(setXendit(xenditFromStore));
    }
  }, [isLoading, data, xenditFromStore]);
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await saveXenditIntegration(formData).unwrap()

      toast("Success", {
        description: "Api Key stored securely"
      })
      setFormData(data)
      dispatch(setXendit(data))
      setIsEditingKey(false)
    } catch (error) {
      console.log(error)
      toast("Success", {
        description: "Something went wrong, please try again"
      })
    }
  }

  const handleTestConnection = async() => {
    setTesting(true)
    try {
      const response = await xenditTest().unwrap()
      setConnectionStatus(response.message)
      setTesting(false)
    } catch (error: any) {
      setConnectionStatus(error.data.message)
      console.log(error)
      setTesting(false)
    }
  }

  const handleCancel = () => {
    setIsEditingKey(false)
    setFormData({...xenditFromStore})
  }


  if(isLoading) return (
    <Card className='max-w-[500px]'>
      <CardHeader>
          <CardTitle>Xendit Api Key</CardTitle>
          <CardDescription>Configure your xendit api key</CardDescription>
          <CardDescription>Note: Your Api Key is encrypted first before storing in the database</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-10 w-80" />
        </CardContent>
    </Card>
  )

  return (
    <PageWrapper
        pageName='Xendit Integration'
        description='Integrate Xendit for secure and efficient payment processing.'
        icon={
            <Image
                src="/images/xendit-logo.png"
                alt='xendit-logo'
                height={30}
                width={30}
            />
        }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <Card className='max-w-[500px]'>
            <CardHeader>
              <CardTitle>Xendit Api Key</CardTitle>
              <CardDescription>Configure your xendit api key</CardDescription>
              <CardDescription>Note: Your Api Key is encrypted first before storing in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='apiKey'>Api Key</Label>
                    <Input
                      placeholder='enter your xendit api key'
                      id='apiKey'
                      value={formData.apiKey || ''}
                      type='password'
                      onChange={(e)=>setFormData({...formData, apiKey: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor='convenienceFee'>Convenience Fee</Label>
                    <Input
                      id='convenienceFee'
                      type='number'
                      step='any'
                      placeholder='enter e-payment convenience fee'
                      value={formData.convenienceFee ?? 0}
                      onChange={(e)=>setFormData({...formData, convenienceFee: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor='expiration'>Expiration (Days)</Label>
                    <Input
                      id='expiration'
                      type='number'
                      step='any'
                      placeholder='invoice expiration days'
                      value={formData.expiration || 0}
                      onChange={(e)=>setFormData({...formData, expiration: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                  {xenditFromStore && !isEditingKey ? (
                    <div className="flex items-center gap-3">
                      <Button type='button' variant="outline" onClick={(e) => {e.preventDefault(); setIsEditingKey(true); setFormData({...formData, apiKey: ''})}}>Change</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button type='submit' disabled={submittting}>{submittting? "Saving..." : "Save"}</Button>
                      {xenditFromStore &&<Button type='button' variant="outline" onClick={handleCancel}>Cancel</Button>}
                    </div>
                  )}
                </div>
              </form>
              {data?.xendit && data?.xendit.apiKey !== "" &&
                <div className='mt-2 space-y-2'>
                  <Button variant="outline" onClick={handleTestConnection} disabled={testing}>{testing? "Testing..." : "Test Connection"}</Button>
                  {connectionStatus && <p
                    className={cn({
                      "font-medium text-green-500": true,
                      "text-destructive": connectionStatus.includes("Failed") || connectionStatus.includes("Too many login attempts") || connectionStatus.includes("invalid") || connectionStatus.includes("rejected"),
                    })}
                  >{connectionStatus}</p>}
                </div>
              }
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices Paid Callback</CardTitle>
              <CardDescription>
                Configure webhook notifications when an invoice is successfully paid.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* EVENT */}
              <div className="space-y-2">
                <Label>Event</Label>

                <div className="flex items-center gap-2">
                  <code className="rounded-md bg-muted px-3 py-1.5 text-sm font-mono">
                    invoice.paid
                  </code>
                </div>

                <p className="text-xs text-muted-foreground">
                  Triggered when an invoice payment is successfully completed.
                </p>
              </div>

              {/* CALLBACK URL */}
              <div className="space-y-2">
                <Label>Callback URL</Label>

                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://api.sierracommunication.net/api/payments/xendit/pay-invoice"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "https://api.sierracommunication.net/api/payments/xendit/pay-invoice"
                      )
                    }
                  >
                    Copy
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Paste this into <b>Xendit → Developer Settings → Webhooks → invoices.paid</b>
                </p>
              </div>

              {/* SETTINGS LINK */}
              <Button asChild className="w-full">
                <a
                  href={XENDIT_DEV_SETTINGS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Xendit Developer Webhook Settings
                </a>
              </Button>

            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Whitelist IP Address</CardTitle>
              <CardDescription>
                Allow Xendit servers to securely send callbacks to your API.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Required Action</Label>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                    Security
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  To ensure webhook delivery, whitelist the following IP address in your
                  Xendit dashboard IP Allowlist.
                </p>

                <div className="flex items-center gap-2">
                  <code className="rounded-md bg-background px-3 py-2 text-sm font-mono">
                    72.61.118.79
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText("72.61.118.79")}
                  >
                    Copy
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Go to <b>Xendit → Developer Settings → IP Allowlist</b>
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={XENDIT_IP_ALLOWLIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Xendit IP Allowlist Settings
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </PageWrapper>
  )
}

export default withRoleGuard(XenditIntegrationPage, {roles: [UserRole.SUPERADMIN]})
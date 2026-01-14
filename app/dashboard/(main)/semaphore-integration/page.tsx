"use client"

import PageWrapper from '@/components/wrapper/page-wrapper'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppSelector } from '@/redux/store/store'
import { SmsIntegrationSettingsInput, useGetSmsSettingsQuery, useGetStoredKeyQuery, useSaveSmsintegrationSettingsMutation, useStoreSemaphoreApiKeyMutation, useTestSmsKeyMutation } from '@/redux/fetures/provider-api-slice'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setSemaphoreKey } from '@/redux/authSlice'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Car, Check, ChevronsUpDown, Loader2, SendIcon } from 'lucide-react'
import { useGetClientsQuery, useGetPhoneNumbersMutation } from '@/redux/fetures/clientApiSlice'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SmsTableWrapper } from '@/components/wrapper/sms-table-wrapper'
import { useSendSmsMutation } from '@/redux/fetures/sms-api-slice'
import { chunkRecipients } from '@/helpers/chunkRecipients'
import { withRoleGuard } from '@/lib/withRoleGuard'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetCoverageQuery } from '@/redux/fetures/converage-api-slice'
import { IconArrowRight } from '@tabler/icons-react'
import { Checkbox } from '@/components/ui/checkbox'
import SmsTemplateDrawer from '@/components/drawers/SmsTemplateDrawer'
import { UserRole } from '@/types/users'

interface smsDataProps {
  recipients: string
  message: string
}

export interface SmsSettingsProps {
  sendWhenBillIsMade: boolean
  sendWhenBillIsDue: boolean
  sendWhenPaymentIsMade: boolean
  sendWhenCustomerAdded: boolean
  sendDaysBeforeDue: {
    enabled: boolean
    daysBefore: number
  }
}

const SemaphoreIntegrationPage = () => {
  const { data, isLoading } = useGetStoredKeyQuery();
  const {data: smsSettingsData, isLoading: isSmsSettingsLoading} = useGetSmsSettingsQuery();
  const [sendSms, {isLoading: sendingSms}] = useSendSmsMutation()
  const [getPhoneNumbers] = useGetPhoneNumbersMutation()
  const [saveSmsintegrationSettings] = useSaveSmsintegrationSettingsMutation()
  const [storeKey, {isLoading: submittting}] = useStoreSemaphoreApiKeyMutation();
  const semaphoreKeyFromStore = useAppSelector((state) => state.auth.semaphoreKey);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const token = useAppSelector((store)=>store.auth.accessToken)
  const [testing, setTesting] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const dispatch = useDispatch()
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [testSmsKey] = useTestSmsKeyMutation()

  const { data: clients, isLoading: isFetchingClients } = useGetClientsQuery({
      search: debouncedSearch
    })
  const {data: coverageArea} = useGetCoverageQuery()
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filteredArea, setFilteredArea] = useState("")

  const [openSmsTemplateDrawer, setOpenSmsTemplateDrawer] = useState(false)
  const [smsSettings, setSmsSettings] = useState<SmsSettingsProps>({
    sendWhenBillIsMade: smsSettingsData?.sendWhenBillIsMade || false,
    sendWhenBillIsDue: smsSettingsData?.sendWhenBillIsDue || false,
    sendWhenPaymentIsMade: smsSettingsData?.sendWhenPaymentIsMade || false,
    sendWhenCustomerAdded: smsSettingsData?.sendWhenCustomerAdded || false,
    sendDaysBeforeDue: {
      enabled: smsSettingsData?.sendDaysBeforeDueEnabled || false,
      daysBefore: smsSettingsData?.sendDaysBeforeDueDays || 2
    }
  })

  const clientsData = clients?.data || []

  useEffect(() => {
    if (!isSmsSettingsLoading && smsSettingsData) {
      setSmsSettings({
        sendWhenBillIsMade: smsSettingsData?.sendWhenBillIsMade || false,
        sendWhenBillIsDue: smsSettingsData?.sendWhenBillIsDue || false,
        sendWhenPaymentIsMade: smsSettingsData?.sendWhenPaymentIsMade || false,
        sendWhenCustomerAdded: smsSettingsData?.sendWhenCustomerAdded || false,
        sendDaysBeforeDue: {
          enabled: smsSettingsData?.sendDaysBeforeDueEnabled || false,
          daysBefore: smsSettingsData?.sendDaysBeforeDueDays || 2
        }
      })
    }
  }, [isSmsSettingsLoading, smsSettingsData])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, 500) // delay in ms

    return () => clearTimeout(handler)
  }, [searchValue])

  const [smsData, setSmsData] = useState<smsDataProps>({
    recipients: "",
    message: ""
  })

  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
      if (!isLoading && data?.semaphoreApiKey) {
        setApiKey(data.semaphoreApiKey);
        dispatch(setSemaphoreKey({semaphoreKey: data.semaphoreApiKey}));
      } else if (semaphoreKeyFromStore) {
        setApiKey(semaphoreKeyFromStore);
        dispatch(setSemaphoreKey({semaphoreKey: semaphoreKeyFromStore}));
      }
    }, [isLoading, data, semaphoreKeyFromStore]);

  const handleSubmit = async() => {
    try {
        const data = await storeKey({key: apiKey}).unwrap()

        toast("Success", {
          description: "Api Key stored securely"
        })
        setApiKey(data)
        dispatch(setSemaphoreKey(data))
        window.location.reload()
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
      const response = await testSmsKey().unwrap()

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
    setApiKey(semaphoreKeyFromStore!)
  }

  const handleSendSMS = async(e: React.FormEvent) => {
    e.preventDefault()
    const chunks = chunkRecipients(smsData.recipients);
    for (const chunk of chunks) {
      try {
        await sendSms({message: smsData.message, recipients: chunk}).unwrap()
      } catch (error: any) {
        console.log(error)
        toast("Error", {
          description: error.data.message
        })
      }
    }
    toast("Success", {
      description: "Message Sent!"
    })
    setSmsData({
      recipients: '',
      message: ''
    })
  }

  const handleCopyNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number)
      toast("Copied", {
        description: `Number ${number} has been copied to clipboard.`,
      })
    } catch {
      toast("Error", {
        description: "Failed to copy the number."
      })
    }
  }

  const handleGetClientsPhoneNumbers = async() => {
    try {
      const response: any = await getPhoneNumbers({coverageId: filteredArea}).unwrap()
      console.log(response)
      setSmsData({...smsData, recipients: response?.join(", ")})
      toast("Success", {
        description: "Clients phone numbers are populated"
      })
    } catch (error) {
      toast("Error", {
          description: "Error in getting clients phone numbers"
        })
      console.log(error)
    }
  }

  useEffect(()=> {
    if(filteredArea !== ""){
      handleGetClientsPhoneNumbers()
    }
  }, [filteredArea])

    if(isLoading) return (
      <Card className='max-w-[500px]'>
        <CardHeader>
            <CardTitle>Semaphore Api Key</CardTitle>
            <CardDescription>Configure your semaphore api key</CardDescription>
            <CardDescription>Note: Your Api Key is encrypted first before storing in the database</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-10 w-80" />
          </CardContent>
      </Card>
    )

    const handleSaveSettings = async() => {
      try {
        await saveSmsintegrationSettings(smsSettings).unwrap()
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
    <PageWrapper
        pageName='Semaphore Sms Integration'
        description='Configure API keys, send alerts, and monitor your SMS campaigns.'
    >
        <div className='flex flex-col gap-4 lg:flex-row'>
            <Card className='max-w-[500px] flex-1'>
              <CardHeader>
                <CardTitle>Semaphore Api Key</CardTitle>
                <CardDescription>Configure your semaphore api key</CardDescription>
                <CardDescription>Note: Your Api Key is encrypted first before storing in the database</CardDescription>
                <CardDescription>Do&apos;t have semaphore account? Sign-up 
                  <span className='flex items-center gap-2'><IconArrowRight className='h-3 w-3' /> 
                  <a href='https://semaphore.co/' target='_blank' className='underline'>https://semaphore.co/</a></span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='apiKey'>Api Key</Label>
                      <Input
                        placeholder='enter your semaphore api key'
                        id='apiKey'
                        value={apiKey ?? ""}
                        type='password'
                        onChange={(e)=>setApiKey(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                    {semaphoreKeyFromStore && !isEditingKey ? (
                      <div className="flex items-center gap-3">
                        <Button type='button' variant="outline" onClick={(e) => {e.preventDefault(); setIsEditingKey(true); setApiKey('')}}>Change</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Button type='submit' disabled={submittting}>{submittting? "Saving..." : "Save"}</Button>
                        {semaphoreKeyFromStore && <Button type='button' variant="outline" onClick={handleCancel}>Cancel</Button>}
                      </div>
                    )}
                  </div>
                </form>
                {data?.semaphoreApiKey && data?.semaphoreApiKey !== "" &&
                  <div className='mt-2 space-y-2'>
                    <Button variant="outline" onClick={handleTestConnection} disabled={testing}>{testing? "Testing..." : "Test Connection"}</Button>
                    {connectionStatus && <p
                      className={cn({
                        "font-medium text-green-500": true,
                        "text-destructive": connectionStatus.toLocaleLowerCase().includes("Failed") || connectionStatus.toLocaleLowerCase().includes("Too many login attempts") || connectionStatus.toLocaleLowerCase().includes("invalid") || connectionStatus.toLocaleLowerCase().includes("missing") || connectionStatus.toLocaleLowerCase().includes("unauthorize"),
                      })}
                    >{connectionStatus}</p>}
                  </div>
                }
              </CardContent>
            </Card>
            {semaphoreKeyFromStore && (
              <>
              
              <Card className='max-w-[500px] flex-1'>
              <CardHeader>
                <CardTitle>Send SMS</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className='py-4 space-y-2'>
                  <Button type="button" variant="outline" size="sm"
                    onClick={handleGetClientsPhoneNumbers}
                  >Get client's Phone Numbers</Button>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between bg-transparent"
                      >
                        {"Search client..."}
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

                        {!isFetchingClients && (!clientsData || clientsData.length === 0) && (
                          <div className="p-4 text-center text-muted-foreground">
                            No client found.
                          </div>
                        )}

                        {!isFetchingClients && clientsData?.length > 0 && (
                          <ul className="p-2">
                            {clientsData.map(client => (
                              <li key={client.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className={cn(
                                        "w-full text-left hover:bg-primary/10 flex items-center gap-3 rounded-md py-1 px-2"
                                      )}
                                      onClick={() => {
                                        handleCopyNumber(client.phoneNumber)
                                        setComboboxOpen(false)
                                      }}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium">{client.fullName}</span>
                                        <span className="text-xs text-muted-foreground">{client.phoneNumber}</span>
                                      </div>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy Number</p>
                                  </TooltipContent>
                                </Tooltip>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className='flex gap-2 items-center'>
                    <p>Filter By Area: </p>
                    <Select value={filteredArea} onValueChange={setFilteredArea}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Target Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Coverage Area</SelectLabel>
                          {coverageArea?.length == 0 && <p>No Data</p>}
                          {coverageArea?.map((area)=> (
                            <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" size="sm" onClick={()=>setFilteredArea("")}>Clear</Button>
                  </div>
                </div>
                <form onSubmit={handleSendSMS} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='recipients'>Recipients</Label>
                    <Input
                      id='recipients'
                      placeholder='separate phone by comma for bulk sms'
                      value={smsData.recipients}
                      onChange={(e)=>setSmsData({...smsData, recipients: e.target.value})}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message</Label>
                    <Textarea
                      id='message'
                      name='message'
                      placeholder='Type your message here'
                      value={smsData.message}
                      onChange={(e)=>setSmsData({...smsData, message: e.target.value})}
                      required
                    />
                  </div>
                  <div className='flex justify-end'>
                    <Button type='submit' disabled={sendingSms}>{sendingSms? "Sending..." : "Send"} <SendIcon /></Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className='max-w-[500px] flex-1'>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='settings-1'
                      checked={smsSettings.sendWhenBillIsMade}
                      onCheckedChange={(checked) => setSmsSettings({...smsSettings, sendWhenBillIsMade: checked as boolean})}
                    />
                    <Label htmlFor='settings-1' className='font-medium'>Send when the bill is made</Label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='settings-2'
                      checked={smsSettings.sendWhenBillIsDue}
                      onCheckedChange={(checked) => setSmsSettings({...smsSettings, sendWhenBillIsDue: checked as boolean})}
                    />
                    <Label htmlFor='settings-2' className='font-medium'>Send when the bill is due</Label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='settings-3'
                      checked={smsSettings.sendWhenPaymentIsMade}
                      onCheckedChange={(checked) => setSmsSettings({...smsSettings, sendWhenPaymentIsMade: checked as boolean})}
                    />
                    <Label htmlFor='settings-3' className='font-medium'>Send when the payment is made</Label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='settings-4'
                      checked={smsSettings.sendWhenCustomerAdded}
                      onCheckedChange={(checked) => setSmsSettings({...smsSettings, sendWhenCustomerAdded: checked as boolean})}
                    />
                    <Label htmlFor='settings-4' className='font-medium'>Send when the customer is added</Label>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        id='settings-5'
                        checked={smsSettings.sendDaysBeforeDue.enabled}
                        onCheckedChange={(checked) => setSmsSettings({...smsSettings, sendDaysBeforeDue: {...smsSettings.sendDaysBeforeDue, enabled: checked as boolean}})}
                      />
                      <Label htmlFor='settings-5' className='font-medium'>Send days before due date</Label>
                    </div>
                    {smsSettings.sendDaysBeforeDue.enabled && <div className='space-y-2'>
                      <Label htmlFor='settings-5-days' className='mr-2'>Days before due:</Label>
                      <Input
                        id='settings-5-days'
                        type='number'
                        placeholder='Send sms days before due'
                        min={1}
                        value={smsSettings.sendDaysBeforeDue.daysBefore}
                        onChange={(e) => setSmsSettings({...smsSettings, sendDaysBeforeDue: {...smsSettings.sendDaysBeforeDue, daysBefore: parseInt(e.target.value) || 0}})}
                      />
                    </div>}
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-4'>
                  <Button variant="outline" onClick={()=>setOpenSmsTemplateDrawer(true)}>Edit SMS Templates</Button>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
            </>
            )}
        </div>
        {openSmsTemplateDrawer && <SmsTemplateDrawer open={openSmsTemplateDrawer} onOpenChange={setOpenSmsTemplateDrawer} />}
        {semaphoreKeyFromStore && <div className='mt-4 space-y-2'>
          <h1 className='font-medium text-xl'>Message Logs</h1>
          <SmsTableWrapper />
        </div>}
    </PageWrapper>
  )
}

export default withRoleGuard(SemaphoreIntegrationPage, {roles: [UserRole.SUPERADMIN]})
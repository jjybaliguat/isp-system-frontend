"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { cn } from '@/lib/utils'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { setXenditKey } from '@/redux/authSlice'
import { useGetStoredKeyQuery, useStoreXenditApiKeyMutation, useTestXenditKeyMutation } from '@/redux/fetures/provider-api-slice'
import { useAppSelector } from '@/redux/store/store'
import { UserRole } from '@/types/users'
import Image from 'next/image'
import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'


const XenditIntegrationPage = () => {
  const { data, isLoading } = useGetStoredKeyQuery();
  const [storeKey, {isLoading: submittting}] = useStoreXenditApiKeyMutation();
  const xenditKeyFromStore = useAppSelector((state) => state.auth.xenditKey);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const token = useAppSelector((store)=>store.auth.accessToken)
  const [testing, setTesting] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const dispatch = useDispatch()
  const [xenditTest] = useTestXenditKeyMutation()

  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (!isLoading && data?.xenditApiKey) {
      setApiKey(data.xenditApiKey);
      dispatch(setXenditKey({xenditKey: data.xenditApiKey}));
    } else if (xenditKeyFromStore) {
      setApiKey(xenditKeyFromStore);
      dispatch(setXenditKey({xenditKey: xenditKeyFromStore}));
    }
  }, [isLoading, data, xenditKeyFromStore]);
  
  const handleSubmit = async() => {
    try {
      const data = await storeKey({key: apiKey}).unwrap()

      toast("Success", {
        description: "Api Key stored securely"
      })
      setApiKey(data)
      dispatch(setXenditKey(data))
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
    setApiKey(xenditKeyFromStore!)
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
                    value={apiKey}
                    type='password'
                    onChange={(e)=>setApiKey(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end mt-4 gap-2">
                 {xenditKeyFromStore && !isEditingKey ? (
                  <div className="flex items-center gap-3">
                    <Button type='button' variant="outline" onClick={(e) => {e.preventDefault(); setIsEditingKey(true); setApiKey('')}}>Change</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button type='submit' disabled={submittting}>{submittting? "Saving..." : "Save"}</Button>
                    {xenditKeyFromStore &&<Button type='button' variant="outline" onClick={handleCancel}>Cancel</Button>}
                  </div>
                )}
              </div>
            </form>
            {data?.xenditApiKey && data?.xenditApiKey !== "" &&
              <div className='mt-2 space-y-2'>
                <Button variant="outline" onClick={handleTestConnection} disabled={testing}>{testing? "Testing..." : "Test Connection"}</Button>
                {connectionStatus && <p
                  className={cn({
                    "font-medium text-green-500": true,
                    "text-destructive": connectionStatus.includes("Failed") || connectionStatus.includes("Too many login attempts") || connectionStatus.includes("invalid"),
                  })}
                >{connectionStatus}</p>}
              </div>
            }
          </CardContent>
        </Card>
    </PageWrapper>
  )
}

export default withRoleGuard(XenditIntegrationPage, {roles: [UserRole.SUPERADMIN]})
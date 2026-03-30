"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { UserRole } from '@/types/users'
import { IconArrowRight } from '@tabler/icons-react'
import { TelegramNotificationType, useGetTelegramIntegrationQuery, useSaveTelegramIntegrationMutation, useTestTelegramNotifMutation } from '@/redux/fetures/provider-api-slice'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

const TelegramIntegration = () => {
    const [saveTelegramIntegration, {isLoading: isSavingTelegramIntegration}] = useSaveTelegramIntegrationMutation()
    const [testTelegramNotif, {isLoading: sendingTest}] = useTestTelegramNotifMutation()

    const {data: telegramSettings} = useGetTelegramIntegrationQuery()

    const [paymentNotifSettings, setPaymentNotifSettings] = useState({
        enabled: false,
        type: TelegramNotificationType.PAYMENT,
        botToken: '',
        chatId: ''
    })

    useEffect(()=> {
        if(telegramSettings) {
            const paymentSettings = telegramSettings.find(setting => setting.type === TelegramNotificationType.PAYMENT)
            if(paymentSettings) {
                setPaymentNotifSettings(paymentSettings)
            }
        }
    }, [telegramSettings])

    const handleSavePaymentNotifSettings = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await saveTelegramIntegration(paymentNotifSettings).unwrap()
            toast.success('Telegram Integration Settings saved successfully!')
        } catch (error) {
            console.error('Error saving Telegram Integration Settings:', error)
            toast.error('Failed to save Telegram Integration Settings. Please try again.')
        }
    }

    const handleTestNotification = async (type: TelegramNotificationType) => {
        try {
            const response = await testTelegramNotif({type}).unwrap()
            if(response.success) {
                toast.success('Test notification sent successfully! Please check your Telegram.')
            } else {
                toast.error('Failed to send test notification. Please check your settings and try again.')
            }
        } catch (error: any) {
            console.error('Error testing Telegram notification:', error)
            toast.error(error.data?.message || 'An error occurred while testing the notification. Please try again.')
        }
    }

  return (
    <PageWrapper pageName='Telegram Integration' description='Enable telegram notifications'>
        <Card className='max-w-[500px] flex-1'>
            <CardHeader>
                <CardTitle className='text-xl'>Telegram settings for Payment Proof Notification</CardTitle>
                <CardDescription>This is for configuring telegram notifications for payment proof verification</CardDescription>
                <CardDescription>How to setup your telegram bot for payment proof notification? 
                  <span className='flex items-center gap-2'><IconArrowRight className='h-3 w-3' /> 
                  <a href='https://youtu.be/v3RIqvuCTTY' target='_blank' className='underline'>Telegram Tutorial</a></span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSavePaymentNotifSettings} className='space-y-6'>
                    <div className='flex items-center space-x-2'>
                        <Switch
                            id='telegramNotification'
                            checked={paymentNotifSettings.enabled}
                            onCheckedChange={(checked) => setPaymentNotifSettings({...paymentNotifSettings, enabled: checked})}
                        />
                        <Label htmlFor='telegramNotification'>Enable Telegram Notification</Label>
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='telegramBotToken'>Telegram Bot Token</Label>
                        <Input
                          placeholder='enter your telegram bot token'
                          id='telegramBotToken'
                          type='text'
                          required
                          value={paymentNotifSettings.botToken}
                          onChange={(e) => setPaymentNotifSettings({...paymentNotifSettings, botToken: e.target.value})}
                          autoComplete="off"
                          disabled={!paymentNotifSettings.enabled}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='telegramChatId'>Telegram Chat ID</Label>
                        <Input
                          placeholder='enter your telegram chat ID'
                          id='telegramChatId'
                          type='text'
                          required
                          value={paymentNotifSettings.chatId}
                          onChange={(e) => setPaymentNotifSettings({...paymentNotifSettings, chatId: e.target.value})}
                          autoComplete="off"
                          disabled={!paymentNotifSettings.enabled}
                        />
                    </div>
                    <div className='flex gap-2 items-center justify-end'>
                        <Button 
                        onClick={() => handleTestNotification(TelegramNotificationType.PAYMENT)}
                        type='button' variant='outline' disabled={!(paymentNotifSettings.botToken && paymentNotifSettings.chatId) || isSavingTelegramIntegration || sendingTest}>
                            {sendingTest ? 'Sending...' : 'Test Notification'}
                        </Button>
                        <Button type='submit' disabled={!(paymentNotifSettings.botToken && paymentNotifSettings.chatId) || isSavingTelegramIntegration}>
                            {isSavingTelegramIntegration ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </PageWrapper>
  )
}

export default withRoleGuard(TelegramIntegration, {roles: [UserRole.SUPERADMIN]})
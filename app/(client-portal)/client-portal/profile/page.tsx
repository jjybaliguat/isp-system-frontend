"use client"

import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppSelector } from '@/redux/store/store'
import { useChangePasswordMutation } from '@/redux/fetures/users-api-slice'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, Mail, User } from 'lucide-react'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

const ProfilePage = () => {
  const user = useAppSelector((store) => store.auth)
  const [changePassword, { isLoading: loadingChangePass }] = useChangePasswordMutation()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: ChangePasswordForm) => {
    setSubmitting(true)
    try {
      await changePassword({ id: user.id!, data: { currentPassword: values.currentPassword, newPassword: values.newPassword } }).unwrap()
      toast.success('Password updated successfully')
      form.reset()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account and security</p>
        </header>

        <Card className="rounded-xl mb-4">
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg font-bold">{user.fullName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{user.fullName || 'N/A'}</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
                <Badge>{user.role || 'User'}</Badge>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
            <CardDescription className="text-sm">Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((name, idx) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof ChangePasswordForm}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          {name === 'currentPassword' ? 'Current Password' : name === 'newPassword' ? 'New Password' : 'Confirm Password'}
                        </FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={name === 'currentPassword' ? 'Enter current password' : name === 'newPassword' ? 'Enter new password' : 'Confirm new password'} disabled={loadingChangePass || submitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loadingChangePass || submitting}>
                    {loadingChangePass || submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loadingChangePass || submitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
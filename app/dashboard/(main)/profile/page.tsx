"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import PageWrapper from '@/components/wrapper/page-wrapper'
import { useGetProviderQuery } from '@/redux/fetures/provider-api-slice'
import { useAppSelector } from '@/redux/store/store'
import { UserRole } from '@/types/users'
import { IconImageInPicture, IconLink, IconMap, IconPencil, IconPhone } from '@tabler/icons-react'
import { Component, Loader2, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import EditProfileDialog from '@/components/dialogs/edit-profile-dialog'
import Image from 'next/image'
import { useChangePasswordMutation } from '@/redux/fetures/users-api-slice'

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
  const [changePassword, {isLoading: loadingChangePass}] = useChangePasswordMutation()
  const { data: companyInfo, isLoading: loadingCompanyInfo } = useGetProviderQuery()
  const [openEditProfile, setOpenEditProfile] = useState(false)

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case UserRole.SUPERADMIN:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case UserRole.ADMIN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case UserRole.INSTALLER_TECHNICIAN:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword({id: user.id!, data}).unwrap()

      toast.success("Password updated successfully")
      form.reset()
    } catch (error: any) {
      toast.error(`Error: ${error.data.message}`)
    }
  }

  return (
    <PageWrapper pageName='Profile Page'>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Account Information</CardTitle>
              <CardDescription className="text-sm">View your personal and company details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 gap-2 text-center sm:text-left">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-bold">
                    {user.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user?.fullName || "N/A"}</h3>
                  <Badge className={`mt-2 ${getRoleColor(user?.role!)}`}>{user?.role || "N/A"}</Badge>
                </div>
              </div>

              {/* Info Fields */}
              <div className="space-y-4 text-sm sm:text-base">
                {[
                  { icon: <Mail className="h-5 w-5 text-muted-foreground" />, label: "Email", value: user?.email },
                  { icon: <User className="h-5 w-5 text-muted-foreground" />, label: "Role", value: user?.role?.toLowerCase() },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    {item.icon}
                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">{item.label}</p>
                      <p className="font-medium">{item.value || "N/A"}</p>
                    </div>
                  </div>
                ))}

                {/* Company Info (for SUPERADMIN) */}
                {loadingCompanyInfo && (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg bg-muted p-3 animate-pulse"
                      >
                        <div className="h-5 w-5 rounded-full bg-muted-foreground/20" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-1/3 rounded bg-muted-foreground/20" />
                          <div className="h-4 w-2/3 rounded bg-muted-foreground/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {user.role === UserRole.SUPERADMIN && companyInfo && (
                  <>
                    {[
                      { icon: <Component className="h-5 w-5 text-muted-foreground" />, label: "Company Name", value: companyInfo.companyName },
                      { icon: <Component className="h-5 w-5 text-muted-foreground" />, label: "Company Email", value: companyInfo.email },
                      { icon: <IconMap className="h-5 w-5 text-muted-foreground" />, label: "Address", value: companyInfo.companyAddress },
                      { icon: <IconPhone className="h-5 w-5 text-muted-foreground" />, label: "Phone", value: companyInfo.phoneNumber },
                    ].map((info, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                        {info.icon}
                        <div className="overflow-hidden">
                          <p className="text-xs text-muted-foreground sm:text-sm">{info.label}</p>
                          <p className="font-medium truncate">{info.value || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <IconImageInPicture className="h-5 w-5 text-muted-foreground" />
                      <div className="overflow-hidden">
                        <p className="text-xs text-muted-foreground sm:text-sm">Company Logo</p>
                        <Image
                          src={companyInfo.companyLogoUrl!}
                          alt='Company Logo'
                          height={100}
                          width={100}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button size="sm" className="flex items-center gap-2"
                    onClick={()=>setOpenEditProfile(true)}
                  >
                    <IconPencil className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Change Password</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {["currentPassword", "newPassword", "confirmPassword"].map((fieldName, i) => (
                    <FormField
                      key={i}
                      control={form.control}
                      name={fieldName as keyof ChangePasswordForm}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            {fieldName === "currentPassword"
                              ? "Current Password"
                              : fieldName === "newPassword"
                              ? "New Password"
                              : "Confirm Password"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={`Enter your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                              disabled={loadingChangePass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button type="submit" disabled={loadingChangePass} className="w-full sm:w-auto">
                    {loadingChangePass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loadingChangePass ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <EditProfileDialog 
        open={openEditProfile} 
        onOpenChange={setOpenEditProfile} 
        profileData={{
          userId: user.id!,
          fullName: user.fullName!,
          email: user.email!,
          role: user.role!,
          companyEmail: companyInfo?.email!,
          companyName: companyInfo?.companyName!,
          companyAddress: companyInfo?.companyAddress!,
          phoneNumber: companyInfo?.phoneNumber!,
          companyLogoUrl: companyInfo?.companyLogoUrl!
        }}
      />
    </PageWrapper>
  )
}

export default ProfilePage

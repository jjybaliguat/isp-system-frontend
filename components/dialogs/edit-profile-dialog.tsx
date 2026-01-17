import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProfileDataSchema, useUpdateAccountMutation } from '@/redux/fetures/provider-api-slice';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { updateUserField } from '@/redux/authSlice';
import Link from 'next/link';
import { UserRole } from '@/types/users';

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void,
    profileData: ProfileDataSchema
}

const EditProfileDialog = ({
    open,
    onOpenChange,
    profileData
} : DialogProps) => {
    const [updateAccount, {isLoading: loadingUpdate}] = useUpdateAccountMutation()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState<ProfileDataSchema>({
        userId: profileData.userId,
        fullName: profileData.fullName,
        email: profileData.email,
        companyEmail: profileData.companyEmail,
        companyName: profileData.companyName,
        companyAddress: profileData.companyAddress,
        phoneNumber: profileData.phoneNumber
    })

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await updateAccount(formData).unwrap()
            dispatch(updateUserField({fullName: response.fullName, email: response.email}))
            onOpenChange(false)
            toast.success("Account updated successfully")
        } catch (error) {
            console.log(error)
            toast.error("Error while updating account")
        }
    }

    useEffect(()=>{
        setFormData({
            userId: profileData.userId,
            fullName: profileData.fullName,
            email: profileData.email,
            companyEmail: profileData.companyEmail,
            companyName: profileData.companyName,
            companyAddress: profileData.companyAddress,
            phoneNumber: profileData.phoneNumber
        })
    }, [profileData])

  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
       <DialogContent
            className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[500px] 
            p-4 sm:p-6 rounded-xl"
        >
            <DialogHeader>
                <DialogTitle>Edit Account</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor='fullName'>FullName</Label>
                    <Input
                        id='fullName'
                        value={formData.fullName}
                        onChange={(e)=>setFormData({...formData, fullName: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='email'>Login Email</Label>
                    <Input
                        id='email'
                        value={formData.email}
                        type='email'
                        onChange={(e)=>setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                {profileData.role === UserRole.SUPERADMIN && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor='companyName'>CompanyName</Label>
                            <Input
                                id='companyName'
                                value={formData.companyName}
                                onChange={(e)=>setFormData({...formData, companyName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='companyEmail'>Company Email</Label>
                            <Input
                                id='companyEmail'
                                value={formData.companyEmail}
                                onChange={(e)=>setFormData({...formData, companyEmail: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='companyAddress'>Company Address</Label>
                            <Input
                                id='companyAddress'
                                value={formData.companyAddress}
                                onChange={(e)=>setFormData({...formData, companyAddress: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='phoneNumber'>Phone Number</Label>
                            <Input
                                id='phoneNumber'
                                value={formData.phoneNumber}
                                onChange={(e)=>setFormData({...formData, phoneNumber: e.target.value})}
                                required
                            />
                        </div>
                    </>
                )}
                <div className='flex justify-end'>
                    <Button type='submit' disabled={loadingUpdate}>{loadingUpdate? "Saving..." : "Save"}</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
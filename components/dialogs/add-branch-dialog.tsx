"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ProviderCreateInput, useCreateProviderMutation } from '@/redux/fetures/provider-api-slice'
import { toast } from 'sonner'

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddBranchDialog = ({open, onOpenChange} : AddClientDialogProps) => {
  const [createProvider, {isLoading: creating}] = useCreateProviderMutation()
  const [formData, setFormData] = useState<ProviderCreateInput>({
    name: "",
    companyName: "",
    companyAddress: "",
    email: "",
    phoneNumber: ""
  })

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProvider(formData).unwrap()
      toast.success("Branch created successfully")
      onOpenChange(false)
    } catch (error: any) {
      toast.error(`Failed creating branch : ${error.data.message}`)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
            className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[600px] 
            p-4 sm:p-6 rounded-xl"
        >
            <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogDescription>
                    Fill in the branch information below to add a new branch to your system.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className="space-y-2">
                <Label htmlFor='branchName'>Branch Name</Label>
                <Input
                  id='branchName'
                  name='branchName'
                  placeholder='branch name'
                  value={formData.name}
                  onChange={(e)=>setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor='companyName'>Company Name</Label>
                <Input
                  id='companyName'
                  name='companyName'
                  placeholder='company name'
                  value={formData.companyName}
                  onChange={(e)=>setFormData({...formData, companyName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor='companyAddress'>Company Address</Label>
                <Input
                  id='companyAddress'
                  name='companyAddress'
                  placeholder='company address'
                  value={formData.companyAddress}
                  onChange={(e)=>setFormData({...formData, companyAddress: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  placeholder='email'
                  value={formData.email}
                  onChange={(e)=>setFormData({...formData, email: e.target.value})}
                  required
                />
                <p className='text-muted-foreground text-sm'>note: this email will also be used to login to the dashboard. The default password is admin123456</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  id='phone'
                  name='phone'
                  placeholder='phone number'
                  value={formData.phoneNumber}
                  onChange={(e)=>setFormData({...formData, phoneNumber: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type='submit' disabled={creating}>{creating? "Creating..." : "Create"}</Button>
              </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default AddBranchDialog
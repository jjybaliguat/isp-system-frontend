"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { UserRole, UsersDataSchema } from '@/types/users'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useGetEmployeesQuery } from '@/redux/fetures/employees-api-slice'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useCreateUserMutation } from '@/redux/fetures/users-api-slice'
import { toast } from 'sonner'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEditing?: boolean
    selectedUser?: UsersDataSchema
}

const CreateUserDialog = ({
    open,
    onOpenChange,
    isEditing,
    selectedUser
} : DialogProps) => {
    const {data: employees} = useGetEmployeesQuery({
        page: 1,
        limit: 100
    })
    const [createUser, {isLoading: creating}] = useCreateUserMutation()

    const [formData, setFormData] = useState({
        employeeId: '',
        role: '',
        password: 'admin123456'
    })

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createUser(formData).unwrap()
            toast.success("User created")
            setFormData({
                employeeId: '',
                role: '',
                password: 'admin123456'
            })
            onOpenChange(false)
        } catch (error: any) {
            console.log(error)
            toast.error(`Error: ${error.data.message}`)
        }
    }

  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEditing? "Edit User" : "Create User"}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor="servicePlanId">
                    Select From Employee <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.employeeId}
                        onValueChange={(value) => setFormData({...formData, employeeId: value})}
                        required
                    >
                    <SelectTrigger id="servicePlanId" className="w-full">
                        <SelectValue placeholder="Select from employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees?.data?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                            {employee.fullName}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accessRole">
                    Access Role <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({...formData, role: value})}
                        required
                    >
                    <SelectTrigger id="accessRole" className="w-full">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(UserRole).map((value) => (
                        <SelectItem key={value} value={value}>
                            {value}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">
                    Password (default: admin123456)<span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id='password'
                        value={formData.password}
                        placeholder='enter user password'
                        onChange={(e)=>setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button type='submit' disabled={creating}>{creating? "" : "Create"}</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateUserDialog
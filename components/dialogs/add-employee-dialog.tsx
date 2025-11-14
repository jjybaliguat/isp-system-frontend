import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { EmployeesDataSchema, EmployeeStatus } from '@/types/employees'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { useCreateEmployeeMutation } from '@/redux/fetures/employees-api-slice'
import { toast } from 'sonner'
import { useGetTeamsQuery } from '@/redux/fetures/teams-api-slice'

interface CreateDialogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const CreateEmployeeDialog = ({open, onOpenChange} : CreateDialogModalProps) => {
    const {data: teams} = useGetTeamsQuery()
    const [submitting, setSubmitting] = useState(false)
    const [createEmployee] = useCreateEmployeeMutation()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        role: '',
        status: EmployeeStatus.ACTIVE,
        hireDate: '',
        teamId: ''
    })

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await createEmployee(formData as EmployeesDataSchema)

            onOpenChange(false)
            setSubmitting(false)
            toast("Success", {
                description: "Employee created successfully"
            })
            // console.log(response)
        } catch (error: any) {
            console.log(error)
            setSubmitting(false)
            toast("Error", {
                description: error.data.message
            })
        }
    }


  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Create Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className='space-y-2'>
                    <Label htmlFor='employeeName'>Employee Name <span className='text-destructive'>*</span></Label>
                    <Input
                        id='employeeName'
                        name='fullName'
                        type='text'
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='email'>Email <span className='text-destructive'>*</span></Label>
                    <Input
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='phoneNumber'>Phone Number <span className='text-destructive'>*</span></Label>
                    <Input
                        id='phoneNumber'
                        name='phoneNumber'
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='address'>Address <span className='text-destructive'>*</span></Label>
                    <Input
                        id='address'
                        name='address'
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='role'>Role</Label>
                    <Input
                      placeholder="role"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={(e)=>setFormData({...formData, role: e.target.value})}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div className='flex flex-col gap-2 flex-1'>
                        <Label htmlFor='status'>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: EmployeeStatus)=>setFormData({...formData, status: value})}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Employee Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(EmployeeStatus).map((stat)=> (
                                    <SelectItem value={stat} key={stat}>{stat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex flex-col gap-2 flex-1'>
                        <Label htmlFor='hireDate'>Hire Date <span className='text-destructive'>*</span></Label>
                        <Input
                            id='hireDate'
                            name='hireDate'
                            type='date'
                            value={formData.hireDate}
                            onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                    <Label htmlFor='team'>Assign to Team</Label>
                    <Select value={formData.teamId}
                        onValueChange={(value: EmployeeStatus)=>setFormData({...formData, teamId: value})}
                    >
                        <SelectTrigger id="team" className="w-full">
                            <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams?.map((team)=> (
                                <SelectItem value={team.id} key={team.id}>{team.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button disabled={submitting} type="submit">{submitting ? "Creating..." : "Create"}</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateEmployeeDialog
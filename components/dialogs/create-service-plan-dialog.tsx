import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useCreateServicePlanMutation, useUpdateServicePlanMutation } from '@/redux/fetures/service-plan-api-slice'
import { ServicePlanDataSchema } from '@/types/service-plan'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEditing?: boolean
    servicePlan?: ServicePlanDataSchema
}

interface FormDataSchema {
    name: string
    speedMbps: number
    monthlyFee: number
    descriptions: string[]
}

const CreateServicePlanDialog = ({
    open,
    onOpenChange,
    isEditing,
    servicePlan
} : DialogProps) => {
    const [createServicePlan, {isLoading}] = useCreateServicePlanMutation()
    const [updateServicePlan] = useUpdateServicePlanMutation()
    const [formData, setFormData] = useState<FormDataSchema>(
        {
            name: '',
            speedMbps: 0,
            monthlyFee: 0,
            descriptions: []
        }
    )

    useEffect(()=> {
        if(open){
            if(isEditing && servicePlan){
                setFormData({
                    name: servicePlan.name,
                    speedMbps: servicePlan.speedMbps,
                    monthlyFee: servicePlan.monthlyFee,
                    descriptions: servicePlan.descriptions
                })
            }else{
                setFormData({
                    name: '',
                    speedMbps: 0,
                    monthlyFee: 0,
                    descriptions: []
                })
            }
        }

    }, [isEditing, servicePlan, open])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()

        try {
            if(isEditing && servicePlan){
                await updateServicePlan({id: servicePlan.id, body: formData}).unwrap()
                toast("Success", {
                    description: "Service plan updated successfully"
                })
            }else{
                await createServicePlan(formData).unwrap()
                toast("Success", {
                    description: "Service plan created successfully"
                })
            }
            setFormData({
                name: '',
                speedMbps: 0,
                monthlyFee: 0,
                descriptions: []
            })
            onOpenChange(false)
        } catch (error: any) {
            console.log(error)
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEditing? "Edit Service Plan" : "Create Service Plan"}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        id='name'
                        name='name'
                        placeholder='enter service plan name'
                        value={formData.name}
                        onChange={(e)=>setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='speed'>Speed in Mbps</Label>
                    <Input
                        id='speed'
                        name='speed'
                        type='number'
                        placeholder='enter service plan speed'
                        value={formData.speedMbps}
                        onChange={(e)=>setFormData({...formData, speedMbps: Number(e.target.value)})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='fee'>Monthly Fee</Label>
                    <Input
                        id='fee'
                        name='fee'
                        type='number'
                        placeholder='enter service plan monthly fee'
                        value={formData.monthlyFee}
                        onChange={(e)=>setFormData({...formData, monthlyFee: Number(e.target.value)})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='description'>Descriptions</Label>
                    <div id='description' className='space-y-2'>
                        {formData.descriptions.map((description, index)=>(
                            <div className="flex items-center gap-1">
                                <Input
                                    key={index}
                                    type='text'
                                    placeholder='enter service description'
                                    value={description}
                                    onChange={(e)=>{
                                        let descriptions = formData.descriptions
                                        descriptions[index] = e.target.value
                                        setFormData({...formData, descriptions})
                                    }}
                                    required
                                />
                                <Button type='button' variant="destructive" 
                                    onClick={()=>setFormData({...formData, descriptions: formData.descriptions.filter((_, idx)=>idx !== index)})}>
                                    <IconTrash />
                                </Button>
                                </div>
                        ))}
                        <Button type='button'
                            onClick={()=>setFormData({...formData, descriptions: [...formData.descriptions, '']})}
                            variant="outline" 
                            size="sm"
                        >
                            <IconPlus className='h-4 w-4' /> 
                            Add Description
                        </Button>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button type='submit' disabled={isLoading}>{isLoading? (isEditing? "Updating..." : "Updated") : (isEditing? "Update" : "Create")}</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateServicePlanDialog
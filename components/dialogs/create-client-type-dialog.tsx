import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useCreateClientTypeMutation, useUpdatedClientTypeMutation } from '@/redux/fetures/client-type-slice'
import { toast } from 'sonner'
import { clientTypeSchema } from '@/types/clients'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void,
    isEditing?: boolean
    selectedClientType?: clientTypeSchema
}

const CreateClientTypeDialog = ({
    open,
    onOpenChange,
    isEditing,
    selectedClientType
} : DialogProps) => {
    const [createClientType, {isLoading: creating}] = useCreateClientTypeMutation()
    const [updateClient, {isLoading: updating}] = useUpdatedClientTypeMutation()
    const [formData, setFormData] = useState({
        name: ''
    })

    useEffect(()=> {
        if(open){
            if(isEditing && selectedClientType){
                setFormData({
                    name: selectedClientType.name
                })
            }else{
                setFormData({name: ''})
            }
        }
    }, [open, isEditing, selectedClientType])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        try {
            if(isEditing && selectedClientType){
                await updateClient({id: selectedClientType.id, body: {name: formData.name}}).unwrap()
                toast.success("Client type updated")
            }else{
                await createClientType(formData).unwrap()
                toast.success("Client type created")
            }
            
            setFormData({name: ''})
            onOpenChange(false)
        } catch (error) {
            console.log(error)
            toast.error("Error while creating client type")
        }
    }

  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEditing? "Edit" : "Create"} Client Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor='name'>Client Type Name</Label>
                    <Input
                        id='name'
                        placeholder='Enter client type name'
                        value={formData.name}
                        onChange={(e)=>setFormData({...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button type='submit' disabled={(creating || updating)}>{(creating || updating)? "Saving..." : "Save"}</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateClientTypeDialog
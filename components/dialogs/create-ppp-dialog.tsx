"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { MikrotikPPPProfiles, useCreatePPPMutation, useGetPPPProfilesQuery, useUpdatePPPMutation } from '@/redux/fetures/mikrotik-device-slice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { PPPSecrets } from '@/redux/fetures/mikrotik-api-slice'

const CreatePPPDialog = ({
    routerId,
    open,
    onOpenChange,
    profiles,
    selectedItem
} : {
    routerId: string
    open: boolean,
    onOpenChange: () => void,
    profiles?: MikrotikPPPProfiles[],
    selectedItem?: PPPSecrets | null
}) => {
    const [createPPP, {isLoading: creating}] = useCreatePPPMutation()
    const [updatePPP, {isLoading: updating}] = useUpdatePPPMutation()
    const [formData, setFormData] = useState({
        name: selectedItem?.name || "",
        password: selectedItem?.password || "",
        profile: selectedItem?.profile || ""
    })
    const [isUsernameSameAsPassword, setIsUserNameSameAsPassword] = useState(false)

    const isEditing = selectedItem !== null

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        try {
            isEditing ? 
            await updatePPP({routerId, ...formData}).unwrap() :
            await createPPP({routerId, ...formData}).unwrap()
            toast.success(`PPP ${formData.name} ${isEditing? "updated" : "created"} successfully`)
            setFormData({
                name: "",
                password: "",
                profile: ""
            })
            onOpenChange()
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    // const handlePassCheckChange = (checked: boolean) => {
    //     setIsUserNameSameAsPassword(checked)
    //     if(checked){    
    //         setFormData({...formData, password: formData.name})
    //     }else{
    //         return
    //     }
    // }

    useEffect(()=>{
        if(selectedItem){
            setFormData({
                name: selectedItem.name,
                password: selectedItem.password,
                profile: selectedItem.profile
            })
        }
    }, [selectedItem])

    useEffect(()=> {
        if(isUsernameSameAsPassword){
            setFormData({...formData, password: formData.name})
        }
    }, [isUsernameSameAsPassword, formData.name])

  return (
    <>
        <Dialog open={open || isEditing} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create PPP Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                            id='name'
                            type='text'
                            value={formData.name}
                            onChange={(e)=>setFormData({...formData, name: e.target.value})}
                            disabled={isEditing}
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className="space-y-2">
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                value={formData.password}
                                onChange={(e)=>setFormData({...formData, password: e.target.value})}
                                disabled={isUsernameSameAsPassword}
                                required
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <Checkbox id='passCheck' checked={isUsernameSameAsPassword} onCheckedChange={(checked: boolean)=>setIsUserNameSameAsPassword(checked)} />
                            <Label htmlFor='passCheck'>Password Same As Name</Label>
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Profile</Label>
                        <Select
                        value={formData.profile}
                        onValueChange={(value) => setFormData({ ...formData, profile: value })}
                        required
                        >
                        <SelectTrigger id="servicePlanId" className="w-full">
                            <SelectValue placeholder="Select ppp profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {profiles?.map((profile) => (
                            <SelectItem key={profile.id} value={profile.name}>
                                {profile.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    <div className='flex justify-end'>
                        {isEditing ? <Button type='submit' disabled={updating}>{updating? "Saving..." : "Save"}</Button> :
                        <Button type='submit' disabled={creating}>{creating? "Creating..." : "Create"}</Button>
                        }
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CreatePPPDialog
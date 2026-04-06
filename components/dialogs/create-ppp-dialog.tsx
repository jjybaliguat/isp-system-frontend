"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { useCreatePPPMutation } from '@/redux/fetures/mikrotik-device-slice'

const CreatePPPDialog = ({
    open,
    onOpenChange
} : {
    open: boolean,
    onOpenChange: () => void
}) => {
    const [createPPP, {isLoading: creating}] = useCreatePPPMutation()
    const [formData, setFormData] = useState({
        name: "",
        password: ""
    })
    const [isUsernameSameAsPassword, setIsUserNameSameAsPassword] = useState(false)

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await createPPP(formData).unwrap()

            console.log(response)
            onOpenChange()
        } catch (error) {
            console.log(error)
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

    useEffect(()=> {
        if(isUsernameSameAsPassword){
            setFormData({...formData, password: formData.name})
        }
    }, [isUsernameSameAsPassword, formData.name])

  return (
    <>
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <div className='flex justify-end'>
                        <Button type='submit' disabled>{creating? "Creating..." : "Create"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CreatePPPDialog
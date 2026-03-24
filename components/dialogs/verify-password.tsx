"use client"
import React, { ReactNode, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useCheckPasswordMutation } from '@/redux/fetures/users-api-slice'
import { toast } from 'sonner'
import { DialogClose } from '../ui/dialog'

interface AlertProps {
    triggerButton: ReactNode
    onConfirm: () =>void
}

const VerifyPassword = ({
    triggerButton,
    onConfirm
} : AlertProps) => {
    const [checkPassword] = useCheckPasswordMutation()
    const [password, setPassword] = useState('')
    const dialogClose = useRef<any>(null)

    const checkPass = async(e: React.FormEvent) => {
        e.preventDefault()
        try {
           const check = await checkPassword({password})
           if(check.error){
            toast.error(check.error.data.message)
            return
           }
           onConfirm()
           dialogClose.current.click()
           setPassword("")
        } catch (error) {
            console.log(error)
            toast.error("Internal Server Error")
        }
    }

  return (
        <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please enter your password to proceed to this operation</AlertDialogTitle>
          <AlertDialogDescription>
            This action is protected, you must confirm your password first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={checkPass} className='space-y-6'>
            <div className='space-y-2'>
                <Label>Enter your password</Label>
                <Input
                    value={password}
                    type='password'
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel ref={dialogClose}>Cancel</AlertDialogCancel>
            <Button
                className="bg-destructive hover:bg-destructive"
                type='submit'
            >
                Proceed
            </Button>
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default VerifyPassword
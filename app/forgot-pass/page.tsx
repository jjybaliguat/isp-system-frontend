"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [errorMess, setErrorMess] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSendResetPassLink = async(e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMess(null)
        setSuccessMessage(null)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: "POST",
                body: JSON.stringify({email}),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const responseData = await response.json()
            if(!response.ok){
                setLoading(false)
                setErrorMess(responseData.error? responseData.error: responseData.message)
                setSuccessMessage(null)  
            }else{
                setLoading(false)
                setSuccessMessage(responseData.message)
            }
        } catch (error: any) {
            console.log(error)
            setLoading(false)
            setErrorMess(error.data.message)
            setSuccessMessage(null)
        }
    }

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleSendResetPassLink}
                className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div>
                        <Link
                            href="/"
                            aria-label="go home">
                            <Logo logoUrl='/images/sierra-logo.png' height={120} width={120} />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Recover Password</h1>
                        <p className="text-sm">Enter your email to receive a reset link</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <p className='text-sm text-destructive'>{errorMess}</p>
                        {successMessage && <p className='text-sm text-green-500'>{successMessage}</p>}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <Button disabled={loading} type='submit' className="w-full">{loading? "Please wait..." : "Send Reset Link"}</Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">We'll send you a link to reset your password.</p>
                    </div>
                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Remembered your password?
                        <Button
                            asChild
                            variant="link"
                            className="px-2">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}

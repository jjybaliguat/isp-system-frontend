"use client"

import React, { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tokenParam = searchParams.get("token") || searchParams.get("t")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!tokenParam) {
      setError("Missing reset token. Please use the link sent to your email.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenParam, password }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json?.message || "Failed to reset password")
        toast.error(json?.message || "Failed to reset password")
      } else {
        toast.success("Password reset successfully. redirecting you to login page...")
        setTimeout(()=> {
            router.push("/login")
        }, 2000)
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred")
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl">
          <CardHeader>
            <Link
                href="/"
                aria-label="go home">
                <Logo logoUrl='/images/sierra-logo.png' height={120} width={120} />
            </Link>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Set a new password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!tokenParam && (
                <p className="text-sm text-destructive">No token provided. Please use the link from your email.</p>
              )}

              <div>
                <Label htmlFor="password">New password</Label>
                <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} />
              </div>

              <div>
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required minLength={8} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading || !tokenParam}>{loading? 'Saving...' : 'Set new password'}</Button>
                <Button variant="ghost" onClick={()=>router.push('/login')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function ApplicationStatusPage() {
  const [applicationNumber, setApplicationNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  const fetchStatus = async () => {
    if (!applicationNumber) {
      toast.error("Enter application number")
      return
    }

    setLoading(true)
    setResult(null)
    try {
      // Try status endpoint first
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/status?applicationNumber=${encodeURIComponent(applicationNumber)}`)
      if (!res.ok) {
        // fallback to direct lookup
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${encodeURIComponent(applicationNumber)}`)
      }
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(json?.message || "Application not found")
      } else {
        setResult(json)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch application status")
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary"
      case "PROCESSING":
        return "default"
      case "ONGOING":
      case "INSTALLED":
        return "default"
      case "REJECTED":
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Check Application Status</CardTitle>
            <CardDescription>Enter your application number to see progress.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div>
                <Label>Application Number</Label>
                <Input value={applicationNumber} onChange={(e)=>setApplicationNumber(e.target.value)} placeholder="e.g. APP-12345" />
              </div>

              <div className="flex gap-2">
                <Button onClick={fetchStatus} disabled={loading}>{loading? 'Checking...' : 'Check Status'}</Button>
                <Button variant="ghost" onClick={()=>{ setApplicationNumber(''); setResult(null) }}>Clear</Button>
              </div>

              {result && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Application Number</p>
                      <p className="font-medium">{result.applicationNumber ?? result.application_number ?? result.id}</p>
                    </div>
                    <div>
                      <Badge variant={statusColor(result.applicationStatus ?? result.status ?? "PENDING")}>{result.applicationStatus ?? result.status}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Applicant</p>
                    <p className="font-medium">{result.name ?? result.fullName ?? '—'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Service Plan</p>
                    <p className="font-medium">{result.servicePlan?.name ?? result.servicePlanName ?? '—'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Coverage</p>
                    <p className="font-medium">{result.coverage?.name ?? result.coverageName ?? '—'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Submitted At</p>
                    <p className="font-medium">{result.createdAt ? new Date(result.createdAt).toLocaleString() : '—'}</p>
                  </div>

                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

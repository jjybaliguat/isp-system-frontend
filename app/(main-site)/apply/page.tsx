"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useGetFilteredProvidersQuery, useGetProvidersQuery } from "@/redux/fetures/provider-api-slice"
import { ProviderDataSchema } from "@/types/provider"
import { Checkbox } from "@/components/ui/checkbox"

export default function ApplyPage() {
  const router = useRouter()
  const [privayTermsAccepted, setPrivayTermsAccepted] = useState(false)
  const { data: providers } = useGetFilteredProvidersQuery()
  const [selectedProvider, setSelectedProvider] = useState<ProviderDataSchema | null>(null)

  React.useEffect(() => {
    if (providers && (form.providerId === "")) {
      // set default provider id when only one provider record is available
      // provider API returns a single ProviderDataSchema
      setForm((prev) => ({ ...prev, providerId: (providers as any).id || "" }))
    }
  }, [providers])

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    providerId: "",
    servicePlanId: "",
    coverageId: "",
    notes: "",
  })

  const [idDocument, setIdDocument] = useState<{ idType: string; idCardNumber: string }>({ idType: "DRIVER", idCardNumber: "" })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [honeypot] = useState("")
  
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const recaptchaLoaded = useRef(false)

  // Load reCAPTCHA v3 script dynamically
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || recaptchaLoaded.current) return

    const scriptId = "recaptcha-script"
    if (document.getElementById(scriptId)) {
      recaptchaLoaded.current = true
      return
    }

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.id = scriptId
    script.onload = () => (recaptchaLoaded.current = true)
    document.head.appendChild(script)
  }, [RECAPTCHA_SITE_KEY])

  // Helper to obtain a reCAPTCHA v3 token. This handles script loading and grecaptcha.ready callback.
  const getRecaptchaToken = async (): Promise<string | undefined> => {
    if (!RECAPTCHA_SITE_KEY) return undefined

    // Ensure script is loaded
    if (typeof window === "undefined") return undefined

    if (!(window as any).grecaptcha) {
      // try to load script synchronously if not already present
      const id = "recaptcha-script"
      let script = window.document.getElementById(id) as HTMLScriptElement | null
      if (!script) {
        script = window.document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
        script.async = true
        script.defer = true
        script.id = id
        window.document.head.appendChild(script)
        await new Promise((resolve, reject) => {
          script!.onload = () => resolve(null)
          script!.onerror = () => resolve(null)
          // timeout after 5s
          setTimeout(() => resolve(null), 5000)
        })
      }
    }

    if (!(window as any).grecaptcha) return undefined

    return await new Promise((resolve) => {
      try {
        (window as any).grecaptcha.ready(() => {
          try {
            const exec = (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "apply" })
            if (exec && typeof exec.then === "function") {
              exec.then((token: string) => resolve(token)).catch(() => resolve(undefined))
            } else {
              // older API: execute may accept callback
              resolve(undefined)
            }
          } catch (e) {
            resolve(undefined)
          }
        })
      } catch (e) {
        resolve(undefined)
      }
    })
  }

  const handleDocumentChange = (field: 'idType' | 'idCardNumber', value: string) => {
    setIdDocument((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.providerId || !form.servicePlanId || !form.coverageId) {
      toast.error("Please complete required fields: name, email, phone, provider, service plan and coverage")
      return
    }

    if ((e.target as HTMLFormElement).hp_name?.value) return

    if (!idDocument || !idDocument.idCardNumber || !idDocument.idType) {
      toast.error("Please provide one ID entry (type & number)")
      return
    }

    setLoading(true)

    try {
      // Generate reCAPTCHA v3 token (if configured)
      let recaptchaToken: string | undefined
      if (RECAPTCHA_SITE_KEY) {
        recaptchaToken = await getRecaptchaToken()
      }
      console.log(recaptchaToken)

      const payload = {
        ...form,
        idType: idDocument.idType,
        idCardNumber: idDocument.idCardNumber,
        recaptchaToken,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(json?.message || "Failed to submit application")
      } else {
        setResult(json)
        toast.success("Application submitted")
      }
    } catch (err) {
      console.error(err)
      toast.error("Unexpected error submitting application")
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Application Submitted</CardTitle>
              <CardDescription>Your application has been received.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Application Number:</p>
              <pre className="p-3 bg-muted/10 rounded mb-4">{result.applicationNumber ?? result.application_number ?? JSON.stringify(result)}</pre>
              <p className="mb-2">Save this number to check your application status.</p>
              <div className="flex gap-2">
                <Button onClick={() => { navigator.clipboard.writeText(String(result.applicationNumber ?? result.application_number ?? "")); toast.success("Copied") }}>Copy Number</Button>
                <Button variant="ghost" onClick={() => { setResult(null); setForm({name: '', email: '', phone: '', address: '', providerId: '', servicePlanId: '', coverageId: '', notes: ''}); setIdDocument({ idType: 'GOV_ID', idCardNumber: '' }) }}>New Application</Button>
                <Button variant="outline" onClick={() => router.push('/')}>Return Home</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl">
          <CardHeader>
            <Link
                href="/"
                aria-label="go home"
                className="block w-fit">
                <Image
                    src="/images/sierra-logo.png"
                    alt='sierra-logo'
                    height={120}
                    width={120}
                />
            </Link>
            <CardTitle>Apply Online</CardTitle>
            <CardDescription>Fill out the form below to apply. You will receive an application number once completed.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field to trap bots (hidden) */}
          <input name="hp_name" type="text" tabIndex={-1} autoComplete="off" className="hidden" />
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Select Branch</Label>
                    <Select
                        value={form.providerId}
                        onValueChange={(providerId) => {
                        setForm({
                            ...form,
                            providerId,
                            servicePlanId: "",
                            coverageId: "",
                        });

                        const provider = providers?.find((p) => p.id === providerId) || null;
                        setSelectedProvider(provider);
                        }}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                        {providers?.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                            {p.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>

                <div className="space-y-2">
                    <Label>Service Plan</Label>
                    <Select
                        value={form.servicePlanId}
                        onValueChange={(v) => setForm({ ...form, servicePlanId: v })}
                        disabled={!selectedProvider}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                        {selectedProvider?.servicePlans?.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                            {p.name} — ₱{Number(p.monthlyFee || 0).toLocaleString()}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>

                <div className="space-y-2">
                    <Label>Coverage</Label>
                    <Select
                        value={form.coverageId}
                        onValueChange={(v) => setForm({ ...form, coverageId: v })}
                        disabled={!selectedProvider}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select coverage" />
                        </SelectTrigger>
                        <SelectContent>
                        {selectedProvider?.coverage?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                            {c.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Identification Documents</Label>
                <p className="text-sm text-muted-foreground">Provide one ID entry (type + number).</p>

                <div className="mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                    <div>
                      <Label className="text-xs">ID Type</Label>
                      <Select value={idDocument.idType} onValueChange={(v)=> handleDocumentChange('idType', v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRIVER">Driver's License</SelectItem>
                          <SelectItem value="PASSPORT">Passport</SelectItem>
                          <SelectItem value="COMPANY">Company ID</SelectItem>
                          <SelectItem value="TIN">TIN ID</SelectItem>
                          <SelectItem value="UMID">UMID ID</SelectItem>
                          <SelectItem value="SSS">SSS ID</SelectItem>
                          <SelectItem value="NATIONAL">NATIONAL ID</SelectItem>
                          <SelectItem value="POSTAL">POSTAL ID</SelectItem>
                          <SelectItem value="PRC">PRC ID</SelectItem>
                          <SelectItem value="PHILHEALTH">PHILHEALTH ID</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">ID Number</Label>
                      <Input value={idDocument.idCardNumber} onChange={(e)=> handleDocumentChange('idCardNumber', e.target.value)} required />
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <p>One ID entry is required.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                  <Checkbox id="privacy-terms-accept" checked={privayTermsAccepted} onCheckedChange={(checked: boolean) => setPrivayTermsAccepted(checked)} />
                  <Label htmlFor="privacy-terms-accept">By clicking submit, you agree to the 
                    <Link href="/privacy-policy" className="text-primary underline" target="_blank">Privacy Policy</Link> 
                    and 
                    <Link href="/terms" className="text-primary underline" target="_blank">Terms and Condition</Link>
                  </Label>
              </div>           
              <div className="flex gap-2">
                <Button type="submit" disabled={loading || !privayTermsAccepted}>{loading? 'Submitting...' : 'Submit Application'}</Button>
                <Button variant="ghost" type="button" onClick={()=>{ setForm({name: '', email: '', phone: '', address: '', providerId: '', servicePlanId: '', coverageId: '', notes: ''}); setIdDocument({ idType: 'DRIVER', idCardNumber: '' }) }}>Reset</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
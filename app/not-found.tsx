"use client"

import { useRouter } from "next/navigation"
import { IconAlertCircle } from "@tabler/icons-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background text-foreground">
      <IconAlertCircle className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-sans)" }}>
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground mb-6">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => router.back()}
        className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Go Back
      </button>
    </div>
  )
}

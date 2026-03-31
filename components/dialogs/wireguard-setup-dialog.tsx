"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  script: string
  routerName: string
}

export default function WireguardSetupDialog({
  open,
  onOpenChange,
  script,
  routerName,
}: Props) {
  const [copied, setCopied] = useState(false)

const handleCopy = async () => {
  try {
    // Convert HTML string → plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = script;
    const text = tempDiv.innerText; // preserves line breaks nicely

    await navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Connect MikroTik Router — {routerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* 🔹 Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">Setup Instructions (Make sure your mikrotik has WireGuard)</h3>

            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Open your MikroTik router (Winbox or WebFig)</li>
              <li>Go to <b>New Terminal</b></li>
              <li>Copy the script below</li>
              <li>Paste it into the terminal and press <b>Enter</b></li>
              <li>Wait a few seconds for the connection to establish</li>
              <li>Verify connection in <b>Interfaces → WireGuard</b></li>
            </ol>
          </div>

          {/* 🔹 Script Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Connection Script</h3>

              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div
              className="rounded-xl border bg-muted p-4 overflow-auto max-h-[300px]"
              dangerouslySetInnerHTML={{ __html: script }}
            />
          </div>

          {/* 🔹 Extra Tips */}
          <div className="text-xs text-muted-foreground">
            💡 Tip: Make sure your router has internet access before running the script.
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
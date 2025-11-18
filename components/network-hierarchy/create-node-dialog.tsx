"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  useCreateOLTMutation,
  useCreatePonPortMutation,
  useCreateLCPMutation,
  useCreateODCMutation,
  useCreateODPMutation,
  useCreateOdpPortMutation,
  useAssignClientToPortMutation,
} from "@/redux/fetures/network-hierarchy-api-slice"
import { SelectClient } from "../combobox/select-client"

interface CreateNodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeType: string
  parentId: string
  onSuccess: () => void
}

export default function CreateNodeDialog({
  open,
  onOpenChange,
  nodeType,
  parentId,
  onSuccess,
}: CreateNodeDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // RTK Mutations
  const [createOLT] = useCreateOLTMutation()
  const [createPonPort] = useCreatePonPortMutation()
  const [createLCP] = useCreateLCPMutation()
  const [createODC] = useCreateODCMutation()
  const [createODP] = useCreateODPMutation()
  const [createOdpPort] = useCreateOdpPortMutation()
  const [assignClient] = useAssignClientToPortMutation()

  const handleCreate = async () => {
    try {
      setIsLoading(true)

      let mutation: any
      let payload: any = { ...formData }

      switch (nodeType) {
        case "OLT":
          mutation = createOLT
          break
        case "PonPort":
          mutation = createPonPort
          payload.oltId = parentId
          break
        case "LCP":
          mutation = createLCP
          payload.ponPortId = parentId
          break
        case "ODC":
          mutation = createODC
          payload.lcpId = parentId
          break
        case "ODP":
          mutation = createODP
          payload.lcpId = parentId
          payload.odcId = parentId
          break
        case "OdpPort":
          mutation = createOdpPort
          payload.odpId = parentId
          break
        case "Client":
          mutation = assignClient
          payload.portId = parentId
          break
        default:
          throw new Error("Invalid node type")
      }

      await mutation(payload).unwrap()
      toast.success(`${nodeType} created successfully`)
      setFormData({})
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast.error(`Failed to create ${nodeType}: ${error.data.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderFields = () => {

    const typeSpecificFields: Record<string, any[]> = {
      OLT: [
        { label: "Name", key: "name", type: "text" },
        { label: "Location", key: "location", type: "text" },
        { label: "Latitude", key: "latitude", type: "number" },
        { label: "Longitude", key: "longitude", type: "number" },
        { label: "Brand", key: "brand", type: "text" },
        { label: "Model", key: "model", type: "text" },
        { label: "Pon Count", key: "ponCount", type: "number" },
        { label: "IP Address", key: "ipAddress", type: "text" },
        { label: "Remarks", key: "remarks", type: "textarea" },
      ],
      PonPort: [
        { label: "Port Number", key: "portNumber", type: "number" },
        { label: "Description", key: "description", type: "text" },
        { label: "Remarks", key: "remarks", type: "textarea" },
      ],
      LCP: [
        { label: "LCP Code", key: "lcpCode", type: "text" },
        { label: "Location", key: "location", type: "text" },
        { label: "Latitude", key: "latitude", type: "number" },
        { label: "Longitude", key: "longitude", type: "number" },
        { label: "Remarks", key: "remarks", type: "textarea" },
      ],
      ODC: [
        // { label: "Name", key: "name", type: "text" },
        { label: "Cabinet/Enclosure Code", key: "cabinetCode", type: "text" },
        { label: "Location", key: "location", type: "text" },
        { label: "Latitude", key: "latitude", type: "number" },
        { label: "Longitude", key: "longitude", type: "number" },
        { label: "Remarks", key: "remarks", type: "textarea" },
      ],
      ODP: [
        // { label: "Name", key: "name", type: "text" },
        { label: "ODP Code", key: "odpCode", type: "text" },
        { label: "Location", key: "location", type: "text" },
        { label: "Latitude", key: "latitude", type: "number" },
        { label: "Longitude", key: "longitude", type: "number" },
        { label: "Port Count", key: "portCount", type: "number" },
        { label: "Remarks", key: "remarks", type: "textarea" },
      ],
      OdpPort: [
        { label: "Port Number", key: "portNumber", type: "number" },
        { label: "Remarks", key: "remarks", type: "textarea" },
      ],
      Client: [
        {label: "Select Client", key: "clientId", type: "select"}
      ]
    }

    const fields = [...(typeSpecificFields[nodeType] || [])]

    return fields.map((field) => (
      <div key={field.key} className="space-y-2">
        <Label>{field.label}</Label>
        {field.type === "textarea" ? (
          <Textarea
            value={formData[field.key] || ""}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        ) : field.type === "select" ? (
          <SelectClient onSelect={(value) => setFormData({ ...formData, [field.key]: value })} />
        ) : (
          <Input
            type={field.type}
            value={formData[field.key] || ""}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
        }
      </div>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nodeType === "Client"? "Assign Client" : `Create ${nodeType}`}</DialogTitle>
          <DialogDescription>{nodeType === "Client"? "Assign Client to odp port" : `Add a new ${nodeType} to your network hierarchy`}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{renderFields()}</div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : nodeType === "Client" ? "Assign" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

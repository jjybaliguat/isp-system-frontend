"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import HierarchyTree from "@/components/network-hierarchy/hierarchy-tree"
import NetworkMap from "@/components/network-hierarchy/network-map"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import CreateNodeDialog from "@/components/network-hierarchy/create-node-dialog"
import EditNodeDialog from "@/components/network-hierarchy/edit-node-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteLCPMutation, useDeleteODCMutation, useDeleteODPMutation, useDeleteOdpPortMutation, useDeleteOLTMutation, useDeletePonPortMutation, useGetNetworkHierarchyQuery, useUnAssignClientToPortMutation } from "@/redux/fetures/network-hierarchy-api-slice"
import { toast } from "sonner"

export default function NetworkHierarchyPage() {
  const { data: olts, isLoading, error } = useGetNetworkHierarchyQuery()
  const [selectedItem, setSelectedItem] = useState<{ type: string; id: string } | null>(null)

  const [createDialog, setCreateDialog] = useState<{ open: boolean; type: string; parentId?: string }>({
    open: false,
    type: "",
  })
  const [editDialog, setEditDialog] = useState<{ open: boolean; type: string; item?: string }>({ open: false, type: "" })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string }>({
    open: false,
    type: "",
    id: "",
  })

  const [deleteOlt] = useDeleteOLTMutation()
  const [deletePonPort] = useDeletePonPortMutation()
  const [deleteLcp] = useDeleteLCPMutation()
  const [deleteOdc] = useDeleteODCMutation()
  const [deleteOdp] = useDeleteODPMutation()
  const [deleteOdpPort] = useDeleteOdpPortMutation()
  const [unAssignClientToPort] = useUnAssignClientToPortMutation()

  const handleEdit = (type: string, item: string) => {
    setEditDialog({ open: true, type, item })
  }

  const handleDelete = (type: string, id: string) => {
    setDeleteDialog({ open: true, type, id })
  }

  const handleAdd = (type: string, parentId: string) => {
    setCreateDialog({ open: true, type, parentId })
  }

  const handleConfirmDelete = async () => {
    const { type, id } = deleteDialog

    try {
      switch (type) {
        case "OLT":
          await deleteOlt(id).unwrap()
          break
        case "PonPort":
          await deletePonPort(id).unwrap()
          break
        case "LCP":
          await deleteLcp(id).unwrap()
          break
        case "ODC":
          await deleteOdc(id).unwrap()
          break
        case "ODP":
          await deleteOdp(id).unwrap()
          break
        case "OdpPort":
          await deleteOdpPort(id).unwrap()
          break
        case "Client":
          await unAssignClientToPort({accountId: id}).unwrap()
          break
      }
      toast.success(`${type} deleted successfully`)
      setDeleteDialog({ open: false, type: "", id: "" })
    } catch (error) {
      toast.error(`Failed to ${type === "Client" ? "unassign" : "delete"} ${type}`)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <Skeleton className="h-96" />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="p-4 h-full">
            <Skeleton className="h-full" />
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Failed to load network hierarchy</p>
          <p className="text-muted-foreground text-sm mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Network Hierarchy</h1>
            <p className="text-muted-foreground">Visualize your network infrastructure from OLT to clients</p>
          </div>
          <Button onClick={() => handleAdd("OLT", "")} className="gap-2">
            <Plus className="h-4 w-4" />
            New OLT
          </Button>
        </div>
        <div className="bg-muted/40 p-4 rounded-lg border space-y-2">
          <h2 className="text-lg font-semibold">Network Component Definitions</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>OLT</strong> – Optical Line Terminal: Main fiber controller in the ISP data center that manages PON traffic.
            </li>
            <li>
              <strong>PON Port</strong> – Passive Optical Network Port: Port on the OLT that starts the fiber distribution tree.
            </li>
            <li>
              <strong>LCP</strong> – Local Convergence Point: Mid-network node that distributes fiber toward ODC/ODP locations.
            </li>
            <li>
              <strong>ODC/Enclosure</strong> – Outside Drop Cabinet: A small outdoor enclosure where the ISP terminates or organizes subscriber lines. ODC can have multiple ODPs
            </li>
            <li>
              <strong>ODP/NAP</strong> – Optical Distribution Point: Near-client distribution box that connects to drop fibers.
            </li>
            <li>
              <strong>ODP Port / Nap Port</strong> – Client fiber port on an ODP; each port may be <em>Available</em> or <em>Occupied</em>.
            </li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="overflow-auto min-h-[300px] max-h-[500px]">
          <Card className="p-4 h-fit min-h-full">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Network Structure</h2>
              {olts && olts.length > 0 ? (
                <HierarchyTree
                  olts={olts}
                  selectedItem={selectedItem}
                  onSelectItem={setSelectedItem}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              ) : (
                <p className="text-muted-foreground text-sm">No OLTs found</p>
              )}
            </div>
          </Card>
        </div>

        <div className="">
          <Card className="p-0 h-[650px] overflow-hidden">
            {olts && <NetworkMap olts={olts} selectedItem={selectedItem} onSelectItem={setSelectedItem} />}
          </Card>
        </div>
      </div>

      <CreateNodeDialog
        open={createDialog.open}
        onOpenChange={(open) => setCreateDialog({ ...createDialog, open })}
        nodeType={createDialog.type}
        parentId={createDialog.parentId!}
        onSuccess={()=>{}}
      />
{/* 
      <EditNodeDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
        nodeType={editDialog.type}
        nodeId={editDialog.item}
        item={editDialog.item}
      /> */}

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialog.type === "Client" ? "Unassign Client" : `Delete ${deleteDialog.type}`}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {deleteDialog.type === "Client" ? "Unassign this client" : `delete this ${deleteDialog.type.toLowerCase()}`}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDialog.type === "Client" ? "Unassign" : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

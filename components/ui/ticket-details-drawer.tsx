"use client"

import { useCallback, useEffect, useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TicketCommentsSection } from "./ticket-comments-section"
import { TicketActivityLog } from "./ticket-activity-log"
import { Calendar, User, Tag } from "lucide-react"
import { TicketDataSchema, TicketPriority, TicketStatus } from "@/types/ticket"
import { useDeleteTicketMutation, useUpdateTicketMutation } from "@/redux/fetures/tickets-api-slice"
import { toast } from "sonner"
import { formatDate } from "@/utils/formatDate"
import { useGetUsersQuery } from "@/redux/fetures/users-api-slice"
import { UserRole, UsersDataSchema } from "@/types/users"
import { Button } from "./button"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import { useGetEmployeesQuery } from "@/redux/fetures/employees-api-slice"
import { EmployeesDataSchema } from "@/types/employees"
import { useGetTeamsQuery } from "@/redux/fetures/teams-api-slice"
import { TeamsDataSchema } from "@/types/teams"
import { useAppSelector } from "@/redux/store/store"

interface TicketDetailsDrawerProps {
  ticket: TicketDataSchema
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRIORITY_CONFIG: Record<TicketPriority, { color: string; bgColor: string }> = {
  [TicketPriority.LOW]: { color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" },
  [TicketPriority.MEDIUM]: { color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" },
  [TicketPriority.HIGH]: { color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900" },
  [TicketPriority.URGENT]: { color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" },
}

export function TicketDetailsDrawer({ ticket, open, onOpenChange }: TicketDetailsDrawerProps) {
  const [deleteTicket] = useDeleteTicketMutation()
  const [selectedStatus, setSelectedStatus] = useState(ticket.status)
  const [selectedTeamAssignee, setSelectedTeamAssignee] = useState(ticket.assignedToTeam?.id || "unassigned")
  const [selectedEmployeeAssignee, setSelectedEmployeeAssignee] = useState(ticket.assignedToEmployee?.id || "unassigned")
  const [updateTicket, { isLoading }] = useUpdateTicketMutation()
  const {data: employees} = useGetEmployeesQuery({
    page: 1,
    limit: 1000
  })
  const {data: teams} = useGetTeamsQuery()
  const user = useAppSelector((store) => store.auth)

  const priorityConfig = PRIORITY_CONFIG[ticket.priority]
  const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date()

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus as TicketStatus)
    try {
      await updateTicket({
        id: ticket.id,
        data: { status: newStatus as TicketStatus },
      }).unwrap()
      toast("Success", {
        description: "Ticket status updated",
      })
    } catch (error) {
      setSelectedStatus(ticket.status)
      toast("Error", {
        description: "Failed to update ticket status",
      })
    }
  }

  const handleTeamAssignee = async (value: string) => {
    if (value === selectedTeamAssignee) return;
    try {
      setSelectedTeamAssignee(value);
      setSelectedEmployeeAssignee("unassigned");
      await updateTicket({
        id: ticket.id,
        data: { assignedToTeamId: value || undefined, assignedToEmployeeId: "unassigned" },
      }).unwrap()
      toast("Success", {
        description: "Ticket assigned successfully",
      })
    } catch (error) {
      setSelectedTeamAssignee(ticket.assignedToTeam?.id || "unassigned")
      toast("Error", {
        description: "Failed to assign ticket",
      })
    }
  }
  const handleEmployeeAssignee = async (value: string) => {
    if (value === selectedEmployeeAssignee) return;
    try {
      setSelectedEmployeeAssignee(value);
      setSelectedTeamAssignee("unassigned");
      await updateTicket({
        id: ticket.id,
        data: { assignedToEmployeeId: value || undefined, assignedToTeamId: "unassigned" },
      }).unwrap()
      toast("Success", {
        description: "Ticket assigned successfully",
      })
    } catch (error) {
      setSelectedTeamAssignee(ticket.assignedToTeam?.id || "unassigned")
      toast("Error", {
        description: "Failed to assign ticket",
      })
    }
  }

  const handleDeleteTicket = async(id: string) => {
      try {
        await deleteTicket(id)
        toast("Success", {
          description: "Ticket deleted successfully"
        })
      } catch (error) {
        console.log(error)
        toast("Error", {
          description: "Error deleting ticekt"
        })
      }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-8">
        <SheetHeader className="flex flex-row justify-between">
          <div>
            <SheetTitle className="text-2xl">{ticket.subject}</SheetTitle>
            <SheetDescription>Ticket ID: {ticket.id}</SheetDescription>
          </div>
          <DeleteConfirmAction 
            title="Delete Confirmation" 
            message="Are you sure you want to delete this ticket?"
            triggerButton={<Button disabled={!(user.role === UserRole.SUPERADMIN || user.role === UserRole.ADMIN)}
            variant="destructive">Delete</Button>}
            onConfirm={()=>handleDeleteTicket(ticket.id)}
          />
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Ticket Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Ticket Information</h3>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Select 
                disabled={isLoading}
                value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TicketStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div className="mt-2">
                  <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color} border-0`}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Category and Client */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <p className="mt-2 text-sm">{ticket.category}</p>
              </div>

              {ticket.client && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Client</label>
                  <p className="mt-2 text-sm">{ticket.client.fullName}</p>
                </div>
              )}
            </div>

            {/* Due Date */}
            {ticket.dueDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-sm">{formatDate(new Date(ticket.dueDate))}</p>
                  {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                </div>
              </div>
            )}

            {/* Assignee */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned To Employee
              </label>
              <Select value={selectedEmployeeAssignee} onValueChange={handleEmployeeAssignee} disabled={isLoading || !(user.role === UserRole.SUPERADMIN || user.role === UserRole.ADMIN)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Assign to user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {
                    employees?.data?.map((emp: EmployeesDataSchema)=> (
                      <SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned To Team
              </label>
              <Select
              value={selectedTeamAssignee}
              onValueChange={handleTeamAssignee}
              disabled={isLoading || !(user.role === UserRole.SUPERADMIN || user.role === UserRole.ADMIN)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Assign to team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teams?.map((team: TeamsDataSchema) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>

            {/* Description */}
            {ticket.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Comments Section */}
          <TicketCommentsSection ticketId={ticket.id} />

          <Separator />

          {/* Activity Log */}
          <TicketActivityLog ticketId={ticket.id} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

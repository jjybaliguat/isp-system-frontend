"use client"

import { useUpdateTicketMutation } from "@/redux/fetures/tickets-api-slice"
import { TicketDataSchema, TicketStatus } from "@/types/ticket"
import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { TicketCard } from "./ticket-card"
import { EmployeesDataSchema } from "@/types/employees"
import { TeamsDataSchema } from "@/types/teams"
import { Card } from "@/components/ui/card"
import { PencilIcon, Trash2Icon, TrashIcon } from "lucide-react"
import { useDeleteTeamMutation } from "@/redux/fetures/teams-api-slice"
import CreateTeamDialog from "../dialogs/create-team-dialog"
import { useUpdateEmployeeMutation } from "@/redux/fetures/employees-api-slice"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import { Button } from "./button"

interface KanbanColumnProps {
  team: TeamsDataSchema
  employees: EmployeesDataSchema[]
  draggedEmployee: EmployeesDataSchema | null
  onDragStart: (team: EmployeesDataSchema) => void
  onDragEnd: () => void
}


export function TeamsKanbanColumn({ team, employees, draggedEmployee, onDragStart, onDragEnd }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false)
  const [deleteTeam] = useDeleteTeamMutation()
  const [updateEmployee] = useUpdateEmployeeMutation()
  const [isEditing, setEditing] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)

    if (!draggedEmployee || draggedEmployee.team?.id === team.id) return

    try {
      // Optimistic update
      const response = await updateEmployee({
        id: draggedEmployee.id,
        data: { ...draggedEmployee, teamId: team.id }
      }).unwrap()

      console.log(response)

      toast("Success", {
        description: `Employee moved to ${team.name}`,
      })
    } catch (error) {
      toast("Error", {
        description: "Failed to moved employee",
      })
    }

    onDragEnd()
  }

  const handleDelete = async() => {
    if(window.confirm("Are you sure you want to delete this team?")){
      try {
        await deleteTeam({id: team.id}).unwrap

        toast("Success", {
          description: "Team delete ssuccessfully"
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleUnAssignToTeam = async(employeeId: string) => {
    try {
      await updateEmployee({
        id: employeeId,
        data: { id: employeeId, teamId: null } as EmployeesDataSchema
      }).unwrap()

      toast("Success", {
        description: "Employee unassigned from team",
      })
    } catch (error) {
      console.log(error)
      toast("Error", {
        description: "Failed to unassign employee",
      })
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-lg border-2 transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3>{team.name}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
            {employees.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DeleteConfirmAction
            title="Delete Confirmation" 
            message="Are you sure you want to delete this team? This can't be undone."
            triggerButton={<Trash2Icon className="text-destructive h-4 w-4 cursor-pointer" />}
            onConfirm={handleDelete}
          />
          <PencilIcon className="h-4 w-4 cursor-pointer" onClick={()=>setEditing(true)} />
        </div>
      </div>

      {/* Employees */}
        {employees.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">No Employees</div>
        ) : (
          employees.map((employee) => (
            <Card
              draggable
              onDragStart={()=>onDragStart(employee)}
              onDragEnd={onDragEnd}
              // onClick={() => setIsDetailsOpen(true)}
              className="relative pt-6 px-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
              key={employee.id}
            >
              <Button
                variant="destructive"
                className="absolute top-0 right-0 text-xs p-1 h-6 w-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleUnAssignToTeam(employee.id)}
              >
                remove
              </Button>
            <div className="flex items-center justify-between ">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-base text-foreground">
                    {employee.fullName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                    {employee.role || "No position assigned"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {employee.status && (
                    <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                        employee.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30"
                        }`}
                    >
                        {employee.status}
                    </span>
                    )}
                </div>
            </div>
          </Card>
          ))
        )}
      <CreateTeamDialog open={isEditing} onOpenChange={setEditing} isEditing={isEditing} team={team} />
    </div>
  )
}

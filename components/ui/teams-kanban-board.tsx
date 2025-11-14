"use client"

import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { TeamsDataSchema } from "@/types/teams"
import { useGetTeamsQuery } from "@/redux/fetures/teams-api-slice"
import { EmployeesDataSchema } from "@/types/employees"
import { TeamsKanbanColumn } from "./TeamsKanbanColumn"
import { useGetEmployeesQuery } from "@/redux/fetures/employees-api-slice"
import { Button } from "./button"
import CreateTeamDialog from "../dialogs/create-team-dialog"
import { PlusIcon } from "lucide-react"

interface KanbanBoardProps {
  employees: EmployeesDataSchema[]
}

export function TeamsKanbanBoard({ employees }: KanbanBoardProps) {
  const [draggedEmployee, setDraggedEmployee] = useState<EmployeesDataSchema | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const {data: teams} = useGetTeamsQuery()

  const getEmployees = (teamId: string) => {
    return employees.filter((employee) => employee.teamId === teamId)
  }

  const handleDragStart = (employee: EmployeesDataSchema) => {
    setDraggedEmployee(employee)
  }

  const handleDragEnd = () => {
    setDraggedEmployee(null)
  }

  return (
    <div className="overflow-x-auto pb-4">
        <Button className="mb-4"
          onClick={()=>setOpenDialog(true)}
        ><PlusIcon /> Create Team</Button>
        {teams && teams?.length > 0 ? (
            <div className="grid grid-cols-5 gap-4 min-w-max">
                {teams?.map((team) => (
                    <TeamsKanbanColumn
                        key={team.id}
                        team={team}
                        employees={getEmployees(team.id)}
                        draggedEmployee={draggedEmployee}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center mt-16 text-center space-y-4">
                <div className="rounded-lg border border-dashed border-muted-foreground/30 p-10 bg-muted/20">
                    <h1 className="text-lg font-semibold text-muted-foreground">
                    You don&apos;t have any teams yet
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                    Create your first team to start collaborating with others.
                    </p>
                    <Button className="mt-4" onClick={()=>setOpenDialog(true)}>Create Team</Button>
                </div>
            </div>
        )}
        <CreateTeamDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  )
}

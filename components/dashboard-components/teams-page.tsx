"use client"

import React, { useState } from 'react'
import { KanbanBoard } from '../ui/kanban-board'
import { useGetTeamsQuery } from '@/redux/fetures/teams-api-slice'
import { TeamsKanbanBoard } from '../ui/teams-kanban-board'
import { useGetEmployeesQuery } from '@/redux/fetures/employees-api-slice'

const TeamsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const {data, isLoading, error} = useGetEmployeesQuery({
    page: 1,
    limit: 100
  })

  const employeesData = data?.data || []

  return (
    <>
      <div className='mt-4'>
        <TeamsKanbanBoard employees={employeesData || []} />
      </div>
      {/* <CreateTeamDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} /> */}
    </>
  )
}

export default TeamsPage
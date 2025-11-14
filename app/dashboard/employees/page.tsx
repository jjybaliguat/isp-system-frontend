"use client"

import TeamsPage from '@/components/dashboard-components/teams-page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeesTableWrapper } from '@/components/wrapper/employees-table-wrapper'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { withRoleGuard } from '@/lib/withRoleGuard'
import React from 'react'

function EmployeesPage() {
  return (
    <PageWrapper 
        pageName='Employees Page'
        description='Manage your employees with ease'
    >
        <Tabs defaultValue="employees">
          <TabsList>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>
          <TabsContent value='employees'>
            <EmployeesTableWrapper />
          </TabsContent>
          <TabsContent value='teams'>
            <TeamsPage />
          </TabsContent>
        </Tabs>
    </PageWrapper>
  )
}

export default withRoleGuard(EmployeesPage, ["SUPERADMIN"])

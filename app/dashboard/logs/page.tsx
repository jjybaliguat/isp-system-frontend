"use client"

import LogsTableWrapper from '@/components/wrapper/logs-table-wrapper'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { UserRole } from '@/types/users'
import React from 'react'

const LogsPage = () => {
  return (
    <PageWrapper
        pageName='Logs'
        description='Track and review all system activities in real time.'
    >
        <LogsTableWrapper />
    </PageWrapper>
  )
}

export default withRoleGuard(LogsPage, {roles: [UserRole.SUPERADMIN]})
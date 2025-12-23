"use client"

import PageWrapper from '@/components/wrapper/page-wrapper'
import { UserstableWrapper } from '@/components/wrapper/users-table-wrapper'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { UserRole } from '@/types/users'
import React from 'react'

const UsersPage = () => {
  return (
    <PageWrapper
        pageName='Users Page'
        description='Manage your system users'
    >
        <UserstableWrapper />
    </PageWrapper>
  )
}

export default withRoleGuard(UsersPage, {roles: [UserRole.SUPERADMIN]})
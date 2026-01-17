"use client"

import SettingsCards from '@/components/cards/SettingsCards'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { UserRole } from '@/types/users'
import React from 'react'

const SettingsPage = () => {
  return (
    <PageWrapper
        pageName='Settings Page'
        description='Configure system&apos;s settings'
    >
        <SettingsCards />
    </PageWrapper>
  )
}

export default withRoleGuard(SettingsPage, {roles: [UserRole.SUPERADMIN]})
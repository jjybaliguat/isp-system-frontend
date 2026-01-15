"use client"

import { ApplicantsTableWrapper } from "@/components/wrapper/applicants-table-wrapper"
import PageWrapper from "@/components/wrapper/page-wrapper"
import { withRoleGuard } from "@/lib/withRoleGuard"
import { UserRole } from "@/types/users"

const ApplicantsPage = () => {
  return (
    <PageWrapper
      pageName="Applicants"
      description="Manage your applicants with ease"
    >
      <ApplicantsTableWrapper />
    </PageWrapper>
  )
}

export default withRoleGuard(ApplicantsPage, {roles: [UserRole.SUPERADMIN, UserRole.ADMIN]})

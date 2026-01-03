"use client"

import { BranchesTableWrapper } from "@/components/wrapper/branches-table-wrapper"
import PageWrapper from "@/components/wrapper/page-wrapper"
import { withRoleGuard } from "@/lib/withRoleGuard"
import { UserRole } from "@/types/users"

const Branches = () =>{
  return (
    <PageWrapper
      pageName="Branches"
      description="Manage your company&apos;s branch with ease"
    >
      <BranchesTableWrapper />
    </PageWrapper>
  )
}

export default withRoleGuard(Branches, {roles: [UserRole.SUPERADMIN], providerTypes: ["MAIN"]})

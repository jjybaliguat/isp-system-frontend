"use client"

import AccessDenied from "@/components/accessDenied"
import PageWrapper from "@/components/wrapper/page-wrapper"
import PppActiveTableWrapper from "@/components/wrapper/ppp-active-table-wrapper"
import { withRoleGuard } from "@/lib/withRoleGuard"
import { useAppSelector } from "@/redux/store/store"
import { UserRole } from "@/types/users"

const PPPMonitorPage = () => {
  const user = useAppSelector(store=>store.auth)

  if(user.providerType !== "MAIN") return <AccessDenied />

  return (

    <PageWrapper
      pageName="Mikrotik PPP Active"
      description="Monitor your mikrotik ppp clients' connection status with ease"
    >
        <PppActiveTableWrapper />
    </PageWrapper>

  )

}

export default withRoleGuard(PPPMonitorPage, {roles: [UserRole.SUPERADMIN, UserRole.ADMIN]})
"use client"

import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/redux/store/store"
import { useRouter } from "next/navigation"
import AccessDenied from "@/components/accessDenied"
import { UserRole } from "@/types/users"

export function withRoleGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    roles: UserRole[]
    providerTypes?: ("MAIN" | "BRANCH")[]
  }
) {
  const GuardedPage: React.FC<P> = (props) => {
    const user = useAppSelector((store) => store.auth)
    const router = useRouter()
    const [authorized, setAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
      // Not logged in → redirect to login
      if (!user?.accessToken) {
        router.replace("/login")
        return
      }

       // ❌ Role not allowed
      if (!options.roles?.includes(user.role as UserRole)) {
        setAuthorized(false)
        return
      }

      // ❌ Provider type not allowed (if specified)
      if (
        options.providerTypes &&
        !options.providerTypes.includes(user.providerType as "MAIN" | "BRANCH")
      ) {
        setAuthorized(false)
        return
      }

      // Authorized
      setAuthorized(true)
    }, [user])

    if (authorized === null) return null
    if (!authorized) {
      if(user.role === UserRole.INSTALLER_TECHNICIAN){
        router.push("/dashboard/assigned-tickets")
      }else{
        return <AccessDenied />
      }
    }

    return <WrappedComponent {...props} />
  }

  // Set display name for debugging in React DevTools
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || "Component"
  GuardedPage.displayName = `withRoleGuard(${wrappedName})`

  return GuardedPage
}

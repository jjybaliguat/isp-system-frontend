"use client"

import { ClientsTableWrapper } from "@/components/wrapper/clients-table-wrapper"
import PageWrapper from "@/components/wrapper/page-wrapper"

export default function ClientsPage() {
  return (
    <PageWrapper
      pageName="Clients"
      description="Manage your clients with ease"
    >
      <ClientsTableWrapper />
    </PageWrapper>
  )
}

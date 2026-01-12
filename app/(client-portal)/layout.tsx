import { ClientSidebar } from "@/components/client-portal/sidebar"
import { SiteHeader } from "@/components/dashboard-components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner"


export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
        <ClientSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    {children}
                    {/* <ClientPortalFab /> */}
                </div>
            </div>
        </SidebarInset>
        <Toaster />
    </SidebarProvider>
  )
}

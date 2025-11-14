import React, { ReactNode } from 'react'

interface PageWrapperProps {
    pageName: string,
    description?: string,
    children: ReactNode,
    icon?: ReactNode
}

const PageWrapper = ({pageName, description, icon, children} : PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-background z-40">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-foreground">{icon} {pageName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {children}
    </div>
  )
}

export default PageWrapper
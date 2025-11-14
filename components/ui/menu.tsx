// components/ui/menu.tsx
"use client"

import * as React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

// Root wrapper
export const Menu = DropdownMenu.Root

// Trigger button
export const MenuTrigger = DropdownMenu.Trigger

// Menu content
export const MenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Content
    ref={ref}
    className={cn(
      "z-50 min-w-[160px] rounded-md border bg-white p-1 shadow-md",
      className
    )}
    {...props}
  />
))
MenuContent.displayName = "MenuContent"

// Single menu item
export const MenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }
>(({ className, onSelect, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      "cursor-pointer select-none rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100",
      className
    )}
    onSelect={onSelect}
    {...props}
  />
))
MenuItem.displayName = "MenuItem"

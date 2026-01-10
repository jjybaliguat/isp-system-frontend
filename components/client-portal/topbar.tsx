"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { ThemeToggler } from "../ui/theme-toggler"
import { useAppSelector } from "@/redux/store/store"

export function Topbar() {
  const user = useAppSelector((store)=>store.auth)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background">
      <div className="flex h-full items-center justify-between px-4">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-tight">
            {user.fullName}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          <ThemeToggler />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

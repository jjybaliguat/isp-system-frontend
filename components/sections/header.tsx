'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggler } from '../ui/theme-toggler'
import { menuItems } from '@/app/constants/menuItems'
import { Logo } from '../ui/logo'

export const HeroHeader = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <header>
      <nav
        data-state={menuOpen && 'open'}
        className="fixed inset-x-0 top-0 z-50 border-b bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-3 lg:py-4">

            {/* LOGO */}
            <Link
              href="/"
              aria-label="Sierra Communications Home"
              className="flex items-center gap-2"
            >
              <Logo
                logoUrl="/images/sierra-logo.png"
                width={48}
                height={48}
              />
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold">
                  Sierra Communications
                </p>
                <p className="text-xs text-muted-foreground">
                  Fiber Internet Provider
                </p>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <ul className="hidden lg:flex items-center gap-8 text-sm">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ACTIONS */}
            <div className="hidden lg:flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild size="sm">
                <Link href="/apply">Check Availability</Link>
              </Button>

              <ThemeToggler />
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden"
            >
              {menuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          data-state={menuOpen && 'open'}
          className="lg:hidden data-[state=open]:block hidden border-t bg-background"
        >
          <div className="mx-auto max-w-6xl px-6 py-6 space-y-6">

            {/* NAV LINKS */}
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-base text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* MOBILE ACTIONS */}
            <div className="flex flex-col gap-3">
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild>
                <Link href="/apply">Check Availability</Link>
              </Button>

              <div className="pt-2">
                <ThemeToggler />
              </div>
            </div>

            {/* COVERAGE NOTE */}
            <p className="text-xs text-muted-foreground">
              Serving Montalban, Rizal
            </p>
          </div>
        </div>
      </nav>

      {/* SPACER FOR FIXED HEADER */}
      <div className="h-[72px]" />
    </header>
  )
}

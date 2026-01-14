import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from './header'

export default function HeroSection() {
  return (
    <>
      <HeroHeader />

      <main className="relative overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="relative py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              {/* TEXT */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-semibold leading-tight">
                  Fast & Reliable
                  <span className="block text-primary">
                    Fiber Internet
                  </span>
                </h1>

                <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  Sierra Communications delivers high-speed fiber internet
                  for homes and businesses in <strong>Montalban, Rizal</strong>.
                  Enjoy stable connectivity, local support, and transparent billing.
                </p>

                {/* STATS */}
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                  <div>
                    <p className="font-semibold">Pure Fiber</p>
                    <p className="text-muted-foreground">No Copper Lines</p>
                  </div>
                  <div>
                    <p className="font-semibold">99.9% Uptime</p>
                    <p className="text-muted-foreground">Reliable Network</p>
                  </div>
                  <div>
                    <p className="font-semibold">Local Support</p>
                    <p className="text-muted-foreground">Quick Response</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 lg:justify-start">
                  <Button asChild size="lg" className="px-6 text-base">
                    <Link href="#">
                      Check Availability
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="px-6 text-base"
                  >
                    <Link href="/login">
                      Login
                    </Link>
                  </Button>
                </div>
                {/* SCROLL INDICATOR */}
                    <p className="mt-16 text-xs text-muted-foreground animate-bounce text-center lg:text-left">
                    Scroll to view plans / check bills
                    </p>
              </div>


              {/* IMAGE */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-black/20 to-transparent" />
                <Image
                  src="/images/hero-pic.jpeg"
                  alt="Fiber internet infrastructure"
                  width={2000}
                  height={1500}
                  className="rounded-2xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* POWERED BY */}
        <section className="pb-16 md:pb-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-sm text-muted-foreground md:border-r md:pr-6">
                Powered By:
              </p>

              <Image
                src="/images/PTT-logo.jpg"
                alt="PT&T Logo"
                height={80}
                width={120}
                className="object-contain"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

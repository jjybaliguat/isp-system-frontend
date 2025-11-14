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
                <section className="py-20 md:py-32">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">

                            {/* TEXT BLOCK */}
                            <div className="text-center lg:text-left lg:w-1/2">
                                <h1 className="text-4xl md:text-6xl xl:text-7xl font-medium">
                                    Sierra Communications
                                </h1>

                                <p className="mt-6 text-lg max-w-xl mx-auto lg:mx-0">
                                    Empowering homes and businesses in Montalban, Rizal
                                    with fast, reliable fiber internet.
                                </p>

                                <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 lg:justify-start">
                                    <Button asChild size="lg" className="px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">Apply Now</span>
                                        </Link>
                                    </Button>

                                    <Button asChild size="lg" variant="ghost" className="px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">Check Bills</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* IMAGE BLOCK */}
                            <div className="w-full lg:w-1/2">
                                <Image
                                    src="/images/hero-pic.jpeg"
                                    alt="Abstract Object"
                                    width={2000}
                                    height={1500}
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                            </div>

                        </div>
                    </div>
                </section>

                {/* POWERED BY SECTION */}
                <section className="bg-background pb-16 md:pb-32">
                    <div className="m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Powered By</p>
                            </div>

                            <Image
                                src="/images/PTT-logo.jpg"
                                alt="pt&t-logo"
                                height={100}
                                width={100}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}

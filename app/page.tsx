import CallToAction from '@/components/sections/call-to-action'
import CheckBillSection from '@/components/sections/check-bill'
import ContactSection from '@/components/sections/contact'
import FooterSection from '@/components/sections/footer'
import HeroSection from '@/components/sections/hero-section'
import Pricing from '@/components/sections/pricing'
import SpeedTestSection from '@/components/sections/speedtest'
import React from 'react'

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CheckBillSection />
      <Pricing />
      <SpeedTestSection />
      <CallToAction />
      <ContactSection />
      <FooterSection />
    </>
  )
}

export default HomePage
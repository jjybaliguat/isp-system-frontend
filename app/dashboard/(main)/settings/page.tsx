import SettingsCards from '@/components/cards/SettingsCards'
import PageWrapper from '@/components/wrapper/page-wrapper'
import React from 'react'

const SettingsPage = () => {
  return (
    <PageWrapper
        pageName='Settings Page'
        description='Configure system&apos;s settings'
    >
        <SettingsCards />
    </PageWrapper>
  )
}

export default SettingsPage
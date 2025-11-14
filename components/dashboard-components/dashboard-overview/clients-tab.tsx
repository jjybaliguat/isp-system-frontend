import React from 'react'
import ClientsCards from './cards-overview/clients-cards'
import { CustomerTrendsChart } from '@/components/charts/customer-trend-chart'

const ClientsTabOverview = () => {
  return (
    <>
        <ClientsCards />
        <CustomerTrendsChart />
    </>
  )
}

export default ClientsTabOverview
"use client"

import React, { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGenerateSoaQuery } from "@/redux/fetures/clientApiSlice"
import { formatDate } from "@/utils/formatDate"

const SoaPage = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const searchParams = useSearchParams()

  const startDate = searchParams.get("startDate")!
  const endDate = searchParams.get("endDate")!

  const { data: soa, isLoading } = useGenerateSoaQuery(
    { clientId, startDate, endDate },
    { skip: !clientId }
  )

  const handlePrint = () => {
    setTimeout(() => window.print(), 100)
  }

  useEffect(() => {
    if (soa) {
      document.title = `SOA_${soa.client.fullName}_${new Date().toLocaleDateString()}`.replace(/\s+/g, "_")
    }
  }, [soa])

  if (isLoading) return <p>Loading SOA...</p>
  if (!soa) return <p>No SOA data found</p>

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 shadow print:container overflow-x-auto">
      {/* Header */}
      <header className="mb-6 w-full">
        {/* Top Row: Logo + Title */}
        <div className="flex justify-between items-center mb-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={soa.provider?.companyLogoUrl} // replace with your logo path
              alt="Company Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-right flex-grow">
            Statement of Account
          </h1>
        </div>

        {/* Bottom Row: Company Info + Client Info */}
        <div className="flex justify-between text-sm sm:text-base border-t border-b py-2">
          {/* Company Info */}
          <div className="flex-1 pr-4">
            <p className="font-bold">{soa.provider?.companyName}</p>
            <p>{soa.provider?.companyAddress}</p>
            <p>Phone: {soa.provider?.phoneNumber}</p>
            <p>Email: {soa.provider?.email}</p>
          </div>

          {/* Client Info */}
          <div className="flex-1 pl-4 text-right">
            <p className="font-medium">{soa.client.fullName}</p>
            <p>{soa.client.email} | {soa.client.phoneNumber}</p>
            <p>{soa.client.address}</p>
            <p>Period: {new Date(soa.period.start).toLocaleDateString()} - {new Date(soa.period.end).toLocaleDateString()}</p>
          </div>
        </div>
      </header>

      {/* Accounts */}
      {soa.statement.map((account) => (
        <section key={account.accountNumber} className="mb-6 break-inside-avoid">
          <h1>Installation Date: <span className="font-semibold">{formatDate(soa.client.installationDate)}</span></h1>
          <h2 className="font-semibold mb-2 text-sm sm:text-base">
            Account: {account.accountNumber} | Plan: {account.servicePlan}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Invoice #</th>
                  <th className="border px-2 py-1">Billing Date</th>
                  <th className="border px-2 py-1">Due Date</th>
                  <th className="border px-2 py-1">Period</th>
                  <th className="border px-2 py-1">Amount</th>
                  <th className="border px-2 py-1">Paid</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {account.billingHistory.map((bill, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{bill.invoiceNumber}</td>
                    <td className="border px-2 py-1">
                      {new Date(bill.billingDate).toLocaleDateString()}
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </td>
                    <td className="border px-2 py-1">{bill.period}</td>
                    <td className="border px-2 py-1">{bill.amount.toFixed(2)}</td>
                    <td className="border px-2 py-1">{bill.paidAmount.toFixed(2)}</td>
                    <td className="border px-2 py-1">{bill.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-end text-sm font-medium mt-2 gap-2">
            <span>Total Billed: {account.totalBilled.toFixed(2)}</span>
            <span>Total Paid: {account.totalPaid.toFixed(2)}</span>
            <span>Outstanding: {account.outstanding.toFixed(2)}</span>
          </div>
        </section>
      ))}

      <div className="flex justify-end gap-2 mt-4 print:hidden">
        <Button onClick={handlePrint}>Print / Download PDF</Button>
      </div>

      <footer className="mt-6 mb-2 text-sm text-center text-muted-foreground">
        <p>Generated at: {new Date(soa.generatedAt).toLocaleString()}</p>
        <p>System: Sierra Networks Inc. | Powered by ISP Client & Billing Management System</p>
        <p className="text-xs">This is a system-generated statement and does not require a signature.</p>
      </footer>

      {/* Print-specific styles */}
        <style jsx global>{`
          @media print {
            /* Show the company header on print */
            .print\\:company-header {
              display: block !important;
              width: 100%;
              margin-bottom: 10px;
            }

            /* Ensure the company header repeats on every page */
            @page {
              margin: 20mm;
            }

            body * {
              visibility: visible;
              background: #fff !important;
              color: #000 !important;
              -webkit-print-color-adjust: exact;
            }

            .print\\:hidden {
              display: none !important;
            }

            .print\\:container {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
            }

            /* Repeat company header at top of each page */
            .print\\:company-header {
              position: running(header);
            }

            table {
              border-collapse: collapse !important;
              width: 100% !important;
              font-size: 11pt;
              page-break-inside: auto;
              break-inside: auto;
            }

            thead {
              display: table-header-group;
            }

            tfoot {
              display: table-footer-group;
            }

            tr {
              page-break-inside: avoid !important;
              page-break-after: auto;
            }

            th,
            td {
              border: 1px solid #000 !important;
              padding: 6px 4px !important;
              font-weight: normal;
            }

            th {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }

            tbody tr:nth-child(odd) {
              background-color: #fafafa !important;
            }

            tbody tr:nth-child(even) {
              background-color: #fff !important;
            }

            section {
              page-break-inside: avoid;
              margin-bottom: 20px;
            }

            footer {
              position: fixed;
              bottom: 0;
              width: 100%;
              font-size: 10pt;
              text-align: center;
            }

            .overflow-x-auto {
              overflow-x: visible !important;
            }

            @media print and (max-width: 480px) {
              table, th, td {
                font-size: 10pt !important;
              }
            }
          }
        `}</style>

    </div>
  )
}

export default SoaPage

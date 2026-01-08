import { BillingDataSchema } from "@/types/billing"
import React, { forwardRef, useMemo } from "react"

interface InvoicePrintProps {
  billing: BillingDataSchema
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ billing }, ref) => {
    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)

    const formatDate = (date: Date | string) =>
      new Date(date).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

    /* =========================
       COMPUTED TOTALS
    ========================= */

    const chargesSubtotal = useMemo(() => {
      return (
        billing.billingCharges?.reduce(
          (sum, c) => sum + Number(c.amount || 0),
          0
        ) || 0
      )
    }, [billing.billingCharges])

    const totalDiscount = useMemo(() => {
      return (
        billing.discounts?.reduce(
          (sum, d) => sum + Number(d.amount || 0),
          0
        ) || 0
      )
    }, [billing.discounts])

    const grandTotal = Math.max(chargesSubtotal - totalDiscount, 0)

    const paidAmount = Number(billing.paidAmount || 0)
    const balanceDue = Math.max(grandTotal - paidAmount, 0)

    const billingTypeLabel = billing.billingType
      ?.replace(/_/g, " ")
      .toUpperCase()

    return (
      <div
        ref={ref}
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 40,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: "#333",
          lineHeight: 1.5,
        }}
      >
        {/* ================= HEADER ================= */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #000",
            paddingBottom: 10,
            marginBottom: 30,
          }}
        >
          <img
            src={billing.client.provider?.companyLogoUrl}
            alt={billing.client.provider?.companyName}
            style={{ height: 60, objectFit: "contain" }}
          />

          <div style={{ textAlign: "right" }}>
            <h1 style={{ margin: 0, fontSize: 24 }}>INVOICE</h1>
            <p style={{ margin: 0, fontSize: 16, fontWeight: "bold" }}>
              #{billing.invoiceNumber}
            </p>
            <p style={{ margin: 0, fontSize: 12 }}>{billingTypeLabel}</p>
          </div>
        </header>

        {/* ================= BILL TO ================= */}
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <div>
            <h3 style={{ marginBottom: 5 }}>Bill To:</h3>
            <p style={{ margin: 0 }}>{billing.client.fullName}</p>
            <p style={{ margin: 0 }}>{billing.client.email}</p>
            <p style={{ margin: 0 }}>
              Account #: {billing.account?.accountNumber}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Due Date:</strong> {formatDate(billing.dueDate)}
            </p>
            <p>
              <strong>Period:</strong> {billing.period}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {billing.status.replace(/_/g, " ")}
            </p>
          </div>
        </section>

        {/* ================= ITEMIZED TABLE ================= */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 30,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid #000",
                  padding: "10px 5px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "right",
                  borderBottom: "2px solid #000",
                  padding: "10px 5px",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Charges */}
            {billing.billingCharges?.map(c => (
              <tr key={c.id}>
                <td style={{ padding: "8px 5px" }}>{c.name}</td>
                <td style={{ padding: "8px 5px", textAlign: "right" }}>
                  {formatCurrency(c.amount)}
                </td>
              </tr>
            ))}

            {/* Subtotal */}
            <tr>
              <td
                style={{
                  padding: "8px 5px",
                  fontWeight: "bold",
                  borderTop: "1px solid #ccc",
                }}
              >
                Subtotal
              </td>
              <td
                style={{
                  padding: "8px 5px",
                  textAlign: "right",
                  fontWeight: "bold",
                  borderTop: "1px solid #ccc",
                }}
              >
                {formatCurrency(chargesSubtotal)}
              </td>
            </tr>

            {/* Discounts */}
            {billing.discounts?.map(d => (
              <tr key={d.id}>
                <td style={{ padding: "8px 5px" }}>
                  Discount – {d.description || "N/A"}
                </td>
                <td
                  style={{
                    padding: "8px 5px",
                    textAlign: "right",
                    color: "#c00",
                  }}
                >
                  -{formatCurrency(d.amount)}
                </td>
              </tr>
            ))}

            {/* Total */}
            <tr>
              <td
                style={{
                  padding: "10px 5px",
                  borderTop: "2px solid #000",
                  fontWeight: "bold",
                }}
              >
                TOTAL AMOUNT
              </td>
              <td
                style={{
                  padding: "10px 5px",
                  textAlign: "right",
                  borderTop: "2px solid #000",
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(grandTotal)}
              </td>
            </tr>

            {/* Payments */}
            {paidAmount > 0 && (
              <>
                <tr>
                  <td style={{ padding: "8px 5px" }}>Amount Paid</td>
                  <td style={{ padding: "8px 5px", textAlign: "right" }}>
                    {formatCurrency(paidAmount)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 5px",
                      fontWeight: "bold",
                    }}
                  >
                    Balance Due
                  </td>
                  <td
                    style={{
                      padding: "8px 5px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(balanceDue)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* ================= REMARKS ================= */}
        {billing.remarks && (
          <section style={{ marginBottom: 20 }}>
            <strong>Remarks:</strong>
            <p style={{ marginTop: 5 }}>{billing.remarks}</p>
          </section>
        )}

        {/* ================= FOOTER ================= */}
        <footer
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#666",
            borderTop: "1px solid #ccc",
            paddingTop: 10,
          }}
        >
          &copy; 2025 {billing.client.provider?.companyName}. All rights
          reserved.
          <br />
          {billing.client.provider?.companyAddress} |{" "}
          {billing.client.provider?.email} |{" "}
          {billing.client.provider?.phoneNumber}
        </footer>
      </div>
    )
  }
)

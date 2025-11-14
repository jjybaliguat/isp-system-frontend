import { BillingDataSchema } from "@/types/billing";
import React, { forwardRef } from "react";

interface InvoicePrintProps {
  billing: BillingDataSchema;
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ billing }, ref) => {
    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

    const formatDate = (date: string) =>
      new Date(date).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

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
        {/* HEADER */}
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
          <div>
            {/* Logo placeholder */}
            <img
              src={billing.client.provider?.companyLogoUrl}
              alt="Sierra Communications"
              style={{ height: 60, objectFit: "contain" }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <h1 style={{ margin: 0, fontSize: 24 }}>INVOICE</h1>
            <p style={{ margin: 0, fontSize: 16, fontWeight: "bold" }}>
              #{billing?.invoiceNumber}
            </p>
          </div>
        </header>

        {/* BILL TO / INFO */}
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <div>
            <h3 style={{ marginBottom: 5 }}>Bill To:</h3>
            <p style={{ margin: 0 }}>{billing?.client.fullName}</p>
            <p style={{ margin: 0 }}>{billing?.client.email}</p>
            <p style={{ margin: 0 }}>Account #: {billing?.client.accountNumber}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Billing Date:</strong> {formatDate(billing?.billingDate)}
            </p>
            <p>
              <strong>Due Date:</strong> {formatDate(billing?.dueDate)}
            </p>
            <p>
              <strong>Period:</strong> {billing?.period}
            </p>
            <p>
              <strong>Status:</strong> {billing?.status.replace(/_/g, " ")}
            </p>
          </div>
        </section>

        {/* ITEMIZED TABLE */}
        <section>
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
              <tr>
                <td style={{ padding: "10px 5px" }}>Billing Charges</td>
                <td style={{ padding: "10px 5px", textAlign: "right" }}>
                  {formatCurrency(billing?.amount)}
                </td>
              </tr>
              {billing?.description && (
                <tr>
                  <td style={{ padding: "10px 5px" }}>Notes</td>
                  <td style={{ padding: "10px 5px", textAlign: "right" }}>
                    {billing?.description}
                  </td>
                </tr>
              )}
              <tr>
                <td
                  style={{
                    padding: "10px 5px",
                    borderTop: "2px solid #000",
                    fontWeight: "bold",
                  }}
                >
                  Total Paid
                </td>
                <td
                  style={{
                    padding: "10px 5px",
                    textAlign: "right",
                    borderTop: "2px solid #000",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(billing?.paidAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#666",
            borderTop: "1px solid #ccc",
            paddingTop: 10,
          }}
        >
          &copy; 2025 {billing.client.provider?.companyName}. All rights reserved.  
          <br />
          {billing.client.provider?.companyAddress} | {billing.client.provider?.email} | {billing.client.provider?.phoneNumber}
        </footer>
      </div>
    );
  }
);

import PrintDownloadBtn from '@/components/PrintDownloadBtn';
import { PaymentDataSchema } from '@/types/billing';
import { formatDate } from '@/utils/formatDate';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ReceiptPageProps {
  params: { paymentId: string };
}

const maskEmail = (email: string | null) => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `**@${domain}`;
  return `${user[0]}****${user[user.length - 1]}@${domain}`;
};

const maskPhone = (phone: string) => {
  if (!phone) return '';
  if (phone.length <= 4) return '****';
  return `${phone.slice(0, 2)}****${phone.slice(-2)}`;
};

export default async function PaymentReceipt({ params }: ReceiptPageProps) {
  const { paymentId } = await params;

  const payment: PaymentDataSchema = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}`, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => {
      if (!res.ok) throw new Error('Payment not found');
      return res.json();
    })
    .catch(() => null);

  if (!payment) return notFound();

  const { client, billing } = payment;
  const {provider} = client || {};

  return (
    <div className="flex justify-center my-6">
      <div className="w-[360px] bg-white border border-gray-300 shadow-lg p-4 font-mono">
        {/* Header */}
          <Image
            src={provider?.companyLogoUrl || ''}
            alt="Company Logo"
            width={50}
            height={50}
            className="mx-auto mb-4"
          />
          <div className="text-center">
            <h1 className="text-sm text-gray-500">{provider?.companyName}</h1>
            <p className="text-sm text-gray-500">{provider?.companyAddress}</p>
          </div>
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Payment Receipt</h1>
          <p className="text-sm text-gray-500">System Generated</p>
        </div>

        <hr className="border-dashed border-t-2 my-2 border-gray-300" />

        {/* Client Info */}
        {client && (
          <section className="mb-2 text-sm">
            <h2 className="font-semibold border-b border-dashed mb-1">Client</h2>
            <p>Name: {client.fullName}</p>
            <p>Email: {maskEmail(client.email)}</p>
            <p>Phone: {maskPhone(client.phoneNumber)}</p>
          </section>
        )}

        <hr className="border-dashed border-t-2 my-2 border-gray-300" />

        {/* Payment Info */}
        <section className="mb-2 text-sm">
          <h2 className="font-semibold border-b border-dashed mb-1">Payment</h2>
          <p>Payment ID: {payment.id}</p>
          <p>Amount Paid: ₱{Number(payment.amount).toFixed(2)}</p>
          <p>Payment Date: {formatDate(payment.paidAt!)}</p>
          <p>Payment Method: {payment.paymentMethod}</p>
          <p>Reference #: {payment.referenceNumber}</p>
          <p>Received By: {payment.receivedBy}</p>
          {payment.paymentChannel && <p>Channel: {payment.paymentChannel}</p>}
          {payment.xenditInvoiceId && <p>Xendit Invoice ID: {payment.xenditInvoiceId}</p>}
          <p>Status: {payment.status}</p>
        </section>

        <hr className="border-dashed border-t-2 my-2 border-gray-300" />

        {/* Billing Info */}
        {billing && (
          <section className="mb-2 text-sm">
            <h2 className="font-semibold border-b border-dashed mb-1">Billing</h2>
            <p>Invoice #: {billing.invoiceNumber}</p>
            <p>Due Date: {formatDate(billing.dueDate)}</p>
            {/* <p>Billing Amount: ₱{billing.amount.toFixed(2)}</p> */}
          </section>
        )}

        <hr className="border-dashed border-t-2 my-2 border-gray-300" />

        <p className="text-xs text-center text-gray-500 mt-2">Thank you for your payment!</p>

        {/* Print / Download Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          <PrintDownloadBtn />
        </div>
      </div>
    </div>
  );
}
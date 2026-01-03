export default function SoaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white">
      {children}
    </div>
  )
}

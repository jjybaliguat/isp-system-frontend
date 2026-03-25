export default function SoaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen print:bg-white">
      {children}
    </div>
  )
}

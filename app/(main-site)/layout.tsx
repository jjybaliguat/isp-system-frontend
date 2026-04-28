import WebsiteModal from "@/components/dialogs/main-site-dialog";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebsiteModal />
      {children}
    </>
  );
}
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  // Login page renders its own chrome.
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell email={session.email}>{children}</AdminShell>;
}

import { requireAuth } from "@/lib/dal";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatarColor,
      }}
    >
      {children}
    </DashboardShell>
  );
}
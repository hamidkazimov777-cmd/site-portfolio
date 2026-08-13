import { SessionProvider } from "@/components/session-provider";
import { AdminSidebar } from "@/components/admin/sidebar";
import { auth } from "@/lib/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}

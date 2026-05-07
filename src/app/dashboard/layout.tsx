import Sidebar from "@/components/Sidebar";
import { getUser } from "@/lib/get-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white shrink-0">
        <Sidebar user={user ?? null} />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-slate-950 text-white p-6 min-h-screen overflow-auto">
        {children}
      </main>

    </div>
  );
}
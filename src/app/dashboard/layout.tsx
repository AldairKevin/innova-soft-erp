import Sidebar from "@/components/Sidebar";
import { getUser } from "@/lib/get-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="hidden lg:flex">
        <Sidebar user={user ?? null} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <header className="h-20 border-b border-slate-800 bg-black/30 backdrop-blur-xl px-8 flex items-center justify-between shrink-0">

          <div>
            <h1 className="text-2xl font-black">
              InnovaSoft ERP 🚀
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Plataforma empresarial inteligente
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white">
                {user?.name?.charAt(0) ?? "U"}
              </div>

              <div>
                <p className="font-semibold text-sm">
                  {user?.name ?? "Usuario"}
                </p>

                <p className="text-xs text-slate-400">
                  {user?.role ?? "SIN ROL"}
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">

          <div className="p-6 lg:p-8">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}
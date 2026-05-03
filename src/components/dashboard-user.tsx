import { getUser } from "@/lib/get-user";

import LogoutButton from "./logout-button";

export default async function DashboardUser() {

  const user: any = await getUser();

  return (

    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">

      <p className="text-sm text-slate-400">
        Usuario conectado
      </p>

      <h2 className="text-lg font-bold mt-1">
        {user?.email}
      </h2>

      <p className="text-blue-400 text-sm mt-1">
        Rol: {user?.role}
      </p>

      <LogoutButton />

    </div>

  );

}
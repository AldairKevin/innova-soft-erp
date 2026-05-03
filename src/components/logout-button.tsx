"use client";

import { useRouter } from "next/navigation";

import { logoutUser } from "@/app/actions/auth";

export default function LogoutButton() {

  const router = useRouter();

  async function handleLogout() {

    await logoutUser();

    router.push("/login");

  }

  return (

    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded mt-4"
    >
      Cerrar sesión
    </button>

  );

}
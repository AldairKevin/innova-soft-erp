import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

async function getData(token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // 1. Extraemos el texto/json real que devuelve la API o el Proxy
    const errorBody = await res.text(); 
    
    // 2. Lo imprimimos en los logs de Vercel
    console.error("🔥 ERROR REAL DE LA API:", {
      url: url,
      status: res.status,
      body: errorBody
    });

    throw new Error("Error al obtener datos del dashboard");
  }

  return res.json();
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const data = await getData(token);

  return <DashboardClient data={data} />;
}
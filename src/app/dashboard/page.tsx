import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

async function getData(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
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
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
    const errorBody = await res.text(); 
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
  // 1. En Next.js 15 usamos await cookies() directamente, sin try/catch, 
  // para no bloquear el enrutamiento dinámico interno del framework.
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 2. Si no hay token, redirect() lanza una excepción controlada por Next.js
  if (!token || token.trim() === "") {
    redirect("/login");
  }

  // 3. Protegemos SOLO nuestra obtención de datos para evitar la pantalla gris en móviles
  try {
    const data = await getData(token);
    return <DashboardClient data={data} />;
  } catch (error) {
    console.error("🚨 Error en el renderizado del Dashboard:", error);
    
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#dc2626", fontSize: "20px", marginBottom: "10px" }}>
          Sesión inválida o expirada
        </h2>
        <p style={{ color: "#4b5563", marginBottom: "20px" }}>
          Hubo un problema de conexión con el dispositivo. Por favor, vuelve a iniciar sesión.
        </p>
        <a 
          href="/login" 
          style={{ 
            backgroundColor: "#2563eb", 
            color: "white", 
            padding: "10px 20px", 
            borderRadius: "6px", 
            textDecoration: "none",
            fontWeight: "500"
          }}
        >
          Ir al Login
        </a>
      </div>
    );
  }
}
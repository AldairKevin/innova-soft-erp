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
  let token: string | undefined = undefined;

  try {
    // Leemos las cookies de forma compatible (funcione como promesa o como función directa)
    const cookieStore = cookies();
    
    // Si maneja la API moderna asíncrona, resolvemos la promesa; si no, extraemos el valor directo
    if (cookieStore instanceof Promise) {
      const resolvedStore = await cookieStore;
      token = resolvedStore.get("token")?.value;
    } else {
      token = cookieStore.get("token")?.value;
    }
  } catch (cookieError) {
    console.error("🚨 Error crítico al leer cookies en el servidor:", cookieError);
  }

  // Si el token no existe o está vacío, redirigimos limpiamente al Login
  if (!token || token === "undefined" || token.trim() === "") {
    redirect("/login");
  }

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
          Hubo un problema al autenticar tu dispositivo. Por favor, vuelve a iniciar sesión.
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
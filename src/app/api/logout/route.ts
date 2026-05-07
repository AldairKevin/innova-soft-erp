import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout exitoso" });

  // 🔥 eliminar cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // 👈 esto la borra
    path: "/",
  });

  return response;
}
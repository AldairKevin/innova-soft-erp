"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function logoutUser() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    expires: new Date(0),
    path: "/",
  });
}

export async function login(
email: string,
password: string
) {
try {

const user = await prisma.user.findUnique({
  where: {
    email: email,
  },
});

if (!user) {
  return {
    success: false,
    error: "Usuario no encontrado",
  };
}

const validPassword = await bcrypt.compare(
  password,
  user.password
);

if (!validPassword) {
  return {
    success: false,
    error: "Contraseña incorrecta",
  };
}

const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET || "secret",
  {
    expiresIn: "7d",
  }
);

const cookieStore = await cookies();

cookieStore.set("token", token, {
  httpOnly: true,
  secure: false,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return {
  success: true,
};

} catch (error) {

console.log(error);

return {
  success: false,
  error: "Error interno",
};

}
}

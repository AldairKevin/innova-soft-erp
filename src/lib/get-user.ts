import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUser() {

  try {

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {

      return null;

    }

    const user = jwt.verify(
      token,
      JWT_SECRET
    );

    return user;

  } catch (error) {

    return null;

  }

}
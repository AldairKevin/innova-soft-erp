import { redirect } from "next/navigation";
import { getUser } from "./get-user";

export async function requireAdmin() {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}
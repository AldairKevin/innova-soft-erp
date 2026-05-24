import { prisma } from "@/lib/prisma";

export async function getCompany() {
  // Cambiado de prisma.company a prisma.business
  const result = await prisma.business.findFirst(); 
  return result;
}
"use server";

import bcrypt from "bcryptjs";

export async function testHash() {

  const hash = await bcrypt.hash("123456", 10);

  console.log(hash);

}
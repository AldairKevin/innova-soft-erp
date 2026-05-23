import pool from "@/lib/db";

export async function getCompany() {
  const result = await pool.query(`
    SELECT * FROM company
    LIMIT 1
  `);

  return result.rows[0];
}
export async function getDashboardData(token: string) {
  // MOCK temporal para que tu app arranque
  return {
    productos: 10,
    stock: 50,
    ventas: 20,
    hoy: 5,
    usuarios: 100,
    chart: [
      { date: "2026-01", total: 10 },
      { date: "2026-02", total: 20 }
    ]
  };
}
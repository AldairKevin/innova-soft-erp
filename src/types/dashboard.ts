export type DashboardData = {
  productos: number;
  stock: number;
  ventas: number;
  hoy: number;
  usuarios: number;
  chart: {
    date: string;
    total: number;
  }[];
};
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#0f172a', color: 'white', padding: '30px' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '40px' }}>INNOVASOFT</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Usamos Link para que el POS funcione */}
          <Link href="/dashboard/pos" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', cursor: 'pointer' }}>
              🛒 Ventas (POS)
            </div>
          </Link>

          <Link href="/dashboard/inventory" style={{ textDecoration: 'none', color: '#94a3b8' }}>
            <div style={{ padding: '10px', cursor: 'pointer' }}>
              📦 Inventario
            </div>
          </Link>

          {/* ESTE ES EL BOTÓN QUE REVIVIRÁ TUS REPORTES */}
          <Link href="/dashboard/reports" style={{ textDecoration: 'none', color: '#94a3b8' }}>
            <div style={{ padding: '10px', cursor: 'pointer' }}>
              📊 Reportes
            </div>
          </Link>

          <div style={{ padding: '10px', color: '#94a3b8', cursor: 'pointer' }}>
            ⚙️ Configuración
          </div>
        </nav>
      </aside>

      {/* Contenido Dinámico */}
      <main style={{ flex: 1 }}>
        <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 40px', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b' }}>Sucursal Central - Terminal 01</span>
          <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Usuario: KEVIN</span>
        </header>
        
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
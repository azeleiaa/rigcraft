import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const pageCopy: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Ringkasan performa toko RigCraft hari ini.',
  },
  '/pesanan': {
    title: 'Pesanan',
    subtitle: 'Pantau dan kelola pesanan pelanggan.',
  },
  '/produk': {
    title: 'Produk',
    subtitle: 'Kelola katalog dan ketersediaan stok.',
  },
  '/pelanggan': {
    title: 'Pelanggan',
    subtitle: 'Kenali pelanggan dan aktivitas belanja mereka.',
  },
  '/laporan': {
    title: 'Laporan',
    subtitle: 'Analisis penjualan dan performa bisnis.',
  },
  '/pengaturan': {
    title: 'Pengaturan',
    subtitle: 'Atur preferensi dan informasi toko.',
  },
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const page = pageCopy[pathname] ?? pageCopy['/dashboard']

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="sidebar-backdrop" type="button" onClick={() => setSidebarOpen(false)} aria-label="Tutup navigasi" />}
      <div className="main-area">
        <Header title={page.title} subtitle={page.subtitle} onMenuToggle={() => setSidebarOpen((open) => !open)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
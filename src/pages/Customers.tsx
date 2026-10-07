import { useState } from 'react'
import { downloadCsv, Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

const customers = [
  { name: 'Budi Santoso', email: 'budi.santoso@email.com', orders: 12, spent: 'Rp 68.450.000', joined: '12 Feb 2026', segment: 'VIP' },
  { name: 'Rina Wijaya', email: 'rina.wijaya@email.com', orders: 8, spent: 'Rp 42.180.000', joined: '04 Mar 2026', segment: 'VIP' },
  { name: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', orders: 5, spent: 'Rp 31.999.000', joined: '19 Apr 2026', segment: 'Reguler' },
  { name: 'Siti Nurhaliza', email: 'siti.nurhaliza@email.com', orders: 4, spent: 'Rp 28.540.000', joined: '23 Mei 2026', segment: 'Reguler' },
  { name: 'Dian Prasetyo', email: 'dian.prasetyo@email.com', orders: 3, spent: 'Rp 18.999.000', joined: '08 Jun 2026', segment: 'Reguler' },
  { name: 'Reza Mahendra', email: 'reza.mahendra@email.com', orders: 7, spent: 'Rp 53.275.000', joined: '27 Jan 2026', segment: 'VIP' },
]

export default function Customers() {
  const [query, setQuery] = useState('')
  const filteredCustomers = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="page-stack">
      <section className="stats-grid customer-stats">
        <article className="stat-card">
            <p className="stat-card-label">TOTAL PELANGGAN</p>
            <p className="stat-card-value">2.486</p>
            <p className="stat-card-change positive"><Icon name="trend" /> +8,4%<span>kuartal ini</span></p></article>
        <article className="stat-card"><p className="stat-card-label">PELANGGAN BARU</p><p className="stat-card-value">326</p><p className="stat-card-change positive"><Icon name="trend" /> +5,7%<span>bulan ini</span></p></article>
        <article className="stat-card"><p className="stat-card-label">PELANGGAN VIP</p><p className="stat-card-value">184</p><p className="stat-card-change positive"><Icon name="trend" /> +12,1%<span>bulan ini</span></p></article>
      </section>
      <section className="card table-card">
        <PanelHeader title="Pelanggan" note="Data pelanggan contoh berdasarkan aktivitas toko" action={<span className="customer-total"><Icon name="users" /> 2.486 pelanggan</span>} />
        <div className="table-toolbar"><div className="toolbar-search"><Icon name="search" /><input aria-label="Cari pelanggan" placeholder="Cari nama atau email" value={query} onChange={(event) => setQuery(event.target.value)} /></div><button className="btn btn-outline" type="button" onClick={() => downloadCsv('rigcraft-pelanggan.csv', [['Nama', 'Email', 'Pesanan', 'Total belanja', 'Bergabung', 'Segmen'], ...filteredCustomers.map((customer) => [customer.name, customer.email, customer.orders, customer.spent, customer.joined, customer.segment])])}><Icon name="download" /> Ekspor</button></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Nama pelanggan</th><th>Pesanan</th><th>Total belanja</th><th>Bergabung</th><th>Segmen</th><th aria-label="Aksi" /></tr></thead><tbody>{filteredCustomers.length ? filteredCustomers.map((customer) => <tr key={customer.email}><td><div className="customer-cell"><span className="customer-avatar">{customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><span className="cell-primary">{customer.name}</span><span className="cell-secondary">{customer.email}</span></span></div></td><td>{customer.orders}</td><td className="price">{customer.spent}</td><td className="text-secondary">{customer.joined}</td><td><StatusBadge status={customer.segment} /></td><td><button className="action-icon" aria-label={`Opsi ${customer.name}`} title="Opsi pelanggan" type="button"><Icon name="more" /></button></td></tr>) : <tr><td className="empty-state" colSpan={6}>Pelanggan tidak ditemukan.</td></tr>}</tbody></table></div>
        <div className="pagination"><span className="pagination-info">Menampilkan {filteredCustomers.length} data contoh</span><div className="pagination-buttons"><button className="pagination-btn active" type="button">1</button></div></div>
      </section>
    </div>
  )
}
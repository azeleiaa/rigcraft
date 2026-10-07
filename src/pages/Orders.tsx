import { useState } from 'react'
import { allOrders, orderStatusCounts } from '../data/dummyData'
import { downloadCsv, Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

const filters = [
  { label: 'Semua', value: 'Semua' },
  { label: 'Menunggu', value: 'Menunggu' },
  { label: 'Diproses', value: 'Diproses' },
  { label: 'Dikirim', value: 'Dikirim' },
  { label: 'Selesai', value: 'Selesai' },
  { label: 'Dibatalkan', value: 'Dibatalkan' },
]

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [query, setQuery] = useState('')
  const visibleOrders = allOrders.filter((order) => {
    const matchesStatus = activeFilter === 'Semua' || order.status.includes(activeFilter)
    const searchable = `${order.id} ${order.customer} ${order.product}`.toLowerCase()
    return matchesStatus && searchable.includes(query.trim().toLowerCase())
  })

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div className="toolbar-search"><Icon name="search" /><input aria-label="Cari pesanan" placeholder="Cari ID, pelanggan, atau produk" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <button className="btn btn-outline" type="button" onClick={() => downloadCsv('rigcraft-pesanan.csv', [['ID Pesanan', 'Pelanggan', 'Produk', 'Tanggal', 'Total', 'Status'], ...visibleOrders.map((order) => [order.id, order.customer, order.product, order.date, order.total, order.status])])}><Icon name="download" /> Ekspor</button>
      </div>
      <div className="filter-tabs order-filters" role="tablist" aria-label="Filter status pesanan">
        {filters.map((filter) => (
          <button className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`} key={filter.value} onClick={() => setActiveFilter(filter.value)} type="button" role="tab" aria-selected={activeFilter === filter.value}>
            {filter.label}<span className="count">{orderStatusCounts[filter.value as keyof typeof orderStatusCounts]}</span>
          </button>
        ))}
      </div>
      <section className="card table-card">
        <PanelHeader title="Daftar pesanan" note={`${visibleOrders.length} pesanan contoh ditampilkan dari data terbaru`} />
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>ID Pesanan</th><th>Pelanggan</th><th>Produk</th><th>Tanggal</th><th>Total</th><th>Status</th><th aria-label="Aksi" /></tr></thead>
            <tbody>{visibleOrders.length ? visibleOrders.map((order) => (
              <tr key={order.id}><td><span className="order-id">{order.id}</span></td><td><span className="cell-primary">{order.customer}</span></td><td className="text-secondary">{order.product}</td><td className="text-secondary">{order.date}</td><td className="price">{order.total}</td><td><StatusBadge status={order.status} /></td><td><button className="action-icon" aria-label={`Opsi ${order.id}`} title="Opsi pesanan" type="button"><Icon name="more" /></button></td></tr>
            )) : <tr><td className="empty-state" colSpan={7}>Tidak ada pesanan yang cocok dengan pencarian ini.</td></tr>}</tbody>
          </table>
        </div>
        <div className="pagination"><span className="pagination-info">Menampilkan {visibleOrders.length} dari {allOrders.length} data contoh</span><div className="pagination-buttons"><button className="pagination-btn disabled" aria-label="Halaman sebelumnya" type="button">‹</button><button className="pagination-btn active" type="button">1</button><button className="pagination-btn disabled" aria-label="Halaman berikutnya" type="button">›</button></div></div>
      </section>
    </div>
  )
}
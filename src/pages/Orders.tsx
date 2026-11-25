import { useEffect, useState } from 'react'
import { adminApi } from '../lib/api'
import { orderView, type OrderView } from '../lib/adminMapper'
import { formatRupiah } from '../storefront/data'
import { downloadCsv, Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

const filters = ['Semua', 'Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan']
const statusOptions = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan']

export default function Orders() {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [query, setQuery] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.getOrders()
      setOrders((res.data ?? []).map(orderView))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat pesanan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function changeStatus(order: OrderView, status: string) {
    if (status === order.status) return
    if (status === 'Dibatalkan' && !window.confirm(`Batalkan pesanan ${order.number}? Stok akan dikembalikan.`)) return
    setUpdatingId(order.id)
    setNotice('')
    try {
      await adminApi.updateOrderStatus(order.id, status)
      setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status } : item)))
      setNotice(`Status ${order.number} diubah menjadi ${status}.`)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal mengubah status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const countFor = (filter: string) => (filter === 'Semua' ? orders.length : orders.filter((order) => order.status.includes(filter)).length)

  const visibleOrders = orders.filter((order) => {
    const matchesStatus = activeFilter === 'Semua' || order.status.includes(activeFilter)
    const searchable = `${order.number} ${order.customer} ${order.product}`.toLowerCase()
    return matchesStatus && searchable.includes(query.trim().toLowerCase())
  })

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div className="toolbar-search"><Icon name="search" /><input aria-label="Cari pesanan" placeholder="Cari ID, pelanggan, atau produk" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => downloadCsv('rigcraft-pesanan.csv', [['ID Pesanan', 'Pelanggan', 'Produk', 'Tanggal', 'Total', 'Status'], ...visibleOrders.map((order) => [order.number, order.customer, order.product, order.date, formatRupiah(order.total), order.status])])}
        >
          <Icon name="download" /> Ekspor
        </button>
      </div>

      <div className="filter-tabs order-filters" role="tablist" aria-label="Filter status pesanan">
        {filters.map((filter) => (
          <button className={`filter-tab ${activeFilter === filter ? 'active' : ''}`} key={filter} onClick={() => setActiveFilter(filter)} type="button" role="tab" aria-selected={activeFilter === filter}>
            {filter}<span className="count">{countFor(filter)}</span>
          </button>
        ))}
      </div>

      {notice && <section className="card" role="status"><p className="intro-copy">{notice}</p></section>}

      <section className="card table-card">
        <PanelHeader title="Daftar pesanan" note={loading ? 'Memuat pesanan...' : `${visibleOrders.length} pesanan ditampilkan`} />
        {error ? (
          <div><p className="intro-copy">{error}</p><button className="btn btn-outline" type="button" onClick={load}>Coba lagi</button></div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>ID Pesanan</th><th>Pelanggan</th><th>Produk</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Ubah status</th></tr></thead>
              <tbody>
                {visibleOrders.length ? visibleOrders.map((order) => (
                  <tr key={order.id || order.number}>
                    <td><span className="order-id">{order.number}</span></td>
                    <td><span className="cell-primary">{order.customer}</span></td>
                    <td className="text-secondary">{order.product}</td>
                    <td className="text-secondary">{order.date}</td>
                    <td className="price">{formatRupiah(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>
                      <select
                        aria-label={`Ubah status ${order.number}`}
                        value={statusOptions.includes(order.status) ? order.status : ''}
                        disabled={updatingId === order.id}
                        onChange={(event) => changeStatus(order, event.target.value)}
                        style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 3, padding: '4px 6px', fontSize: 12 }}
                      >
                        {!statusOptions.includes(order.status) && <option value="" disabled>{order.status}</option>}
                        {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                )) : <tr><td className="empty-state" colSpan={7}>{loading ? 'Memuat...' : 'Tidak ada pesanan yang cocok dengan pencarian ini.'}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination"><span className="pagination-info">Menampilkan {visibleOrders.length} dari {orders.length} pesanan</span></div>
      </section>
    </div>
  )
}
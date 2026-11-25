import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../lib/api'
import { orderView, type OrderView } from '../lib/adminMapper'
import { formatRupiah } from '../storefront/data'
import { Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

const icons = ['wallet', 'cart', 'package', 'users'] as const

function statValue(stat: any) {
  const value = stat?.value
  if (typeof value === 'number') {
    const label = String(stat.label ?? stat.title ?? stat.name ?? '').toLowerCase()
    return /pendapatan|revenue|penjualan|omzet/.test(label) ? formatRupiah(value) : value.toLocaleString('id-ID')
  }
  return String(value ?? '-')
}

function shortDay(raw: unknown) {
  const text = String(raw ?? '')
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return new Date(text).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }
  return text
}

function shortMoney(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace('.', ',')} jt`
  if (value >= 1_000) return `${Math.round(value / 1_000)} rb`
  return String(value)
}

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([])
  const [chart, setChart] = useState<{ label: string; value: number }[]>([])
  const [distribution, setDistribution] = useState<{ label: string; value: number }[]>([])
  const [recent, setRecent] = useState<OrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res: any = await adminApi.getStats()
      const d = res?.data ?? res
      console.log('ADMIN STATS:', d)

      setStats(Array.isArray(d?.stats) ? d.stats : [])

      const sales = Array.isArray(d?.salesChart) ? d.salesChart : []
      setChart(
        sales.map((item: any) => ({
          label: shortDay(item.label ?? item.day ?? item.date ?? item.name),
          value: Number(item.value ?? item.total ?? item.revenue ?? item.sales ?? item.amount ?? 0),
        })),
      )

      const dist = d?.categoryDistribution
      const distEntries: any[] = Array.isArray(dist)
        ? dist
        : dist && typeof dist === 'object'
          ? Object.entries(dist).map(([label, value]) => ({ label, value }))
          : []
      setDistribution(
        distEntries.map((item: any) => ({
          label: String(item.category ?? item.name ?? item.label ?? '-'),
          value: Number(item.count ?? item.value ?? item.total ?? 0),
        })),
      )

      setRecent((Array.isArray(d?.recentOrders) ? d.recentOrders : []).map(orderView))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const highest = Math.max(1, ...chart.map((row) => row.value))
  const chartTotal = chart.reduce((sum, row) => sum + row.value, 0)
  const highestDist = Math.max(1, ...distribution.map((row) => row.value))
  const monthLabel = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()

  if (loading) return <div className="page-stack"><section className="card"><p className="intro-copy">Memuat data dashboard...</p></section></div>

  if (error) {
    return (
      <div className="page-stack">
        <section className="card">
          <p className="intro-copy">{error}</p>
          <button className="btn btn-outline" type="button" onClick={load}>Coba lagi</button>
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <div className="dashboard-intro">
        <div>
          <p className="eyebrow">PERFORMA TOKO <span>·</span> {monthLabel}</p>
          <p className="intro-copy">Ringkasan operasional dari data pesanan terbaru.</p>
        </div>
        <button className="btn btn-outline" type="button" onClick={load}><Icon name="calendar" /> Muat ulang</button>
      </div>

      <section className="stats-grid" aria-label="Ringkasan performa">
        {stats.map((stat, index) => (
          <article className={`stat-card animate-fade-in-up animate-delay-${(index % 4) + 1}`} key={String(stat.label ?? stat.title ?? index)}>
            <div className="stat-card-top">
              <p className="stat-card-label">{String(stat.label ?? stat.title ?? stat.name ?? '-')}</p>
              <span className={`stat-icon stat-icon-${index % 4}`}><Icon name={icons[index % 4]} /></span>
            </div>
            <p className="stat-card-value">{statValue(stat)}</p>
            {stat.change !== undefined && stat.change !== null && stat.change !== '' && (
              <p className={`stat-card-change ${stat.changeType ?? ''}`}><Icon name="trend" /> {String(stat.change)}<span>{stat.changeLabel ?? ''}</span></p>
            )}
          </article>
        ))}
      </section>

      <div className="content-grid">
        <section className="card">
          <PanelHeader title="Pendapatan" note="Tren penjualan 7 hari terakhir" action={<span className="chart-total">{shortMoney(chartTotal)}</span>} />
          <div className="chart-summary"><strong>{formatRupiah(chartTotal)}</strong><span><small>7 hari terakhir</small></span></div>
          {chart.length === 0 ? (
            <p className="intro-copy">Belum ada data penjualan.</p>
          ) : (
            <div className="bar-chart month-chart" role="img" aria-label="Grafik pendapatan 7 hari terakhir">
              {chart.map((row, index) => (
                <div className="bar-chart-item" key={`${row.label}-${index}`}>
                  <span className="bar-chart-value">{shortMoney(row.value)}</span>
                  <div className={`bar-chart-bar ${index === chart.length - 1 ? 'is-current' : ''}`} style={{ height: `${(row.value / highest) * 100}%` }} />
                  <span className="bar-chart-label">{row.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <PanelHeader title="Distribusi kategori" note="Sebaran data per kategori" action={<Link className="link-cyan" to="/produk">Lihat katalog <Icon name="arrow" /></Link>} />
          {distribution.length === 0 ? (
            <p className="intro-copy">Belum ada data kategori.</p>
          ) : (
            <div className="progress-list">
              {distribution.map((row, index) => (
                <div className="progress-item" key={row.label}>
                  <div className="progress-item-header"><span className="progress-item-rank">{String(index + 1).padStart(2, '0')}</span><span className="progress-item-label">{row.label}</span><span className="progress-item-value">{row.value}</span></div>
                  <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${(row.value / highestDist) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <PanelHeader title="Pesanan terbaru" note="Aktivitas transaksi terkini" action={<Link className="link-cyan" to="/pesanan">Semua pesanan <Icon name="arrow" /></Link>} />
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>ID Pesanan</th><th>Pelanggan</th><th>Produk</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {recent.length ? recent.slice(0, 5).map((order) => (
                <tr key={order.id || order.number}>
                  <td><span className="order-id">{order.number}</span></td>
                  <td>{order.customer}</td>
                  <td className="text-secondary">{order.product}</td>
                  <td className="text-secondary">{order.date}</td>
                  <td className="price">{formatRupiah(order.total)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              )) : <tr><td className="empty-state" colSpan={6}>Belum ada pesanan.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
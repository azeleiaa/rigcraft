import { dashboardStats, monthlySalesData, recentOrders, topProducts } from '../data/dummyData'
import { Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

export default function Dashboard() {
  const highestMonth = Math.max(...monthlySalesData.map((month) => month.value))

  return (
    <div className="page-stack">
      <div className="dashboard-intro">
        <div>
          <p className="eyebrow">PERFORMA TOKO <span>·</span> SEPTEMBER 2026</p>
          <p className="intro-copy">Penjualan tetap bergerak kuat. Berikut ringkasan operasional bulan ini.</p>
        </div>
        <button className="btn btn-outline" type="button"><Icon name="calendar" /> Bulan ini</button>
      </div>

      <section className="stats-grid" aria-label="Ringkasan performa">
        {dashboardStats.map((stat, index) => {
          const icons = ['wallet', 'cart', 'package', 'users'] as const
          return (
            <article className={`stat-card animate-fade-in-up animate-delay-${index + 1}`} key={stat.label}>
              <div className="stat-card-top">
                <p className="stat-card-label">{stat.label}</p>
                <span className={`stat-icon stat-icon-${index}`}><Icon name={icons[index]} /></span>
              </div>
              <p className="stat-card-value">{stat.value}</p>
              <p className={`stat-card-change ${stat.changeType}`}><Icon name="trend" /> {stat.change}<span>{stat.changeLabel}</span></p>
            </article>
          )
        })}
      </section>

      <div className="content-grid">
        <section className="card">
          <PanelHeader title="Pendapatan" note="Tren penjualan 6 bulan terakhir" action={<span className="chart-total">Rp 487,5 jt</span>} />
          <div className="chart-summary"><strong>Rp 487.500.000</strong><span><Icon name="trend" /> 12,5% <small>vs bulan lalu</small></span></div>
          <div className="bar-chart month-chart" role="img" aria-label="Grafik pendapatan bulanan April sampai September">
            {monthlySalesData.map((month, index) => (
              <div className="bar-chart-item" key={month.month}>
                <span className="bar-chart-value">{Math.round(month.value / 1_000_000)} jt</span>
                <div className={`bar-chart-bar ${index === monthlySalesData.length - 1 ? 'is-current' : ''}`} style={{ height: `${(month.value / highestMonth) * 100}%` }} />
                <span className="bar-chart-label">{month.month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <PanelHeader title="Produk terlaris" note="Unit terjual bulan ini" action={<a className="link-cyan" href="/produk">Lihat katalog <Icon name="arrow" /></a>} />
          <div className="progress-list">
            {topProducts.map((product, index) => (
              <div className="progress-item" key={product.name}>
                <div className="progress-item-header"><span className="progress-item-rank">0{product.rank}</span><span className="progress-item-label">{product.name}</span><span className="progress-item-value">{product.sold}</span></div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${(product.sold / topProducts[0].sold) * 100}%` }} /></div>
                {index === 0 && <span className="sr-only">Produk teratas</span>}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <PanelHeader title="Pesanan terbaru" note="Aktivitas transaksi terkini" action={<a className="link-cyan" href="/pesanan">Semua pesanan <Icon name="arrow" /></a>} />
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>ID Pesanan</th><th>Pelanggan</th><th>Produk</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{recentOrders.slice(0, 4).map((order) => (
              <tr key={order.id}><td><span className="order-id">{order.id}</span></td><td>{order.customer}</td><td className="text-secondary">{order.product}</td><td className="text-secondary">{order.date}</td><td className="price">{order.total}</td><td><StatusBadge status={order.status} /></td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
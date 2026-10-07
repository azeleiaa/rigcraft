interface HeaderProps {
  title: string
  subtitle: string
  searchPlaceholder?: string
  onMenuToggle?: () => void
}

export default function Header({ title, subtitle, searchPlaceholder = 'Cari transaksi, produk...', onMenuToggle }: HeaderProps) {
  const currentMonth = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date())

  return (
    <header className="header">
      <button className="header-menu" type="button" onClick={onMenuToggle} aria-label="Buka navigasi">
        <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <div className="header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        {/* Search */}
        <div className="header-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input type="text" placeholder={searchPlaceholder} />
        </div>

        {/* Notification Bell */}
        <button className="header-notification" type="button" aria-label="Notifikasi, 3 pemberitahuan">
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
          <span className="header-notification-badge">3</span>
        </button>

        {/* Date */}
        <div className="header-date">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {currentMonth}
        </div>
      </div>
    </header>
  )
}

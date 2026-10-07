import { useState, type FormEvent } from 'react'
import { Icon, PanelHeader } from '../components/DashboardUI'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({ orders: true, stock: true, reports: false })

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2800)
  }

  return (
    <form className="page-stack settings-page" onSubmit={saveSettings}>
      <section className="card settings-section"><PanelHeader title="Informasi toko" note="Informasi ini ditampilkan pada kanal penjualan Anda." /><div className="form-grid settings-grid"><label>Nama toko<input defaultValue="RigCraft" /></label><label>Email operasional<input type="email" defaultValue="halo@rigcraft.id" /></label><label>Nomor telepon<input type="tel" defaultValue="+62 21 5550 1945" /></label><label>Zona waktu<select defaultValue="WIB"><option value="WIB">WIB · Jakarta (UTC+7)</option><option value="WITA">WITA · Makassar (UTC+8)</option><option value="WIT">WIT · Jayapura (UTC+9)</option></select></label><label className="form-full">Alamat toko<textarea defaultValue="Jl. Teknologi No. 88, Jakarta Selatan, DKI Jakarta 12190" rows={3} /></label></div></section>
      <section className="card settings-section"><PanelHeader title="Notifikasi" note="Pilih aktivitas yang ingin Anda terima." /><div className="settings-options">{[
        { key: 'orders' as const, title: 'Pesanan baru', description: 'Saat pesanan baru masuk ke toko.' },
        { key: 'stock' as const, title: 'Peringatan stok', description: 'Saat stok produk mencapai batas minimum.' },
        { key: 'reports' as const, title: 'Ringkasan mingguan', description: 'Laporan performa toko setiap Senin.' },
      ].map((item) => <label className="setting-option" key={item.key}><span><strong>{item.title}</strong><small>{item.description}</small></span><input type="checkbox" checked={notifications[item.key]} onChange={() => setNotifications((current) => ({ ...current, [item.key]: !current[item.key] }))} /></label>)}</div></section>
      <section className="card settings-section"><PanelHeader title="Keamanan akun" note="Perbarui kredensial administrator toko." /><div className="form-grid settings-grid"><label>Email administrator<input type="email" defaultValue="admin@rigcraft.id" /></label><label>Kata sandi baru<input type="password" placeholder="Biarkan kosong jika tidak diubah" /></label></div><div className="security-note"><span className="security-mark">✓</span><span><strong>Verifikasi dua langkah aktif</strong><small>Akun admin dilindungi dengan autentikasi dua faktor.</small></span></div></section>
      <div className="settings-footer"><span className={`save-feedback ${saved ? 'is-visible' : ''}`} role="status">Pengaturan berhasil disimpan.</span><button className="btn btn-primary" type="submit"><Icon name="edit" /> Simpan perubahan</button></div>
    </form>
  )
}
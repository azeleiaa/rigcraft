import { Link } from 'react-router-dom'
import { SectionHeading, StoreIcon } from '../../storefront/StorefrontUI'

const values = [
  { icon: 'support', title: 'Teknisi Berpengalaman', detail: 'Telah merakit lebih dari 5.000 PC custom.' },
  { icon: 'case', title: 'Cable Management Rapi', detail: 'Prioritas estetika dan sirkulasi udara maksimal.' },
  { icon: 'cpu', title: 'Stress Test Sebelum Kirim', detail: 'Pengujian game berat & benchmark minimal 3 jam.' },
  { icon: 'shield', title: 'Garansi Bantuan Klaim', detail: 'Kami bantu urus klaim garansi part seumur hidup.' },
]

const gallery = [
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=85',
]

export default function About() {
  return (
    <>
      <section className="sf-about-hero"><div className="sf-container"><span className="sf-eyebrow">CERITA RIGCRAFT</span><h1>Penyedia PC Kustom Terpercaya<br />Sejak Dulu</h1><p>RigCraft didirikan dengan satu misi sederhana: memberikan pengalaman memiliki komputer kustom impian tanpa rasa takut akan bottleneck, kompatibilitas, atau harga yang tidak masuk akal.</p></div></section>
      <section className="sf-section"><div className="sf-container sf-story-grid"><img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=90" alt="Area kerja dan workshop RigCraft" /><div><span className="sf-eyebrow">Cerita Kami</span><h2>Bagaimana Kami Memulai</h2><p>Dimulai dari garasi kecil di Jakarta Barat, kami menyadari betapa banyaknya gamer dan kreator konten pemula yang kebingungan merakit komputer dengan komponen yang tepat. Banyak yang membeli part tidak kompatibel atau membayar terlalu mahal untuk performa yang tidak sebanding.</p><p>Kami menciptakan platform PC Builder cerdas dan membangun showroom fisik agar pelanggan dapat datang, berkonsultasi gratis, melihat penataan kabel yang profesional secara langsung, dan menguji setup mereka sebelum melakukan pelunasan.</p><Link className="sf-text-link" to="/rakit-pc">Coba PC Builder kami <StoreIcon name="arrow" /></Link></div></div></section>
      <section className="sf-section sf-about-values"><div className="sf-container"><SectionHeading eyebrow="Keunggulan Kami" title="Mengapa Memilih RigCraft?" align="center" /><div className="sf-values-grid">{values.map((value) => <article key={value.title}><span><StoreIcon name={value.icon} /></span><h3>{value.title}</h3><p>{value.detail}</p></article>)}</div></div></section>
      <section className="sf-section"><div className="sf-container"><SectionHeading eyebrow="Aktivitas Workshop" title="Galeri Toko & Perakitan" align="center" /><div className="sf-about-gallery">{gallery.map((image, index) => <img key={image} src={image} alt={`Workshop dan perakitan RigCraft ${index + 1}`} loading="lazy" />)}</div></div></section>
      <section className="sf-section sf-location-section"><div className="sf-container sf-location-grid"><div><span className="sf-eyebrow">Lokasi & Layanan</span><h2>Datang Ke Toko Kami</h2><div className="sf-location-detail"><StoreIcon name="pin" /><span><strong>Alamat Fisik</strong><small>Ruko Mangga Dua Mall No. 42, Mangga Dua Selatan, Kecamatan Sawah Besar, Jakarta Pusat, DKI Jakarta 10730</small></span></div><div className="sf-location-detail"><StoreIcon name="clock" /><span><strong>Jam Operasional</strong><small>Senin – Sabtu: 10:00 – 20:00 WIB<br />Minggu & tanggal merah: Libur</small></span></div><div className="sf-location-detail"><StoreIcon name="support" /><span><strong>Kontak Langsung</strong><small>WhatsApp CS: +62 812-3456-7890<br />Email: info@rigcraft.co.id</small></span></div></div><a className="sf-map-placeholder" href="https://maps.google.com/?q=Mangga+Dua+Mall+Jakarta" target="_blank" rel="noreferrer"><span><strong>RIGCRAFT JAKARTA SHOWROOM</strong><small>Lihat di Google Maps ↗</small></span></a></div></section>
    </>
  )
}
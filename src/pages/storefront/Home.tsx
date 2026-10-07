import { useState } from 'react'
import { Link } from 'react-router-dom'
import { componentProducts, categoryLinks, prebuiltProducts } from '../../storefront/data'
import { ProductCard, SectionHeading, StoreIcon } from '../../storefront/StorefrontUI'

const promises = [
  { icon: 'shield', title: 'Garansi Resmi', description: '100% Distributor Lokal' },
  { icon: 'truck', title: 'Pengiriman Aman', description: 'Packing Kayu & Asuransi' },
  { icon: 'support', title: 'Bebas Konsultasi', description: 'Tanya Jawab Ahli Rakit' },
  { icon: 'card', title: 'Bisa Cicilan', description: '0% Bunga Berbagai Mitra' },
]

const reviews = [
  { name: 'Rian Hidayat', role: 'Hardcore Gamer', quote: 'Rakit PC di RigCraft rapi banget! Cable management super bersih dan dapat stress test 24 jam sebelum dikirim. Sangat puas.', rating: 5 },
  { name: 'Jessica Clara', role: '3D Rendering Artist', quote: 'Konsultasi spek buat rendering dibantu banget sama tim RigCraft. Dapat komponen garansi resmi dengan harga jujur.', rating: 5 },
  { name: 'Dwi Nugroho', role: 'Content Creator', quote: 'Packing kayunya tebal dan aman dikirim sampai Surabaya. PC datang langsung plug and play siap kerja.', rating: 5 },
]

const gallery = [
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=700&q=85',
]

export default function Home() {
  const [featuredTab, setFeaturedTab] = useState('Best Seller')
  const shownProducts = featuredTab === 'Prebuilt Terlaris'
    ? prebuiltProducts.slice(0, 4)
    : featuredTab === 'Komponen Populer'
      ? componentProducts.slice(2, 6)
      : componentProducts.slice(0, 4)

  return (
    <>
      <section className="sf-home-hero">
        <div className="sf-container sf-hero-grid">
          <div className="sf-hero-copy">
            <span className="sf-pill"><StoreIcon name="spark" /> Smart PC Builder Indonesia</span>
            <h1>Rakit PC Impian <em>Tanpa Ragu</em> &amp; Kompatibel</h1>
            <p>Simulasikan perakitan komputer impianmu dengan alat simulasi kompatibilitas cerdas kami. Pilih part berkualitas tinggi atau pesan RigCraft siap tempur sekarang juga.</p>
            <div className="sf-hero-actions"><Link className="sf-button" to="/rakit-pc">Mulai Rakit PC <StoreIcon name="arrow" /></Link><Link className="sf-button sf-button-outline" to="/prebuilt-pc">Lihat Prebuilt PC</Link></div>
            <div className="sf-hero-proof"><span className="sf-proof-avatars"><i>R</i><i>G</i><i>C</i></span><span><strong>4.9/5 dari 2.400+ pelanggan</strong><small>Dipercaya gamer & kreator seluruh Indonesia</small></span></div>
          </div>
          <div className="sf-hero-visual"><img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1500&q=90" alt="Gaming PC rakitan dengan pencahayaan RGB" fetchPriority="high" /><div className="sf-hero-image-label"><span className="sf-live-dot" /> RIGCRAFT TITAN X <span>RTX SERIES</span></div><div className="sf-hero-image-index">01 <span>/ 03</span></div></div>
        </div>
      </section>

      <section className="sf-promise-strip"><div className="sf-container sf-promise-grid">{promises.map((promise) => <div className="sf-promise" key={promise.title}><span className="sf-promise-icon"><StoreIcon name={promise.icon} /></span><span><strong>{promise.title}</strong><small>{promise.description}</small></span></div>)}</div></section>

      <section className="sf-section sf-category-section"><div className="sf-container"><SectionHeading eyebrow="Eksplor Komponen" title="Kategori Komponen PC" align="center" /><div className="sf-category-grid">{categoryLinks.map((category) => <Link className="sf-category-tile" key={category.title} to={`/katalog?kategori=${encodeURIComponent(category.title)}`}><span><StoreIcon name={category.icon} /></span><strong>{category.title}</strong></Link>)}</div></div></section>

      <section className="sf-section sf-featured-section"><div className="sf-container"><div className="sf-featured-heading"><SectionHeading eyebrow="Produk Unggulan" title="Temukan Komponen Terbaik" /><div className="sf-segmented" role="tablist" aria-label="Pilihan produk unggulan">{['Best Seller', 'Komponen Populer', 'Prebuilt Terlaris'].map((tab) => <button type="button" role="tab" aria-selected={featuredTab === tab} className={featuredTab === tab ? 'is-active' : ''} key={tab} onClick={() => setFeaturedTab(tab)}>{tab}</button>)}</div></div><div className="sf-product-grid">{shownProducts.map((product) => <ProductCard key={product.slug} product={product} kind={featuredTab === 'Prebuilt Terlaris' ? 'prebuilt' : 'component'} />)}</div><div className="sf-center-action"><Link className="sf-text-link" to={featuredTab === 'Prebuilt Terlaris' ? '/prebuilt-pc' : '/katalog'}>Jelajahi semua produk <StoreIcon name="arrow" /></Link></div></div></section>

      <section className="sf-build-cta"><div className="sf-container sf-build-cta-inner"><div><span className="sf-eyebrow">Bebas Rakit PC</span><h2>Simulasi Rakit PC Impian Gratis</h2><p>Pastikan semua komponen kompatibel sebelum checkout. Rancang build terbaikmu dengan panduan teknisi RigCraft.</p></div><Link className="sf-button" to="/rakit-pc">Mulai Simulasi <StoreIcon name="arrow" /></Link><span className="sf-cta-mark"><StoreIcon name="cpu" /></span></div></section>

      <section className="sf-section sf-review-section"><div className="sf-container"><SectionHeading eyebrow="Testimoni Pelanggan" title="Apa Kata Gamer Tentang Kami" align="center" /><div className="sf-review-grid">{reviews.map((review) => <article className="sf-review-card" key={review.name}><div className="sf-stars" aria-label={`${review.rating} dari 5 bintang`}>★★★★★</div><p>“{review.quote}”</p><div className="sf-review-author"><span>{review.name.split(' ').map((part) => part[0]).join('')}</span><strong>{review.name}<small>{review.role}</small></strong></div></article>)}</div></div></section>

      <section className="sf-section sf-showroom-section"><div className="sf-container"><SectionHeading eyebrow="Eksistensi Fisik" title="Kunjungi Showroom & Workshop Kami" align="center" /><div className="sf-showroom-grid">{gallery.map((image, index) => <img key={image} src={image} alt={`Ruang showroom RigCraft ${index + 1}`} loading="lazy" />)}</div><div className="sf-showroom-caption"><span><StoreIcon name="pin" /> Mangga Dua, Jakarta Pusat</span><Link className="sf-text-link" to="/tentang">Lihat lokasi kami <StoreIcon name="arrow" /></Link></div></div></section>
    </>
  )
}
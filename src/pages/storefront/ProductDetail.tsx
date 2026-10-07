import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { benchmarkGames, componentProducts, formatRupiah, prebuiltProducts, titanSpecifications, upgradeProducts } from '../../storefront/data'
import { useStoreCart } from '../../storefront/StorefrontLayout'
import { ProductCard, SectionHeading, StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

const galleryImages = [
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1300&q=90',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1300&q=90',
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1300&q=90',
  'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1300&q=90',
]

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const product = [...prebuiltProducts, ...componentProducts].find((item) => item.slug === slug)
  const isPrebuilt = prebuiltProducts.some((item) => item.slug === slug)
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useStoreCart()

  if (!product) return <div className="sf-container sf-not-found"><h1>Produk tidak ditemukan</h1><Link className="sf-button" to="/katalog">Kembali ke katalog</Link></div>

  const specs = isPrebuilt && slug === 'titan-x-gaming' ? titanSpecifications : [
    ['Kategori', product.category], ['Model', product.name], ['Garansi', 'Garansi resmi distributor 2 tahun'], ['Kondisi', 'Baru, segel resmi'], ['Ketersediaan', product.status],
  ]

  function addProduct() {
    if (!product) return
    addToCart(product, quantity)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <>
      <section className="sf-detail-top"><div className="sf-container"><StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: isPrebuilt ? 'Prebuilt PC' : 'Katalog', to: isPrebuilt ? '/prebuilt-pc' : '/katalog' }, { label: product.name }]} /><div className="sf-detail-grid"><div className="sf-gallery"><div className="sf-gallery-main"><img src={galleryImages[imageIndex]} alt={`${product.name}, tampilan ${imageIndex + 1}`} /><span className="sf-gallery-count">0{imageIndex + 1} <i>/ 04</i></span></div><div className="sf-gallery-thumbs">{galleryImages.map((image, index) => <button className={imageIndex === index ? 'is-active' : ''} type="button" key={image} aria-label={`Lihat gambar ${index + 1}`} onClick={() => setImageIndex(index)}><img src={image} alt="" /></button>)}</div></div>
          <div className="sf-detail-copy"><div className="sf-detail-tags"><span className="sf-tag sf-tag-green">{product.status}</span><span className="sf-tag sf-tag-purple">{product.category}</span></div><h1>{product.name}</h1><p className="sf-detail-description">{isPrebuilt ? 'Performa tanpa kompromi untuk gaming AAA dan streaming profesional.' : product.description}</p><div className="sf-rating"><span>★★★★★</span><b>4.8</b><small>· 127 Ulasan</small></div><div className="sf-detail-price"><small>Harga Spesial</small><strong>{formatRupiah(product.price)}</strong><del>{formatRupiah(Math.round(product.price * 1.08))}</del></div><div className="sf-detail-benefits"><p><StoreIcon name="shield" /> {isPrebuilt ? '2 Tahun Garansi Resmi Sparepart & Jasa Servis' : 'Garansi resmi distributor, produk original'}</p><p><StoreIcon name="truck" /> Gratis Ongkir Seluruh Indonesia (Asuransi & Packing Kayu)</p><p><StoreIcon name="cpu" /> Sudah Dirakit Rapi & Melewati Stress Test 24 Jam</p></div><div className="sf-detail-buy"><div className="sf-quantity"><button type="button" aria-label="Kurangi jumlah" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><StoreIcon name="minus" /></button><span>{quantity}</span><button type="button" aria-label="Tambah jumlah" onClick={() => setQuantity((value) => value + 1)}><StoreIcon name="plus" /></button></div><button className="sf-button sf-detail-add" type="button" onClick={addProduct}>{added ? <><StoreIcon name="check" /> Ditambahkan</> : 'Tambah ke Keranjang'}</button><a className="sf-button sf-button-outline" href="https://wa.me/6281234567890">Konsultasi Dulu</a></div></div></div></div></section>

      <section className="sf-section sf-spec-section"><div className="sf-container"><SectionHeading eyebrow="Spesifikasi Detail" title={isPrebuilt ? 'Konfigurasi RigCraft Titan X' : 'Spesifikasi Produk'} /><div className="sf-spec-grid">{specs.map(([label, value], index) => <div className="sf-spec-row" key={label}><span className="sf-spec-icon"><StoreIcon name={['cpu', 'gpu', 'board', 'ram', 'storage', 'power', 'case', 'support', 'check', 'card'][index] ?? 'spark'} /></span><span><small>{label}</small><strong>{value}</strong></span></div>)}</div></div></section>

      {isPrebuilt && <><section className="sf-section"><div className="sf-container"><SectionHeading eyebrow="Rekomendasi Upgrade" title="Tingkatkan Performa PC Anda" description="Sesuaikan rakitan Anda sebelum dikirim dengan upgrade komponen pilihan kami." /><div className="sf-upgrade-grid">{upgradeProducts.map((upgrade) => <article className="sf-upgrade-card" key={upgrade.title}><img src={upgrade.image} alt={upgrade.title} loading="lazy" /><h3>{upgrade.title}</h3><p>{upgrade.detail}</p><strong>+ {formatRupiah(upgrade.price)}</strong><button type="button" onClick={() => addToCart({ slug: `upgrade-${upgrade.title.toLowerCase().replaceAll(' ', '-')}`, name: upgrade.title, category: 'Upgrade', price: upgrade.price, description: upgrade.detail, image: upgrade.image, status: 'Tersedia' })}>Tambah Upgrade</button></article>)}</div></div></section><section className="sf-section sf-benchmark-section"><div className="sf-container"><SectionHeading eyebrow="Performa Benchmark" title="Uji Coba Game FPS Real-time" /><div className="sf-benchmark-panel">{benchmarkGames.map((game) => <div className="sf-benchmark-row" key={game.game}><div><strong>{game.game}</strong><b>{game.fps} FPS</b></div><span><i style={{ width: `${(game.fps / game.max) * 100}%` }} /></span></div>)}</div></div></section></>}

      <section className="sf-section sf-related-section"><div className="sf-container"><SectionHeading eyebrow="Rekomendasi Untukmu" title="Lanjutkan Eksplorasi" /><div className="sf-product-grid">{(isPrebuilt ? prebuiltProducts.filter((item) => item.slug !== slug).slice(0, 4) : componentProducts.filter((item) => item.slug !== slug).slice(0, 4)).map((item) => <ProductCard product={item} kind={isPrebuilt ? 'prebuilt' : 'component'} key={item.slug} />)}</div></div></section>
    </>
  )
}
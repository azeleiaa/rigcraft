import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productsApi, reviewsApi } from '../../lib/api'
import { mapProduct, type MappedProduct } from '../../lib/productMapper'
import { formatRupiah } from '../../storefront/data'
import { useStoreCart } from '../../storefront/StorefrontLayout'
import { ProductCard, SectionHeading, StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

const upgradeCopy: Record<string, { title: string; benefit: string }> = {
  'Upgrade RAM': { title: 'Tambah RAM', benefit: 'Buka banyak aplikasi dan game sekaligus tanpa lag.' },
  'Upgrade Storage': { title: 'Tambah Penyimpanan', benefit: 'Simpan lebih banyak game, file, dan proyek tanpa cepat penuh.' },
  'Upgrade GPU': { title: 'Grafis Lebih Mulus', benefit: 'Nikmati game favorit dengan gambar lebih halus dan detail.' },
  'Upgrade Cooling': { title: 'Jaga PC Tetap Dingin', benefit: 'PC tetap adem dan nyaman saat dipakai lebih lama.' },
}

function specIcon(label: string) {
  const key = label.toLowerCase()
  if (key.includes('processor') || key.includes('cpu')) return 'cpu' as const
  if (key.includes('gpu') || key.includes('graphic')) return 'gpu' as const
  if (key.includes('motherboard') || key.includes('board')) return 'board' as const
  if (key.includes('ram') || key.includes('memory')) return 'ram' as const
  if (key.includes('storage') || key.includes('ssd')) return 'storage' as const
  if (key.includes('psu') || key.includes('power') || key.includes('daya')) return 'power' as const
  if (key.includes('casing') || key.includes('case')) return 'case' as const
  if (key.includes('garansi') || key.includes('os')) return 'shield' as const
  return 'spark' as const
}

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const { addToCart } = useStoreCart()

  const [product, setProduct] = useState<MappedProduct | null>(null)
  const [related, setRelated] = useState<MappedProduct[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Ambil detail produk setiap kali slug (ID) berubah
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setProduct(null)
    setRelated([])
    setReviews([])
    setImageIndex(0)
    setQuantity(1)
    window.scrollTo(0, 0)

    productsApi
      .getById(slug)
      .then((res) => {
        if (!cancelled) setProduct(mapProduct(res.data))
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat produk.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  // Ulasan dan rekomendasi dimuat setelah produk ada; kalau gagal, halaman tetap jalan
  useEffect(() => {
    if (!product) return
    let cancelled = false

    reviewsApi
      .list(product.id)
      .then((res) => { if (!cancelled) setReviews(res.data ?? []) })
      .catch(() => {})

    productsApi
      .getAll(product.type ? { type: product.type, per_page: 8 } : { per_page: 8 })
      .then((res) => {
        if (cancelled) return
        setRelated(
          (res.data ?? [])
            .map(mapProduct)
            .filter((item) => item.id !== product.id)
            .slice(0, 4),
        )
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [product])

  if (loading) {
    return <div className="sf-container sf-not-found"><h1>Memuat produk...</h1><p>Server mungkin butuh beberapa detik jika baru bangun.</p></div>
  }

  if (error || !product) {
    return (
      <div className="sf-container sf-not-found">
        <h1>Produk tidak ditemukan</h1>
        {error && <p>{error}</p>}
        <Link className="sf-button" to="/katalog">Kembali ke katalog</Link>
      </div>
    )
  }

  const isPrebuilt = product.type === 'prebuilt_pc'
  const isOutOfStock = product.status === 'Habis'
  const maxQuantity = Math.max(1, product.stock || 1)

  const specs = product.specs && product.specs.length > 0
    ? product.specs
    : ([
        ['Kategori', product.category],
        ['Model', product.name],
        ['Merek', product.brand || '-'],
        ['Ketersediaan', product.status],
      ] as [string, string][])
  const specColumns = [specs.slice(0, Math.ceil(specs.length / 2)), specs.slice(Math.ceil(specs.length / 2))]
  const benchmarks = product.benchmarks ?? []

  // Galeri memakai gambar milik produk saja (tidak memakai foto generik)
  const extraImages: string[] = Array.isArray(product.raw?.images) ? product.raw.images.filter(Boolean).map(String) : []
  const gallery = Array.from(new Set([product.image, ...extraImages].filter(Boolean)))

  const ratings = reviews.map((review) => Number(review.rating)).filter((value) => value > 0)
  const averageRating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : 0
  const filledStars = Math.round(averageRating)

  function addProduct() {
    if (!product || isOutOfStock) return
    addToCart(product, quantity)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <>
      <section className="sf-detail-top">
        <div className="sf-container">
          <StoreBreadcrumb
            items={[
              { label: 'Beranda', to: '/' },
              { label: isPrebuilt ? 'Prebuilt PC' : 'Katalog', to: isPrebuilt ? '/prebuilt-pc' : '/katalog' },
              { label: product.name },
            ]}
          />
          <div className="sf-detail-grid">
            <div className="sf-gallery">
              <div className="sf-gallery-main">
                {gallery[imageIndex] && <img src={gallery[imageIndex]} alt={`${product.name}, tampilan ${imageIndex + 1}`} />}
                {gallery.length > 1 && (
                  <span className="sf-gallery-count">0{imageIndex + 1} <i>/ 0{gallery.length}</i></span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="sf-gallery-thumbs">
                  {gallery.map((image, index) => (
                    <button
                      className={imageIndex === index ? 'is-active' : ''}
                      type="button"
                      key={image}
                      aria-label={`Lihat gambar ${index + 1}`}
                      onClick={() => setImageIndex(index)}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="sf-detail-copy">
              <div className="sf-detail-tags">
                <span className="sf-tag sf-tag-green">{product.status}</span>
                <span className="sf-tag sf-tag-purple">{product.category}</span>
                {!isOutOfStock && product.stock > 0 && <span className="sf-tag sf-tag-purple">Stok {product.stock}</span>}
              </div>
              <h1>{product.name}</h1>
              <p className="sf-detail-description">{product.description}</p>

              <div className="sf-rating">
                {ratings.length > 0 ? (
                  <>
                    <span>{'★'.repeat(filledStars)}{'☆'.repeat(5 - filledStars)}</span>
                    <b>{averageRating.toFixed(1)}</b>
                    <small>· {ratings.length} Ulasan</small>
                  </>
                ) : (
                  <small>Belum ada ulasan</small>
                )}
              </div>

              <div className="sf-detail-price">
                <small>Harga</small>
                <strong>{formatRupiah(product.price)}</strong>
              </div>

              <div className="sf-detail-benefits">
                <p><StoreIcon name="shield" /> {isPrebuilt ? '2 Tahun Garansi Resmi Sparepart & Jasa Servis' : 'Garansi resmi distributor, produk original'}</p>
                <p><StoreIcon name="truck" /> Gratis Ongkir Seluruh Indonesia (Asuransi & Packing Kayu)</p>
                <p><StoreIcon name="cpu" /> Sudah Dirakit Rapi & Melewati Stress Test 24 Jam</p>
              </div>

              <div className="sf-detail-buy">
                <div className="sf-quantity">
                  <button type="button" aria-label="Kurangi jumlah" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                    <StoreIcon name="minus" />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" aria-label="Tambah jumlah" onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}>
                    <StoreIcon name="plus" />
                  </button>
                </div>
                <button className="sf-button sf-detail-add" type="button" onClick={addProduct} disabled={isOutOfStock}>
                  {isOutOfStock ? 'Stok Habis' : added ? <><StoreIcon name="check" /> Ditambahkan</> : 'Tambah ke Keranjang'}
                </button>
                <a className="sf-button sf-button-outline" href="https://wa.me/6281234567890">Konsultasi Dulu</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sf-section sf-spec-section">
        <div className="sf-container">
          <SectionHeading eyebrow="Spesifikasi Detail" title={isPrebuilt ? `Konfigurasi ${product.name}` : 'Spesifikasi Produk'} />
          <div className="sf-spec-grid">
            {specColumns.map((column, columnIndex) => (
              <div className="sf-spec-col" key={columnIndex}>
                {column.map(([label, value]) => (
                  <div className="sf-spec-row" key={label}>
                    <span className="sf-spec-icon"><StoreIcon name={specIcon(label)} /></span>
                    <span><small>{label}</small><strong>{value}</strong></span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isPrebuilt && product.upgrades.length > 0 && (
        <section className="sf-section">
          <div className="sf-container">
            <SectionHeading
              eyebrow="Rekomendasi Upgrade"
              title="Tingkatkan Performa PC Anda"
              description="Sesuaikan rakitan Anda sebelum dikirim dengan upgrade komponen pilihan kami."
            />
            <div className="sf-upgrade-grid">
              {product.upgrades.map((upgrade) => {
                const copy = upgradeCopy[upgrade.title] ?? { title: upgrade.title, benefit: upgrade.detail }
                return (
                  <article className="sf-upgrade-card" key={upgrade.title}>
                    {upgrade.image && <img src={upgrade.image} alt={upgrade.title} loading="lazy" />}
                    <div className="sf-upgrade-copy">
                      <h3>{copy.title}</h3>
                      <p>{copy.benefit}</p>
                      <small>{upgrade.detail}</small>
                    </div>
                    <div className="sf-upgrade-footer">
                      <strong>+ {formatRupiah(upgrade.price)}</strong>
                      <button
                        className="sf-button sf-button-outline"
                        type="button"
                        onClick={() =>
                          addToCart({
                            slug: `upgrade-${upgrade.title.toLowerCase().replaceAll(' ', '-')}`,
                            name: upgrade.title,
                            category: 'Upgrade',
                            price: upgrade.price,
                            description: upgrade.detail,
                            image: upgrade.image,
                            status: 'Tersedia',
                          })
                        }
                      >
                        Tambah
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {benchmarks.length > 0 && (
        <section className="sf-section sf-benchmark-section">
          <div className="sf-container">
            <SectionHeading
              eyebrow="Performa Benchmark"
              title="Uji Coba Game FPS Real-time"
              description="Hasil pengujian internal RigCraft pada resolusi dan preset yang tertera."
            />
            <div className="sf-benchmark-panel">
              {benchmarks.map((game) => (
                <div className="sf-benchmark-row" key={game.game}>
                  <div><strong>{game.game}</strong><b>{game.fps} FPS</b></div>
                  <span><i style={{ width: `${Math.min(100, (game.fps / game.max) * 100)}%` }} /></span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="sf-section sf-related-section">
          <div className="sf-container">
            <SectionHeading eyebrow="Rekomendasi Untukmu" title="Lanjutkan Eksplorasi" />
            <div className="sf-product-grid">
              {related.map((item) => (
                <ProductCard product={item} kind={isPrebuilt ? 'prebuilt' : 'component'} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productsApi } from '../../lib/api'
import { ProductCard, StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

// label = teks di filter, keys = kata kunci yang dicocokkan ke category dari backend
const categories = [
  { label: 'CPU (Processor)', keys: ['cpu', 'processor'] },
  { label: 'GPU (VGA Card)', keys: ['gpu', 'vga'] },
  { label: 'Motherboard', keys: ['motherboard', 'mobo'] },
  { label: 'RAM (Memory)', keys: ['ram', 'memory'] },
  { label: 'SSD & HDD Storage', keys: ['ssd', 'hdd', 'storage'] },
  { label: 'Power Supply (PSU)', keys: ['psu', 'power'] },
  { label: 'Cooling', keys: ['cooling', 'cooler'] },
  { label: 'Casing', keys: ['casing', 'case'] },
]
const PAGE_SIZE = 12

function buildDescription(p: any): string {
  if (p.description) return String(p.description)
  const specs = p.specs && typeof p.specs === 'object' ? p.specs : {}
  const parts = Object.entries(specs)
    .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
    .map(([k, v]) => (k === 'powerWattage' ? `${v}W` : String(v)))
  return parts.slice(0, 4).join(' · ')
}

// Ubah bentuk data backend agar cocok dengan yang dibaca ProductCard
function mapProduct(p: any) {
  const id = String(p._id ?? p.id ?? '')
  const hasStock = p.stock === undefined || p.stock === null || Number(p.stock) > 0
  const isActive = p.status === undefined || p.status === 'Aktif' || p.status === 'Tersedia'
  return {
    ...p,
    id,
    slug: id,
    name: p.name ?? '',
    description: buildDescription(p),
    category: p.category ?? '',
    brand: p.brand ?? '',
    price: Number(p.price ?? 0),
    image: p.image ?? p.image_url ?? '',
    status: isActive && hasStock ? 'Tersedia' : 'Habis',
  }
}

export default function Catalog() {
  const [params] = useSearchParams()
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [activeBrands, setActiveBrands] = useState<string[]>([])
  const [maximumPrice, setMaximumPrice] = useState('50000000')
  const [sort, setSort] = useState('lowest')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const selectedCategory = params.get('kategori')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await productsApi.getAll({ type: 'sparepart', per_page: 100 })
        if (cancelled) return
        const list = (res.data ?? [])
          .filter((p: any) => p.type !== 'prebuilt_pc')
          .map(mapProduct)
        setProducts(list)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat produk.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Daftar brand diambil dari data yang benar-benar ada
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const category = String(product.category).toLowerCase()
      const searchText = `${product.name} ${product.description} ${product.category} ${product.brand}`.toLowerCase()
      const matchesSearch = searchText.includes(query.trim().toLowerCase())
      const matchesPrice = product.price <= Number(maximumPrice || 0)
      const matchesCategory =
        activeCategories.length === 0 ||
        categories.some((c) => activeCategories.includes(c.label) && c.keys.some((k) => category.includes(k)))
      const wanted = selectedCategory?.toLowerCase().replace('vga', 'gpu')
      const matchesSelected = !wanted || category.includes(wanted) || categories.some((c) => c.keys.includes(wanted) && c.keys.some((k) => category.includes(k)))
      const matchesBrand = activeBrands.length === 0 || activeBrands.includes(product.brand)
      return matchesSearch && matchesPrice && matchesCategory && matchesSelected && matchesBrand
    })
    return [...filtered].sort((left, right) => sort === 'highest' ? right.price - left.price : left.price - right.price)
  }, [products, activeBrands, activeCategories, maximumPrice, query, selectedCategory, sort])

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedProducts = visibleProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Kembali ke halaman 1 setiap filter berubah
  useEffect(() => { setPage(1) }, [activeBrands, activeCategories, maximumPrice, query, selectedCategory, sort])

  function toggleFilter(value: string, current: string[], update: (next: string[]) => void) {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  return (
    <>
      <div className="sf-page-title-band">
        <div className="sf-container">
          <StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Katalog Sparepart' }]} />
          <h1>Katalog Komponen PC</h1>
          <p>Part pilihan, garansi resmi, dan siap dikirim ke seluruh Indonesia.</p>
        </div>
      </div>

      <div className="sf-container sf-catalog-searchbar">
        <label className="sf-bigsearch">
          <StoreIcon name="search" />
          <input
            type="search"
            aria-label="Cari komponen"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari komponen, contoh: RTX 4070, DDR5, Ryzen..."
          />
          {query && (
            <button type="button" className="sf-bigsearch-clear" aria-label="Hapus pencarian" onClick={() => setQuery('')}>✕</button>
          )}
        </label>
      </div>

      <section className="sf-container sf-catalog-layout">
        <aside className="sf-filter-panel">
          <div className="sf-filter-heading">
            <h2>Filter Part</h2>
            <button type="button" onClick={() => { setActiveCategories([]); setActiveBrands([]); setMaximumPrice('50000000'); setQuery('') }}>Reset Semua</button>
          </div>
          <fieldset>
            <legend>Kategori</legend>
            {categories.map((category) => (
              <label className="sf-check-row" key={category.label}>
                <input type="checkbox" checked={activeCategories.includes(category.label)} onChange={() => toggleFilter(category.label, activeCategories, setActiveCategories)} />
                <span>{category.label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Produsen (Brand)</legend>
            {brands.map((brand) => (
              <label className="sf-check-row" key={brand}>
                <input type="checkbox" checked={activeBrands.includes(brand)} onChange={() => toggleFilter(brand, activeBrands, setActiveBrands)} />
                <span>{brand}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Kisaran Harga</legend>
            <div className="sf-range-value"><span>Rp 0</span><span>{Number(maximumPrice).toLocaleString('id-ID')}</span></div>
            <input className="sf-range" type="range" min="500000" max="50000000" step="500000" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} aria-label="Harga maksimal" />
            <div className="sf-price-inputs">
              <label>Min<input type="number" value="0" readOnly /></label>
              <label>Maks<input type="number" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} /></label>
            </div>
          </fieldset>
          <div className="sf-filter-help"><StoreIcon name="support" /><span>Butuh rekomendasi part?<Link to="/rakit-pc">Tanya builder kami</Link></span></div>
        </aside>

        <div className="sf-catalog-results">
          <div className="sf-catalog-toolbar">
            <p>Menampilkan <strong>{loading ? '...' : visibleProducts.length}</strong> komponen</p>
            <label>Urutkan
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="lowest">Harga Terendah</option>
                <option value="highest">Harga Tertinggi</option>
              </select>
            </label>
          </div>

          {loading && (
            <div className="sf-empty-results"><StoreIcon name="search" /><h2>Memuat produk...</h2><p>Server mungkin butuh beberapa detik jika baru bangun.</p></div>
          )}

          {!loading && error && (
            <div className="sf-empty-results"><StoreIcon name="search" /><h2>Gagal memuat produk</h2><p>{error}</p></div>
          )}

          {!loading && !error && (pagedProducts.length
            ? <div className="sf-product-grid sf-catalog-grid">{pagedProducts.map((product) => <ProductCard product={product} key={product.slug} />)}</div>
            : <div className="sf-empty-results"><StoreIcon name="search" /><h2>Komponen tidak ditemukan</h2><p>Coba ubah kata kunci, kategori, brand, atau kisaran harga.</p></div>)}

          {!loading && !error && totalPages > 1 && (
            <nav className="sf-pagination" aria-label="Halaman katalog">
              <button disabled={currentPage === 1} aria-label="Halaman sebelumnya" onClick={() => setPage(currentPage - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} className={n === currentPage ? 'is-current' : ''} aria-current={n === currentPage ? 'page' : undefined} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button disabled={currentPage === totalPages} aria-label="Halaman berikutnya" onClick={() => setPage(currentPage + 1)}>›</button>
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../../lib/api'
import { mapProduct, type MappedProduct } from '../../lib/productMapper'
import { ProductCard, StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

export default function Prebuilt() {
  const [products, setProducts] = useState<MappedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [type, setType] = useState('Semua')
  const [brand, setBrand] = useState('Semua')
  const [sort, setSort] = useState('lowest')
  const [budget, setBudget] = useState('') // kosong = tanpa batas

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await productsApi.getAll({ type: 'prebuilt_pc', per_page: 100 })
        if (cancelled) return
        setProducts((res.data ?? []).map(mapProduct).filter((item) => item.type === 'prebuilt_pc'))
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat produk.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const types = useMemo(() => ['Semua', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))], [products])
  const brands = useMemo(() => ['Semua', ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))], [products])
  const maxPrice = useMemo(
    () => Math.ceil(Math.max(50000000, ...products.map((p) => p.price)) / 1000000) * 1000000,
    [products],
  )
  const effectiveBudget = budget === '' ? maxPrice : Number(budget)

  const filtered = useMemo(
    () =>
      products
        .filter((p) => (type === 'Semua' || p.category === type) && (brand === 'Semua' || p.brand === brand) && p.price <= effectiveBudget)
        .sort((left, right) => (sort === 'highest' ? right.price - left.price : left.price - right.price)),
    [products, type, brand, effectiveBudget, sort],
  )

  return (
    <>
      <div className="sf-page-title-band">
        <div className="sf-container">
          <StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Prebuilt PC' }]} />
          <h1>Katalog Prebuilt PC</h1>
          <p>Racikan teruji, tinggal pilih dan langsung main.</p>
        </div>
      </div>

      <section className="sf-container sf-catalog-layout sf-prebuilt-layout">
        <aside className="sf-filter-panel">
          <div className="sf-filter-heading">
            <h2>Filter PC</h2>
            <button type="button" onClick={() => { setType('Semua'); setBrand('Semua'); setBudget('') }}>Reset Semua</button>
          </div>
          <fieldset>
            <legend>Tipe PC</legend>
            {types.map((item) => (
              <label className="sf-check-row" key={item}>
                <input type="radio" name="prebuilt-type" checked={type === item} onChange={() => setType(item)} />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Budget Maksimal</legend>
            <div className="sf-range-value"><span>Rp 0</span><span>{effectiveBudget.toLocaleString('id-ID')}</span></div>
            <input className="sf-range" aria-label="Budget maksimal" type="range" min="5000000" max={maxPrice} step="1000000" value={effectiveBudget} onChange={(event) => setBudget(event.target.value)} />
            <input className="sf-budget-input" type="number" value={effectiveBudget} onChange={(event) => setBudget(event.target.value)} aria-label="Budget dalam rupiah" />
          </fieldset>
          <fieldset>
            <legend>Brand</legend>
            {brands.map((item) => (
              <label className="sf-check-row" key={item}>
                <input type="radio" name="prebuilt-brand" checked={brand === item} onChange={() => setBrand(item)} />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          <div className="sf-filter-help"><span>Rakit sesuai keinginan<Link to="/rakit-pc">Mulai simulasi</Link></span></div>
        </aside>

        <div className="sf-catalog-results">
          <div className="sf-catalog-toolbar">
            <p>Menampilkan <strong>{loading ? '...' : filtered.length}</strong> Prebuilt PC</p>
            <label>Urutkan
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="lowest">Harga Terendah</option>
                <option value="highest">Harga Tertinggi</option>
              </select>
            </label>
          </div>

          {loading && <div className="sf-empty-results"><StoreIcon name="search" /><h2>Memuat produk...</h2><p>Server mungkin butuh beberapa detik jika baru bangun.</p></div>}
          {!loading && error && <div className="sf-empty-results"><StoreIcon name="search" /><h2>Gagal memuat produk</h2><p>{error}</p></div>}
          {!loading && !error && (filtered.length
            ? <div className="sf-product-grid sf-catalog-grid">{filtered.map((product) => <ProductCard product={product} kind="prebuilt" key={product.id} />)}</div>
            : <div className="sf-empty-results"><StoreIcon name="search" /><h2>PC tidak ditemukan</h2><p>Coba ubah tipe, brand, atau budget.</p></div>)}
        </div>
      </section>
    </>
  )
}
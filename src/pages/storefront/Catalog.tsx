import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { componentProducts } from '../../storefront/data'
import { ProductCard, StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

const categories = ['CPU (Processor)', 'GPU (VGA Card)', 'Motherboard', 'RAM (Memory)', 'SSD & HDD Storage', 'Power Supply (PSU)', 'Cooling', 'Casing']
const brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Corsair', 'Samsung']

export default function Catalog() {
  const [params] = useSearchParams()
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [activeBrands, setActiveBrands] = useState<string[]>([])
  const [maximumPrice, setMaximumPrice] = useState('50000000')
  const [sort, setSort] = useState('lowest')
  const [query, setQuery] = useState('')
  const selectedCategory = params.get('kategori')

  const visibleProducts = useMemo(() => {
    const filtered = componentProducts.filter((product) => {
      const searchText = `${product.name} ${product.category}`.toLowerCase()
      const matchesSearch = searchText.includes(query.trim().toLowerCase())
      const matchesPrice = product.price <= Number(maximumPrice || 0)
      const matchesCategory = activeCategories.length === 0 || activeCategories.some((category) => product.category.toLowerCase().includes(category.split(' ')[0].toLowerCase()))
      const matchesSelected = !selectedCategory || product.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('vga', 'gpu'))
      const matchesBrand = activeBrands.length === 0 || activeBrands.some((brand) => product.name.toLowerCase().includes(brand.toLowerCase()))
      return matchesSearch && matchesPrice && matchesCategory && matchesSelected && matchesBrand
    })
    return filtered.sort((left, right) => sort === 'highest' ? right.price - left.price : left.price - right.price)
  }, [activeBrands, activeCategories, maximumPrice, query, selectedCategory, sort])

  function toggleFilter(value: string, current: string[], update: (next: string[]) => void) {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  return (
    <>
      <div className="sf-page-title-band"><div className="sf-container"><StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Katalog Sparepart' }]} /><h1>Katalog Komponen PC</h1><p>Part pilihan, garansi resmi, dan siap dikirim ke seluruh Indonesia.</p></div></div>
      <section className="sf-container sf-catalog-layout">
        <aside className="sf-filter-panel"><div className="sf-filter-heading"><h2>Filter Part</h2><button type="button" onClick={() => { setActiveCategories([]); setActiveBrands([]); setMaximumPrice('50000000'); setQuery('') }}>Reset Semua</button></div>
          <label className="sf-filter-search"><StoreIcon name="spark" /><input aria-label="Cari komponen" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari komponen" /></label>
          <fieldset><legend>Kategori</legend>{categories.map((category) => <label className="sf-check-row" key={category}><input type="checkbox" checked={activeCategories.includes(category)} onChange={() => toggleFilter(category, activeCategories, setActiveCategories)} /><span>{category}</span></label>)}</fieldset>
          <fieldset><legend>Produsen (Brand)</legend>{brands.map((brand) => <label className="sf-check-row" key={brand}><input type="checkbox" checked={activeBrands.includes(brand)} onChange={() => toggleFilter(brand, activeBrands, setActiveBrands)} /><span>{brand}</span></label>)}</fieldset>
          <fieldset><legend>Kisaran Harga</legend><div className="sf-range-value"><span>Rp 0</span><span>{Number(maximumPrice).toLocaleString('id-ID')}</span></div><input className="sf-range" type="range" min="500000" max="50000000" step="500000" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} aria-label="Harga maksimal" /><div className="sf-price-inputs"><label>Min<input type="number" value="0" readOnly /></label><label>Maks<input type="number" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} /></label></div></fieldset>
          <div className="sf-filter-help"><StoreIcon name="support" /><span>Butuh rekomendasi part?<Link to="/rakit-pc">Tanya builder kami</Link></span></div>
        </aside>
        <div className="sf-catalog-results"><div className="sf-catalog-toolbar"><p>Menampilkan <strong>{visibleProducts.length}</strong> komponen</p><label>Urutkan<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="lowest">Harga Terendah</option><option value="highest">Harga Tertinggi</option></select></label></div>
          {visibleProducts.length ? <div className="sf-product-grid sf-catalog-grid">{visibleProducts.map((product) => <ProductCard product={product} key={product.slug} />)}</div> : <div className="sf-empty-results"><StoreIcon name="search" /><h2>Komponen tidak ditemukan</h2><p>Coba ubah kategori, brand, atau kisaran harga.</p></div>}
          <nav className="sf-pagination" aria-label="Halaman katalog"><button disabled aria-label="Halaman sebelumnya">‹</button><button className="is-current" aria-current="page">1</button><button disabled>2</button><button disabled>3</button><button disabled aria-label="Halaman berikutnya">›</button></nav>
        </div>
      </section>
    </>
  )
}
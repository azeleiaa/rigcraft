import { useState, type FormEvent } from 'react'
import { products } from '../data/dummyData'
import { Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

const categories = ['Semua', 'Sparepart', 'Prebuilt PC', 'Peripheral']

export default function Products() {
  const [items, setItems] = useState(products)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState({ name: '', category: 'CPU', price: '', stock: '1' })
  const visibleProducts = items.filter((product) => {
    const isInCategory = activeCategory === 'Semua'
      || (activeCategory === 'Sparepart' && !['PREBUILT PC', 'PERIPHERAL'].includes(product.category))
      || (activeCategory === 'Prebuilt PC' && product.category === 'PREBUILT PC')
      || (activeCategory === 'Peripheral' && product.category === 'PERIPHERAL')
    return isInCategory && `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())
  })

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setItems((current) => [{
      id: Date.now(),
      name: draft.name.trim(),
      category: draft.category,
      price: `Rp ${Number(draft.price).toLocaleString('id-ID')}`,
      stock: Number(draft.stock),
      status: 'Draft',
    }, ...current])
    setDraft({ name: '', category: 'CPU', price: '', stock: '1' })
    setShowForm(false)
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div className="toolbar-search"><Icon name="search" /><input aria-label="Cari produk" placeholder="Cari nama atau kategori produk" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <button className="btn btn-primary" type="button" onClick={() => setShowForm((open) => !open)}><Icon name="plus" /> Tambah produk</button>
      </div>
      {showForm && <form className="card product-form" onSubmit={addProduct}>
        <PanelHeader title="Produk baru" note="Produk disimpan sebagai draft pada sesi ini." />
        <div className="form-grid">
          <label>Nama produk<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Contoh: Ryzen 7 9800X3D" /></label>
          <label>Kategori<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>CPU</option><option>GPU</option><option>RAM</option><option>SSD</option><option>PSU</option><option>PREBUILT PC</option><option>PERIPHERAL</option></select></label>
          <label>Harga (Rp)<input required min="1" type="number" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="8500000" /></label>
          <label>Stok<input required min="0" type="number" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} /></label>
        </div>
        <div className="form-actions"><button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Batal</button><button className="btn btn-primary" type="submit">Simpan draft</button></div>
      </form>}
      <div className="filter-tabs" role="tablist" aria-label="Kategori produk">
        {categories.map((category) => <button className={`filter-tab ${activeCategory === category ? 'active' : ''}`} key={category} onClick={() => setActiveCategory(category)} type="button" role="tab" aria-selected={activeCategory === category}>{category}<span className="count">{category === 'Semua' ? items.length : items.filter((item) => category === 'Sparepart' ? !['PREBUILT PC', 'PERIPHERAL'].includes(item.category) : item.category === category.toUpperCase()).length}</span></button>)}
      </div>
      <section>
        <div className="section-heading"><div><h2 className="section-title">Katalog produk</h2><p className="card-subtitle">{visibleProducts.length} produk ditemukan</p></div><span className="inventory-note"><i /> Stok diperbarui secara lokal</span></div>
        <div className="products-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className={`product-card-image product-visual product-visual-${index % 4}`}><span className="product-visual-mark">{product.category === 'PREBUILT PC' ? 'RC' : product.category.slice(0, 3)}</span><span className="product-card-badge"><StatusBadge status={product.status} /></span></div>
              <div className="product-card-body"><p className="product-card-category">{product.category}</p><h3 className="product-card-name">{product.name}</h3><p className="product-card-price">{product.price}</p><div className="product-card-footer"><span className="product-card-stock"><i className={`dot ${product.stock <= 5 ? 'low' : ''}`} />{product.stock === 0 ? 'Stok habis' : `${product.stock} unit tersedia`}</span><button className="product-card-action-btn edit" type="button" title={`Edit ${product.name}`} aria-label={`Edit ${product.name}`}><Icon name="edit" /></button></div></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
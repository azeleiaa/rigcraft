import { useEffect, useState, type FormEvent } from 'react'
import { adminApi } from '../lib/api'
import { formatRupiah } from '../storefront/data'
import { Icon, PanelHeader, StatusBadge } from '../components/DashboardUI'

const SPAREPART_CATEGORIES = ['CPU', 'Motherboard', 'RAM', 'GPU', 'SSD', 'PSU', 'Cooling', 'Casing']
const PREBUILT_CATEGORIES = ['Gaming PC', 'Workstation', 'Office PC', 'Creator PC']
const STATUSES = ['Aktif', 'Draft', 'Nonaktif']

interface AdminProduct {
  id: string
  name: string
  type: string
  category: string
  brand: string
  price: number
  stock: number
  status: string
  image: string
  specs: Record<string, any>
  raw: any
}

function toAdminProduct(p: any): AdminProduct {
  return {
    id: String(p._id ?? p.id ?? ''),
    name: String(p.name ?? ''),
    type: String(p.type ?? 'sparepart'),
    category: String(p.category ?? ''),
    brand: String(p.brand ?? ''),
    price: Number(p.price ?? 0),
    stock: Number(p.stock ?? 0),
    status: String(p.status ?? 'Aktif'),
    image: String(p.image_url ?? p.image ?? ''),
    specs: p.specs && typeof p.specs === 'object' && !Array.isArray(p.specs) ? p.specs : {},
    raw: p,
  }
}

const emptyDraft = {
  name: '', type: 'sparepart', category: 'CPU', brand: '', price: '', stock: '1',
  status: 'Aktif', image: '', socket: '', ramType: '', powerWattage: '',
}

const tabs = [
  { label: 'Semua', match: (_p: AdminProduct) => true },
  { label: 'Sparepart', match: (p: AdminProduct) => p.type !== 'prebuilt_pc' },
  { label: 'Prebuilt PC', match: (p: AdminProduct) => p.type === 'prebuilt_pc' },
]

export default function Products() {
  const [items, setItems] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTab, setActiveTab] = useState('Semua')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load(silent = false) {
    if (!silent) setLoading(true)
    setError('')
    try {
      const res = await adminApi.getProducts()
      setItems((res.data ?? []).map(toAdminProduct))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const isPrebuilt = draft.type === 'prebuilt_pc'
  const needsSocket = !isPrebuilt && ['CPU', 'Motherboard'].includes(draft.category)
  const needsRamType = !isPrebuilt && ['Motherboard', 'RAM'].includes(draft.category)
  const needsWattage = isPrebuilt || ['GPU', 'PSU'].includes(draft.category)

  function openCreate() {
    setEditing(null)
    setDraft(emptyDraft)
    setFormError('')
    setShowForm(true)
  }

  function openEdit(product: AdminProduct) {
    setEditing(product)
    setDraft({
      name: product.name,
      type: product.type,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      image: product.image,
      socket: String(product.specs.socket ?? ''),
      ramType: String(product.specs.ramType ?? ''),
      powerWattage: product.specs.powerWattage ? String(product.specs.powerWattage) : '',
    })
    setFormError('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setFormError('')
  }

  function changeType(type: string) {
    setDraft({ ...draft, type, category: type === 'prebuilt_pc' ? PREBUILT_CATEGORIES[0] : SPAREPART_CATEGORIES[0] })
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (needsSocket && !draft.socket.trim()) return setFormError('Socket wajib diisi untuk CPU dan Motherboard.')
    if (needsRamType && !draft.ramType) return setFormError('Tipe RAM wajib dipilih untuk Motherboard dan RAM.')
    if (needsWattage && !(Number(draft.powerWattage) > 0)) return setFormError('Daya (watt) wajib diisi untuk GPU, PSU, dan Prebuilt PC.')

    const specs: Record<string, any> = { ...(editing?.specs ?? {}) }
    if (needsSocket) specs.socket = draft.socket.trim()
    if (needsRamType) specs.ramType = draft.ramType
    if (needsWattage) specs.powerWattage = Number(draft.powerWattage)

    const payload: any = {
      name: draft.name.trim(),
      type: draft.type,
      category: draft.category,
      brand: draft.brand.trim(),
      price: Number(draft.price),
      stock: Number(draft.stock),
      status: draft.status,
      specs,
    }
    if (draft.image.trim()) payload.image_url = draft.image.trim()
    // Pertahankan data tambahan yang tidak ada di form ini
    if (editing?.raw?.gameBenchmarks) payload.gameBenchmarks = editing.raw.gameBenchmarks
    if (editing?.raw?.upgradeOptions) payload.upgradeOptions = editing.raw.upgradeOptions

    setSaving(true)
    try {
      if (editing) await adminApi.updateProduct(editing.id, payload)
      else await adminApi.createProduct(payload)
      await load(true)
      setNotice(editing ? `Produk "${payload.name}" diperbarui.` : `Produk "${payload.name}" ditambahkan.`)
      closeForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan produk.')
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(product: AdminProduct) {
    if (!window.confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setNotice('')
    try {
      await adminApi.deleteProduct(product.id)
      await load(true)
      setNotice(`Produk "${product.name}" dihapus.`)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal menghapus produk.')
    }
  }

  const activeMatcher = tabs.find((tab) => tab.label === activeTab)?.match ?? (() => true)
  const visibleProducts = items.filter(
    (product) => activeMatcher(product) && `${product.name} ${product.category} ${product.brand}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div className="toolbar-search"><Icon name="search" /><input aria-label="Cari produk" placeholder="Cari nama, kategori, atau brand" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <button className="btn btn-primary" type="button" onClick={() => (showForm ? closeForm() : openCreate())}><Icon name="plus" /> Tambah produk</button>
      </div>

      {notice && <section className="card" role="status"><p className="intro-copy">{notice}</p></section>}

      {showForm && (
        <form className="card product-form" onSubmit={saveProduct}>
          <PanelHeader title={editing ? 'Edit produk' : 'Produk baru'} note={editing ? `Mengubah ${editing.name}` : 'Produk disimpan ke database.'} />
          <div className="form-grid">
            <label>Nama produk<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Contoh: Ryzen 7 9800X3D" /></label>
            <label>Jenis
              <select value={draft.type} onChange={(event) => changeType(event.target.value)}>
                <option value="sparepart">Sparepart</option>
                <option value="prebuilt_pc">Prebuilt PC</option>
              </select>
            </label>
            <label>Kategori
              <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                {(isPrebuilt ? PREBUILT_CATEGORIES : SPAREPART_CATEGORIES).map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>Brand<input required value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} placeholder="Contoh: AMD" /></label>
            <label>Harga (Rp)<input required min="1" type="number" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="8500000" /></label>
            <label>Stok<input required min="0" type="number" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} /></label>
            <label>Status
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                {STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label>URL gambar<input type="url" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="https://..." /></label>
            {needsSocket && <label>Socket<input value={draft.socket} onChange={(event) => setDraft({ ...draft, socket: event.target.value })} placeholder="Contoh: AM5 atau LGA1700" /></label>}
            {needsRamType && (
              <label>Tipe RAM
                <select value={draft.ramType} onChange={(event) => setDraft({ ...draft, ramType: event.target.value })}>
                  <option value="">Pilih tipe</option>
                  <option>DDR4</option>
                  <option>DDR5</option>
                </select>
              </label>
            )}
            {needsWattage && <label>Daya (watt)<input min="1" type="number" value={draft.powerWattage} onChange={(event) => setDraft({ ...draft, powerWattage: event.target.value })} placeholder="Contoh: 750" /></label>}
          </div>
          {formError && <p role="alert" style={{ color: 'var(--status-danger)', margin: '8px 0 0' }}>{formError}</p>}
          <div className="form-actions">
            <button className="btn btn-outline" type="button" onClick={closeForm}>Batal</button>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Simpan produk'}</button>
          </div>
        </form>
      )}

      <div className="filter-tabs" role="tablist" aria-label="Jenis produk">
        {tabs.map((tab) => (
          <button className={`filter-tab ${activeTab === tab.label ? 'active' : ''}`} key={tab.label} onClick={() => setActiveTab(tab.label)} type="button" role="tab" aria-selected={activeTab === tab.label}>
            {tab.label}<span className="count">{items.filter(tab.match).length}</span>
          </button>
        ))}
      </div>

      <section>
        <div className="section-heading">
          <div><h2 className="section-title">Katalog produk</h2><p className="card-subtitle">{loading ? 'Memuat produk...' : `${visibleProducts.length} produk ditemukan`}</p></div>
          <span className="inventory-note"><i /> Terhubung ke database</span>
        </div>

        {error && <div className="card"><p className="intro-copy">{error}</p><button className="btn btn-outline" type="button" onClick={() => load()}>Coba lagi</button></div>}

        <div className="products-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className={`product-card-image product-visual product-visual-${index % 4}`} style={{ position: 'relative', overflow: 'hidden' }}>
                {product.image && <img src={product.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <span className="product-visual-mark">{product.type === 'prebuilt_pc' ? 'RC' : product.category.slice(0, 3).toUpperCase()}</span>
                <span className="product-card-badge"><StatusBadge status={product.status} /></span>
              </div>
              <div className="product-card-body">
                <p className="product-card-category">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-price">{formatRupiah(product.price)}</p>
                <div className="product-card-footer">
                  <span className="product-card-stock"><i className={`dot ${product.stock <= 5 ? 'low' : ''}`} />{product.stock === 0 ? 'Stok habis' : `${product.stock} unit tersedia`}</span>
                  <span style={{ display: 'flex', gap: 6 }}>
                    <button className="product-card-action-btn edit" type="button" title={`Edit ${product.name}`} aria-label={`Edit ${product.name}`} onClick={() => openEdit(product)}><Icon name="edit" /></button>
                    <button className="btn btn-outline" type="button" style={{ padding: '4px 10px', fontSize: 12 }} aria-label={`Hapus ${product.name}`} onClick={() => removeProduct(product)}>Hapus</button>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && !error && visibleProducts.length === 0 && <p className="intro-copy">Tidak ada produk yang cocok.</p>}
      </section>
    </div>
  )
}
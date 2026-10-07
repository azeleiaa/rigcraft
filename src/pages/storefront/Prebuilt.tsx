import { useState } from 'react'
import { Link } from 'react-router-dom'
import { prebuiltProducts } from '../../storefront/data'
import { ProductCard, StoreBreadcrumb } from '../../storefront/StorefrontUI'

export default function Prebuilt() {
  const [type, setType] = useState('Semua')
  const [sort, setSort] = useState('lowest')
  const [budget, setBudget] = useState('50000000')
  const [brand, setBrand] = useState('RigCraft Custom')
  const types = ['Semua', 'Gaming', 'Workstation', 'Office', 'Creator']
  const filtered = prebuiltProducts.filter((product) => (type === 'Semua' || product.category === type) && product.price <= Number(budget || 0) && (brand !== 'ASUS ROG' || product.name.includes('Vertex')))
    .sort((left, right) => sort === 'highest' ? right.price - left.price : left.price - right.price)

  return (
    <>
      <div className="sf-page-title-band"><div className="sf-container"><StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Prebuilt PC' }]} /><h1>Katalog Prebuilt PC</h1><p>Racikan teruji, tinggal pilih dan langsung main.</p></div></div>
      <section className="sf-container sf-catalog-layout sf-prebuilt-layout">
        <aside className="sf-filter-panel"><div className="sf-filter-heading"><h2>Filter PC</h2><button type="button" onClick={() => { setType('Semua'); setBrand('RigCraft Custom'); setBudget('50000000') }}>Reset Semua</button></div><fieldset><legend>Tipe PC</legend>{types.map((item) => <label className="sf-check-row" key={item}><input type="radio" name="prebuilt-type" checked={type === item} onChange={() => setType(item)} /><span>{item}</span></label>)}</fieldset><fieldset><legend>Budget Maksimal</legend><div className="sf-range-value"><span>Rp 0</span><span>{Number(budget).toLocaleString('id-ID')}</span></div><input className="sf-range" aria-label="Budget maksimal" type="range" min="5000000" max="50000000" step="1000000" value={budget} onChange={(event) => setBudget(event.target.value)} /><input className="sf-budget-input" type="number" value={budget} onChange={(event) => setBudget(event.target.value)} aria-label="Budget dalam rupiah" /></fieldset><fieldset><legend>Brand</legend>{['RigCraft Custom', 'ASUS ROG', 'MSI', 'Lenovo', 'HP'].map((item) => <label className="sf-check-row" key={item}><input type="radio" name="prebuilt-brand" checked={brand === item} onChange={() => setBrand(item)} /><span>{item}</span></label>)}</fieldset><div className="sf-filter-help"><span>Rakit sesuai keinginan<Link to="/rakit-pc">Mulai simulasi</Link></span></div></aside>
        <div className="sf-catalog-results"><div className="sf-catalog-toolbar"><p>Menampilkan <strong>{filtered.length}</strong> Prebuilt PC</p><label>Urutkan<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="lowest">Harga Terendah</option><option value="highest">Harga Tertinggi</option></select></label></div><div className="sf-product-grid sf-catalog-grid">{filtered.map((product) => <ProductCard product={product} kind="prebuilt" key={product.slug} />)}</div></div>
      </section>
    </>
  )
}
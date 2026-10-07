import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { builderComponents, formatRupiah } from '../../storefront/data'
import type { StoreProduct } from '../../storefront/data'
import { useStoreCart } from '../../storefront/StorefrontLayout'
import { StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

export default function Builder() {
  const [selected, setSelected] = useState<Record<string, number | null>>({ motherboard: 0, processor: 0, ram: 0, gpu: null, storage: null, psu: 0, cooling: null, case: null })
  const [assemblyIncluded, setAssemblyIncluded] = useState(true)
  const [added, setAdded] = useState(false)
  const { addToCart } = useStoreCart()
  const navigate = useNavigate()
  const selectedCount = Object.values(selected).filter((value) => value !== null).length
  const selectedOptions = builderComponents.map((component) => ({ component, option: selected[component.id] === null ? undefined : component.options[selected[component.id] ?? 0] }))
  const componentTotal = selectedOptions.reduce((total, item) => total + (item.option?.price ?? 0), 0)
  const total = componentTotal + (assemblyIncluded ? 250000 : 0)
  const estimatedPower = selectedOptions.reduce((totalPower, item) => totalPower + (item.option ? item.component.watt : 0), 0)
  const motherboard = selectedOptions.find((item) => item.component.id === 'motherboard')?.option
  const processor = selectedOptions.find((item) => item.component.id === 'processor')?.option
  const power = selectedOptions.find((item) => item.component.id === 'psu')?.option
  const socketsMismatch = Boolean(motherboard && processor && motherboard.socket !== processor.socket)
  const supply = Number(power?.socket.replace('W', '') ?? 0)
  const recommendedSupply = Math.max(550, Math.ceil((estimatedPower + 100) / 50) * 50)
  const powerWarning = Boolean(power && supply < recommendedSupply)

  function addBuild() {
    const description = selectedOptions.filter((item) => item.option).map((item) => item.option!.name).join(' · ')
    const product: StoreProduct = { slug: `custom-pc-${Date.now()}`, name: 'Custom RigCraft Build', category: 'Custom Build', price: total, description, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85', status: 'Tersedia' }
    addToCart(product)
    setAdded(true)
    window.setTimeout(() => navigate('/keranjang'), 500)
  }

  return (
    <div className="sf-container sf-builder-page"><StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Simulasi Rakit PC' }]} /><div className="sf-page-intro"><span className="sf-eyebrow">SMART PC BUILDER INDONESIA</span><h1>Simulasi PC Builder Cerdas</h1><p>Pilih komponen komputer custom di bawah ini. Sistem kami akan otomatis memverifikasi kompatibilitas soket, daya PSU, serta dimensi casing secara real-time.</p></div>
      <div className="sf-builder-status"><span className={`sf-compatibility ${socketsMismatch ? 'is-warning' : 'is-valid'}`}><StoreIcon name={socketsMismatch ? 'spark' : 'check'} /> {socketsMismatch ? 'Perlu Penyesuaian' : 'Kompatibel'}</span><span>{socketsMismatch ? 'Soket processor tidak cocok dengan motherboard.' : 'Semua komponen yang dipilih saat ini berfungsi bersama.'}</span><div><small>Estimasi Daya Total</small><strong>{estimatedPower}W <i>/ {recommendedSupply}W PSU</i></strong></div><div className="sf-power-meter"><span style={{ width: `${Math.min((estimatedPower / recommendedSupply) * 100, 100)}%` }} /></div><div className="sf-build-total"><small>Total Rakitan</small><strong>{formatRupiah(total)}</strong></div></div>
      <div className="sf-builder-content"><div className="sf-builder-parts">{builderComponents.map((component, index) => { const choice = selected[component.id]; const option = choice === null ? undefined : component.options[choice ?? 0]; return <article className={`sf-builder-part ${option ? 'is-filled' : ''}`} key={component.id}><span className="sf-builder-number">{String(index + 1).padStart(2, '0')}</span><span className="sf-builder-part-icon"><StoreIcon name={component.category === 'Processor' ? 'cpu' : component.category === 'GPU' ? 'gpu' : component.category === 'Power Supply' ? 'power' : component.category === 'Storage' ? 'storage' : component.category === 'RAM' ? 'ram' : 'board'} /></span><div className="sf-builder-part-info"><small>{component.category.toUpperCase()}</small><strong>{option?.name ?? 'Belum dipilih'}</strong><span>{option ? `${option.socket}${component.watt ? ` · ${component.watt}W` : ''}` : 'Pilih komponen yang kompatibel'}</span></div><div className="sf-builder-part-price">{option ? <><small>Harga</small><strong>{formatRupiah(option.price)}</strong></> : null}</div><label className="sf-part-select"><span className="sf-sr-only">Pilih {component.name}</span><select value={choice ?? ''} onChange={(event) => setSelected((current) => ({ ...current, [component.id]: event.target.value === '' ? null : Number(event.target.value) }))}><option value="">Pilih Part</option>{component.options.map((item, itemIndex) => <option key={item.name} value={itemIndex}>{item.name} · {formatRupiah(item.price)}</option>)}</select></label></article> })}</div>
        <aside className="sf-builder-aside"><div className="sf-build-completion"><div><span>Build selesai</span><strong>{selectedCount}<small> / {builderComponents.length} komponen</small></strong></div><div className="sf-completion-track"><span style={{ width: `${(selectedCount / builderComponents.length) * 100}%` }} /></div></div><div className="sf-build-checks"><p><StoreIcon name="check" /> Soket CPU & motherboard {socketsMismatch ? 'tidak cocok' : 'cocok'}</p><p className={powerWarning ? 'is-warning' : ''}><StoreIcon name={powerWarning ? 'spark' : 'check'} /> PSU {powerWarning ? 'di bawah rekomendasi minimum' : 'mencukupi kebutuhan daya'}</p><p><StoreIcon name="shield" /> Garansi resmi setiap komponen</p></div>{powerWarning && <div className="sf-builder-warning"><StoreIcon name="spark" /> Daya PSU kurang dari rekomendasi minimum {recommendedSupply}W.</div>}<label className="sf-assembly-option"><input type="checkbox" checked={assemblyIncluded} onChange={(event) => setAssemblyIncluded(event.target.checked)} /><span><strong>Jasa Rakit Profesional + Instalasi OS</strong><small>Dirakit teknisi berpengalaman dan stress test 24 jam.</small></span><b>+ Rp 250.000</b></label><button className="sf-button sf-build-add" type="button" onClick={addBuild} disabled={selectedCount !== builderComponents.length || socketsMismatch || powerWarning}>{added ? 'Build ditambahkan' : 'Tambah ke Keranjang'} <StoreIcon name="arrow" /></button><p className="sf-builder-hint">Pilih {builderComponents.length - selectedCount} komponen lagi untuk melanjutkan.</p></aside></div>
    </div>
  )
}
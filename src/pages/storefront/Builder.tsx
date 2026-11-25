import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { builderApi, productsApi, type BuilderResult } from '../../lib/api'
import { mapProduct, type MappedProduct } from '../../lib/productMapper'
import { formatRupiah } from '../../storefront/data'
import { useStoreCart } from '../../storefront/StorefrontLayout'
import { StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

// keys = kata kunci yang dicocokkan ke category dari backend
const slots = [
  { id: 'motherboard', label: 'Motherboard', keys: ['motherboard', 'mobo'] },
  { id: 'processor', label: 'Processor (CPU)', keys: ['cpu', 'processor'] },
  { id: 'ram', label: 'RAM (Memory)', keys: ['ram', 'memory'] },
  { id: 'gpu', label: 'Kartu Grafis (VGA)', keys: ['gpu', 'vga'] },
  { id: 'storage', label: 'Penyimpanan (SSD/HDD)', keys: ['ssd', 'hdd', 'storage'] },
  { id: 'psu', label: 'Power Supply (PSU)', keys: ['psu', 'power'] },
  { id: 'cooling', label: 'Pendingin (Cooler)', keys: ['cooling', 'cooler'] },
  { id: 'case', label: 'Casing', keys: ['casing', 'case'] },
]

// Komponen yang dikirim ke /builder/validate
const CORE_IDS = ['processor', 'motherboard', 'ram', 'gpu', 'psu']

function iconFor(slotId: string) {
  if (slotId === 'processor') return 'cpu' as const
  if (slotId === 'gpu') return 'gpu' as const
  if (slotId === 'psu') return 'power' as const
  if (slotId === 'storage') return 'storage' as const
  if (slotId === 'ram') return 'ram' as const
  if (slotId === 'case') return 'case' as const
  return 'board' as const
}

function specOf(product?: MappedProduct): Record<string, any> {
  return (product?.raw?.specs ?? {}) as Record<string, any>
}

function specLine(product: MappedProduct) {
  const specs = specOf(product)
  const parts: string[] = []
  if (specs.socket) parts.push(String(specs.socket))
  if (specs.ramType) parts.push(String(specs.ramType))
  if (specs.powerWattage) parts.push(`${specs.powerWattage}W`)
  return parts.length ? parts.join(' · ') : product.brand
}

function mismatch(a?: unknown, b?: unknown) {
  if (!a || !b) return false
  return String(a).trim().toLowerCase() !== String(b).trim().toLowerCase()
}

// Petunjuk visual saja ("TIDAK COCOK"); keputusan akhir tetap dari server
function hintIncompatible(slotId: string, item: MappedProduct, picked: Record<string, MappedProduct | undefined>) {
  const specs = specOf(item)
  if (slotId === 'processor') return mismatch(specs.socket, specOf(picked.motherboard).socket)
  if (slotId === 'motherboard') {
    return mismatch(specs.socket, specOf(picked.processor).socket) || mismatch(specs.ramType, specOf(picked.ram).ramType)
  }
  if (slotId === 'ram') return mismatch(specs.ramType, specOf(picked.motherboard).ramType)
  return false
}

export default function Builder() {
  const [products, setProducts] = useState<MappedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState<Record<string, string | null>>({})
  const [validation, setValidation] = useState<BuilderResult | null>(null)
  const [validating, setValidating] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [added, setAdded] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const { addToCart } = useStoreCart()
  const navigate = useNavigate()

  // Ambil semua sparepart dari backend
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        const res = await productsApi.getAll({ type: 'sparepart', per_page: 100 })
        if (cancelled) return
        setProducts((res.data ?? []).map(mapProduct).filter((item) => item.type !== 'prebuilt_pc'))
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Gagal memuat komponen.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useLayoutEffect(() => {
    const page = document.querySelector<HTMLElement>('.sf-builder-page')
    const header = document.querySelector<HTMLElement>('.sf-header')
    const status = page?.querySelector<HTMLElement>('.sf-builder-status')
    if (!page || !header || !status) return

    const updateStickyHeights = () => {
      page.style.setProperty('--nav-h', `${header.getBoundingClientRect().height}px`)
      page.style.setProperty('--bar-h', `${status.getBoundingClientRect().height}px`)
    }
    const observer = new ResizeObserver(updateStickyHeights)
    observer.observe(header)
    observer.observe(status)
    updateStickyHeights()

    return () => observer.disconnect()
  }, [])

  // Kelompokkan produk ke slot, urut dari termurah
  const optionsBySlot = useMemo(() => {
    const map: Record<string, MappedProduct[]> = {}
    for (const slot of slots) map[slot.id] = []
    for (const product of products) {
      const category = product.category.toLowerCase()
      const slot = slots.find((s) => s.keys.some((key) => category.includes(key)))
      if (slot) map[slot.id].push(product)
    }
    for (const slot of slots) map[slot.id].sort((a, b) => a.price - b.price)
    return map
  }, [products])

  const picked: Record<string, MappedProduct | undefined> = {}
  for (const slot of slots) {
    picked[slot.id] = (optionsBySlot[slot.id] ?? []).find((item) => item.id === selected[slot.id])
  }

  const availableSlots = slots.filter((slot) => (optionsBySlot[slot.id] ?? []).length > 0)
  const unavailableSlots = slots.filter((slot) => (optionsBySlot[slot.id] ?? []).length === 0)
  const requiredCount = availableSlots.length
  const selectedCount = availableSlots.filter((slot) => picked[slot.id]).length
  const total = slots.reduce((sum, slot) => sum + (picked[slot.id]?.price ?? 0), 0)

  // Pilihan yang dikirim ke server untuk divalidasi
  const coreSelection: Record<string, string> = {}
  for (const id of CORE_IDS) {
    const value = picked[id]?.id
    if (value) coreSelection[id] = value
  }
  const coreCount = Object.keys(coreSelection).length
  const validationKey = JSON.stringify(coreSelection)

  useEffect(() => {
    setValidation(null)
    setValidationError('')
    if (coreCount < 2) {
      setValidating(false)
      return
    }
    let cancelled = false
    setValidating(true)
    const timer = window.setTimeout(() => {
      builderApi
        .validate(coreSelection)
        .then((data) => { if (!cancelled) setValidation(data) })
        .catch((err) => { if (!cancelled) setValidationError(err instanceof Error ? err.message : 'Gagal memeriksa.') })
        .finally(() => { if (!cancelled) setValidating(false) })
    }, 350)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationKey])

  const hasIssues = validation ? !validation.compatible : Boolean(validationError)
  const estimated = validation?.estimatedWattage ?? 0
  const recommended = validation?.recommendedPsuWattage ?? 0
  const powerWarning = validation?.checks?.wattage === false
  const serverMessages = validation ? [...validation.issues.map((issue) => issue.message), ...validation.warnings] : []

  let statusMessage = 'Pilih komponen untuk mulai memeriksa kompatibilitas.'
  if (selectedCount > 0 && coreCount < 2) statusMessage = 'Pilih minimal dua komponen inti (CPU, motherboard, RAM, GPU, PSU) agar bisa diperiksa.'
  else if (validating) statusMessage = 'Memeriksa kompatibilitas ke server...'
  else if (validationError) statusMessage = `Belum bisa memeriksa: ${validationError}`
  else if (validation) {
    statusMessage = validation.issues.length
      ? validation.issues.map((issue) => issue.message).join(' ')
      : validation.warnings[0] ?? 'Komponen yang dipilih sejauh ini kompatibel.'
  }

  const badgeLabel = validation ? (validation.compatible ? 'Kompatibel' : 'Perlu Penyesuaian') : validating ? 'Memeriksa' : validationError ? 'Gagal Memeriksa' : 'Belum Diperiksa'
  const badgeClass = validation ? (validation.compatible ? 'is-valid' : 'is-warning') : validationError ? 'is-warning' : ''

  function checkLine(key: string, label: string, okText: string, badText: string) {
    const value = validation?.checks?.[key]
    const bad = value === false
    return (
      <p className={bad ? 'is-warning' : ''}>
        <StoreIcon name={bad ? 'spark' : value ? 'check' : 'shield'} /> {label} {value === undefined ? 'belum diperiksa' : value ? okText : badText}
      </p>
    )
  }

  function choose(slotId: string, productId: string | null) {
    setSelected((current) => ({ ...current, [slotId]: productId }))
    setAdded(false)
    setOpenId(null)
  }

  // Tiap komponen masuk keranjang sebagai produk asli, jadi bisa dipesan di checkout
  function addBuild() {
    slots.forEach((slot) => {
      const product = picked[slot.id]
      if (product) addToCart(product, 1)
    })
    setAdded(true)
    window.setTimeout(() => navigate('/keranjang'), 500)
  }

  const canAdd = requiredCount > 0 && selectedCount === requiredCount && !validating && Boolean(validation?.compatible)
  let hint = 'Siap dimasukkan ke keranjang.'
  if (selectedCount < requiredCount) hint = `Pilih ${requiredCount - selectedCount} komponen lagi untuk melanjutkan.`
  else if (validating) hint = 'Menunggu hasil pemeriksaan kompatibilitas.'
  else if (!validation) hint = 'Kompatibilitas belum bisa diperiksa.'
  else if (!validation.compatible) hint = 'Perbaiki masalah kompatibilitas dulu.'

  return (
    <div className="sf-container sf-builder-page">
      <StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Simulasi Rakit PC' }]} />
      <div className="sf-page-intro">
        <span className="sf-eyebrow">SMART PC BUILDER INDONESIA</span>
        <h1>Simulasi PC Builder Cerdas</h1>
        <p>Pilih komponen komputer custom di bawah ini. Server RigCraft akan memeriksa kecocokan soket, tipe RAM, dan kebutuhan daya PSU secara real-time.</p>
      </div>

      <div className={`sf-builder-status ${hasIssues ? 'is-warning' : 'is-valid'}`}>
        <div className="sf-status-state">
          <span className={`sf-compatibility ${badgeClass}`}>
            <StoreIcon name={badgeClass === 'is-valid' ? 'check' : 'spark'} /> {badgeLabel}
          </span>
          <span className="sf-status-message">{statusMessage}</span>
        </div>
        <div className="sf-status-power">
          <div className="sf-status-power-copy">
            <small>Estimasi Daya</small>
            <strong>{validation ? `${estimated}W` : '—'} <i>/ rekomendasi PSU {validation ? `${recommended}W` : '—'}</i></strong>
          </div>
          <div className={`sf-power-meter ${powerWarning ? 'is-warning' : ''}`}>
            <span style={{ width: `${recommended > 0 ? Math.min((estimated / recommended) * 100, 100) : 0}%` }} />
          </div>
        </div>
        <div className="sf-build-total">
          <small>Total Rakitan</small>
          <strong>{formatRupiah(total)}</strong>
        </div>
      </div>

      <div className="sf-builder-content">
        <div className="sf-builder-parts">
          {loading && <div className="sf-empty-results"><StoreIcon name="search" /><h2>Memuat komponen...</h2><p>Server mungkin butuh beberapa detik jika baru bangun.</p></div>}
          {!loading && loadError && <div className="sf-empty-results"><StoreIcon name="search" /><h2>Gagal memuat komponen</h2><p>{loadError}</p></div>}

          {!loading && !loadError && slots.map((slot, index) => {
            const options = optionsBySlot[slot.id] ?? []
            const option = picked[slot.id]
            const isOpen = openId === slot.id
            const unavailable = options.length === 0

            return (
              <div className="sf-builder-part-wrap" key={slot.id}>
                <article className={`sf-builder-part ${option ? 'is-filled' : ''} ${isOpen ? 'is-open' : ''}`}>
                  <span className="sf-builder-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="sf-builder-part-icon sf-builder-thumb">
                    {option?.image ? <img src={option.image} alt={option.name} /> : <StoreIcon name={iconFor(slot.id)} />}
                  </span>
                  <div className="sf-builder-part-info">
                    <small>{slot.label.toUpperCase()}</small>
                    <strong>{option?.name ?? (unavailable ? 'Belum tersedia di katalog' : 'Belum dipilih')}</strong>
                    <span>{option ? specLine(option) : unavailable ? 'Produk belum ditambahkan di backend' : 'Pilih komponen yang kompatibel'}</span>
                  </div>
                  <div className="sf-builder-part-price">
                    {option ? <><small>Harga</small><strong>{formatRupiah(option.price)}</strong></> : null}
                  </div>
                  <button
                    type="button"
                    className="sf-part-trigger"
                    aria-expanded={isOpen}
                    disabled={unavailable}
                    onClick={() => setOpenId(isOpen ? null : slot.id)}
                  >
                    {unavailable ? 'Belum tersedia' : option ? 'Ganti Part' : 'Pilih Part'}
                    {!unavailable && <span className="sf-part-trigger-arrow" aria-hidden="true">{isOpen ? '▴' : '▾'}</span>}
                  </button>
                </article>

                {isOpen && (
                  <div className="sf-pick-panel">
                    <div className="sf-pick-panel-head">
                      <span>Menampilkan <strong>{options.length}</strong> {slot.label}</span>
                      {option && <button type="button" onClick={() => choose(slot.id, null)}>Hapus pilihan</button>}
                    </div>
                    <div className="sf-pick-grid">
                      {options.map((item) => {
                        const isSelected = option?.id === item.id
                        const soldOut = item.status === 'Habis'
                        const incompatible = !isSelected && hintIncompatible(slot.id, item, picked)

                        return (
                          <button
                            type="button"
                            key={item.id}
                            disabled={soldOut}
                            className={`sf-pick-card ${isSelected ? 'is-selected' : ''} ${incompatible || soldOut ? 'is-incompatible' : ''}`}
                            onClick={() => choose(slot.id, item.id)}
                          >
                            <span className="sf-pick-media">
                              {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : <StoreIcon name={iconFor(slot.id)} />}
                              {isSelected && <span className="sf-pick-badge">DIPILIH</span>}
                              {!isSelected && soldOut && <span className="sf-pick-badge is-warning">HABIS</span>}
                              {!isSelected && !soldOut && incompatible && <span className="sf-pick-badge is-warning">TIDAK COCOK</span>}
                            </span>
                            <span className="sf-pick-tag">{slot.label.toUpperCase()}</span>
                            <strong className="sf-pick-name">{item.name}</strong>
                            <span className="sf-pick-spec">{specLine(item)}</span>
                            <span className="sf-pick-foot">
                              <span><small>Harga</small><b>{formatRupiah(item.price)}</b></span>
                              <span className="sf-pick-add">{isSelected ? '✓' : '+'}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <aside className="sf-builder-aside">
          <div className="sf-build-completion">
            <div>
              <span>Build selesai</span>
              <strong>{selectedCount}<small> / {requiredCount} komponen</small></strong>
            </div>
            <div className="sf-completion-track"><span style={{ width: `${requiredCount ? (selectedCount / requiredCount) * 100 : 0}%` }} /></div>
          </div>

          <div className="sf-build-checks">
            {checkLine('socket', 'Soket CPU & motherboard', 'cocok', 'tidak cocok')}
            {checkLine('ram', 'Tipe RAM & motherboard', 'cocok', 'tidak cocok')}
            {checkLine('wattage', 'Daya PSU', 'mencukupi kebutuhan', 'di bawah kebutuhan')}
            <p><StoreIcon name="shield" /> Garansi resmi setiap komponen</p>
          </div>

          {serverMessages.map((message) => (
            <div className="sf-builder-warning" key={message}><StoreIcon name="spark" /> {message}</div>
          ))}

          <p className="sf-builder-hint">Jasa rakit &amp; instalasi OS belum bisa dipesan online. Tanyakan lewat Konsultasi.</p>

          <button className="sf-button sf-build-add" type="button" onClick={addBuild} disabled={!canAdd}>
            {added ? 'Build ditambahkan' : 'Tambah ke Keranjang'} <StoreIcon name="arrow" />
          </button>
          <p className="sf-builder-hint">{hint}</p>
          {unavailableSlots.length > 0 && (
            <p className="sf-builder-hint">Belum ada di katalog: {unavailableSlots.map((slot) => slot.label).join(', ')}.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
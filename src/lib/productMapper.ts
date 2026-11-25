import type { StoreProduct, ProductSpec, ProductBenchmark } from '../storefront/data'

export interface StoreUpgrade {
  title: string
  detail: string
  price: number
  image: string
}

export interface MappedProduct extends StoreProduct {
  id: string
  brand: string
  stock: number
  type: string
  upgrades: StoreUpgrade[]
  raw: any
}

const SPEC_LABELS: Record<string, string> = {
  processor: 'Processor',
  gpu: 'GPU',
  motherboard: 'Motherboard',
  ram: 'RAM',
  storage: 'Storage',
  psu: 'PSU',
  casing: 'Casing',
  cooling: 'Cooling',
  os: 'OS',
  warranty: 'Garansi',
  socket: 'Socket',
  ramType: 'Tipe RAM',
  powerWattage: 'Daya (Watt)',
}

function labelFor(key: string): string {
  if (SPEC_LABELS[key]) return SPEC_LABELS[key]
  const spaced = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export function specsToTuples(specs: unknown): ProductSpec[] {
  if (Array.isArray(specs)) {
    return specs.filter((s) => Array.isArray(s)).map((s) => [String(s[0]), String(s[1])] as ProductSpec)
  }
  if (!specs || typeof specs !== 'object') return []
  return Object.entries(specs as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== '' && typeof v !== 'object')
    .map(([k, v]) => [labelFor(k), k === 'powerWattage' ? `${v} W` : String(v)] as ProductSpec)
}

export function benchmarksToStore(list: unknown): ProductBenchmark[] {
  if (!Array.isArray(list)) return []
  const rows = list.map((b: any) => ({
    game: b.setting ? `${b.gameName} (${b.setting})` : String(b.gameName ?? b.game ?? ''),
    fps: Number(b.avgFps ?? b.fps ?? 0),
  }))
  const max = Math.max(400, ...rows.map((r) => r.fps))
  return rows.map((r) => ({ ...r, max }))
}

export function upgradesToStore(list: unknown, fallbackImage: string): StoreUpgrade[] {
  if (!Array.isArray(list)) return []
  return list.map((u: any) => ({
    title: String(u.title ?? ''),
    detail: String(u.description ?? u.detail ?? ''),
    price: Number(u.additionalPrice ?? u.price ?? 0),
    image: String(u.image ?? u.image_url ?? fallbackImage),
  }))
}

export function mapProduct(p: any): MappedProduct {
  const id = String(p._id ?? p.id ?? '')
  const image = String(p.image ?? p.image_url ?? '')
  const specs = specsToTuples(p.specs)
  const hasStock = p.stock === undefined || p.stock === null || Number(p.stock) > 0
  const isActive = p.status === undefined || p.status === 'Aktif' || p.status === 'Tersedia'
  const description =
    p.description || specs.slice(0, 4).map(([, value]) => value).join(' · ')

  return {
    slug: id,
    id,
    name: String(p.name ?? ''),
    category: String(p.category ?? ''),
    brand: String(p.brand ?? ''),
    type: String(p.type ?? ''),
    price: Number(p.price ?? 0),
    stock: Number(p.stock ?? 0),
    description: String(description),
    image,
    status: isActive && hasStock ? 'Tersedia' : 'Habis',
    specs,
    benchmarks: benchmarksToStore(p.gameBenchmarks),
    upgrades: upgradesToStore(p.upgradeOptions, image),
    raw: p,
  }
}
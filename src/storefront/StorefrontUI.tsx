import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { StoreProduct } from './data'
import { formatRupiah } from './data'
import { useStoreCart } from './StorefrontLayout'

export function StoreIcon({ name }: { name: string }) {
  const shapes: Record<string, ReactNode> = {
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" /></>,
    gpu: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M7 18v3m10-3v3M7 3v3m10-3v3" /></>,
    ram: <><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7v4m4-4v4m4-4v4m4-4v4M7 17v3m4-3v3m4-3v3m4-3v3" /></>,
    storage: <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
    board: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="8" y="8" width="8" height="5" rx="1" /><path d="M8 16h2m4 0h2M4 9H2m2 5H2m20-5h-2m2 5h-2" /></>,
    power: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m13 6-5 7h4l-1 5 5-7h-4l1-5Z" /></>,
    case: <><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M10 7h4m-4 4h4m-4 4h4" /><circle cx="12" cy="18" r=".6" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    truck: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="17.5" cy="19" r="1.5" /></>,
    support: <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><path d="M4 14h3v6H6a2 2 0 0 1-2-2v-4Zm16 0h-3v6h1a2 2 0 0 0 2-2v-4Z" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18m-14 5h4" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    plus: <><path d="M12 5v14m-7-7h14" /></>,
    minus: <><path d="M5 12h14" /></>,
    trash: <><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" /></>,
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
  }
  return <svg className="sf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name] ?? shapes.spark}</svg>
}

export function StoreBreadcrumb({ items }: { items: Array<{ label: string; to?: string }> }) {
  return <nav className="sf-breadcrumb" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{index > 0 && <b>/</b>}{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>
}

export function ProductCard({ product, kind = 'component' }: { product: StoreProduct; kind?: 'component' | 'prebuilt' }) {
  const { addToCart } = useStoreCart()
  const href = kind === 'prebuilt' ? `/prebuilt-pc/${product.slug}` : `/produk/${product.slug}`
  return (
    <article className={`sf-product-card ${kind === 'prebuilt' ? 'is-prebuilt' : ''}`}>
      <Link className="sf-product-image" to={href}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="sf-product-status">{product.status === 'Tersedia' ? 'Tersedia' : 'Habis'}</span>
        {product.featured && <span className="sf-featured-tag">{product.featured}</span>}
      </Link>
      <div className="sf-product-body">
        <Link className="sf-product-category" to={`/katalog?kategori=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <Link className="sf-product-name" to={href}>{product.name}</Link>
        <p className="sf-product-description">{product.description}</p>
        <div className="sf-product-bottom"><div><span className="sf-price-label">Harga</span><strong>{formatRupiah(product.price)}</strong></div>{kind === 'prebuilt' ? <Link className="sf-button sf-button-small" to={href}>Lihat detail</Link> : <button className="sf-icon-add" type="button" aria-label={`Tambah ${product.name} ke keranjang`} onClick={() => addToCart(product)} disabled={product.status === 'Habis'}><StoreIcon name="plus" /></button>}</div>
      </div>
    </article>
  )
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return <div className={`sf-section-heading align-${align}`}><span className="sf-eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>
}
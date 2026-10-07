import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatRupiah } from '../../storefront/data'
import type { StoreProduct } from '../../storefront/data'
import { useStoreCart } from '../../storefront/StorefrontLayout'
import { StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

function productPath(product: StoreProduct) {
  if (product.category === 'Custom Build' || product.category === 'Upgrade') return undefined
  return product.category === 'Gaming' ? `/prebuilt-pc/${product.slug}` : `/produk/${product.slug}`
}

export default function Cart() {
  const { items, subtotal, setQuantity, removeFromCart } = useStoreCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const navigate = useNavigate()
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal >= 1500000 || subtotal === 0 ? 0 : 25000
  const total = subtotal - discount + shipping

  function applyCoupon() {
    if (couponInput.trim().toUpperCase() === 'RIGCRAFT10') {
      setCouponApplied(true)
      setCouponMessage('Diskon 10% berhasil diterapkan.')
    } else {
      setCouponApplied(false)
      setCouponMessage('Kode promo tidak valid.')
    }
  }

  return (
    <div className="sf-container sf-flow-page">
      <StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Keranjang' }]} />
      <div className="sf-flow-heading"><div><span className="sf-eyebrow">RIGCRAFT CHECKOUT</span><h1>Keranjang Belanja</h1></div><span className="sf-cart-step">01 <i>Keranjang</i> <b>—</b> 02 Pengiriman <b>—</b> 03 Pembayaran</span></div>
      {items.length === 0 ? <div className="sf-empty-cart"><span className="sf-empty-cart-icon"><StoreIcon name="card" /></span><h2>Keranjangmu masih kosong</h2><p>Yuk, temukan komponen untuk membangun setup impianmu.</p><Link className="sf-button" to="/katalog">Jelajahi katalog <StoreIcon name="arrow" /></Link></div> : <div className="sf-cart-layout"><div className="sf-cart-lines"><div className="sf-cart-note">Kamu memiliki <strong>{items.reduce((count, item) => count + item.quantity, 0)} item</strong> unik di dalam keranjang belanja.</div>{items.map(({ product, quantity }) => { const href = productPath(product); return <article className="sf-cart-item" key={product.slug}><div className="sf-cart-image"><img src={product.image} alt={product.name} /></div><div className="sf-cart-product">{href ? <Link to={href}>{product.name}</Link> : <strong>{product.name}</strong>}<span>{product.category}</span><small>{formatRupiah(product.price)} / unit</small></div><div className="sf-cart-quantity"><span>Jumlah</span><div><button type="button" aria-label={`Kurangi jumlah ${product.name}`} onClick={() => quantity === 1 ? removeFromCart(product.slug) : setQuantity(product.slug, quantity - 1)}><StoreIcon name="minus" /></button><strong>{quantity}</strong><button type="button" aria-label={`Tambah jumlah ${product.name}`} onClick={() => setQuantity(product.slug, quantity + 1)}><StoreIcon name="plus" /></button></div></div><strong className="sf-cart-line-total">{formatRupiah(product.price * quantity)}</strong><button className="sf-remove-item" type="button" aria-label={`Hapus ${product.name}`} onClick={() => removeFromCart(product.slug)}><StoreIcon name="trash" /></button></article> })}<div className="sf-shipping-promo"><StoreIcon name="truck" /><span><strong>{subtotal >= 1500000 ? 'Kamu mendapatkan Gratis Ongkir!' : `Tambah ${formatRupiah(1500000 - subtotal)} untuk Gratis Ongkir!`}</strong><small>Untuk pengiriman ke seluruh wilayah Jabodetabek dengan asuransi penuh.</small></span></div><Link className="sf-continue-shopping" to="/katalog">← Lanjut belanja</Link></div>
        <aside className="sf-order-summary"><h2>Ringkasan Pesanan</h2><p><span>Subtotal ({items.length} produk)</span><strong>{formatRupiah(subtotal)}</strong></p><p><span>Diskon</span><strong className="sf-discount">{discount ? `-${formatRupiah(discount)}` : 'Rp 0'}</strong></p><p><span>Estimasi Ongkir</span><strong>{shipping ? formatRupiah(shipping) : 'Rp 0'}</strong></p><span className="sf-free-label">GRATIS ONGKIR</span><div className="sf-summary-divider" /><label className="sf-coupon-label" htmlFor="coupon">Kode Voucher / Promo</label><div className="sf-coupon"><input id="coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Masukkan kode promo" /><button type="button" onClick={applyCoupon}>Terapkan</button></div>{couponMessage && <p className={`sf-coupon-message ${couponApplied ? 'is-success' : ''}`}>{couponMessage}</p>}<p className="sf-total-row"><span>Total Harga</span><strong>{formatRupiah(total)}</strong></p><button className="sf-button sf-summary-button" type="button" onClick={() => navigate('/checkout')}>Lanjut ke Pembayaran <StoreIcon name="arrow" /></button><small className="sf-secure-note"><StoreIcon name="shield" /> Transaksi Aman & Terenkripsi</small></aside></div>}
    </div>
  )
}
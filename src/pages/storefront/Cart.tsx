import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatRupiah } from '../../storefront/data'
import { isOrderable, useStoreCart, type CartProduct } from '../../storefront/StorefrontLayout'
import { StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

function productPath(product: CartProduct) {
  if (!isOrderable(product)) return undefined
  return product.type === 'prebuilt_pc' ? `/prebuilt-pc/${product.slug}` : `/produk/${product.slug}`
}

export default function Cart() {
  const { items, subtotal, voucher, setQuantity, removeFromCart, applyVoucher, removeVoucher } = useStoreCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const navigate = useNavigate()

  const discount = voucher?.discount ?? 0
  const shipping = subtotal >= 1500000 || subtotal === 0 ? 0 : 25000
  const total = subtotal - discount + shipping
  const totalQuantity = items.reduce((count, item) => count + item.quantity, 0)

  async function applyCoupon() {
    const code = couponInput.trim()
    if (!code) {
      setCouponMessage('Masukkan kode promo dulu.')
      return
    }
    setApplying(true)
    try {
      setCouponMessage(await applyVoucher(code))
    } catch (err) {
      setCouponMessage(err instanceof Error ? err.message : 'Kode promo tidak valid.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="sf-container sf-flow-page">
      <StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Keranjang' }]} />
      <div className="sf-flow-heading">
        <div><span className="sf-eyebrow">RIGCRAFT CHECKOUT</span><h1>Keranjang Belanja</h1></div>
        <span className="sf-cart-step">01 <i>Keranjang</i> <b>—</b> 02 Pengiriman <b>—</b> 03 Pembayaran</span>
      </div>

      {items.length === 0 ? (
        <div className="sf-empty-cart">
          <span className="sf-empty-cart-icon"><StoreIcon name="card" /></span>
          <h2>Keranjangmu masih kosong</h2>
          <p>Yuk, temukan komponen untuk membangun setup impianmu.</p>
          <Link className="sf-button" to="/katalog">Jelajahi katalog <StoreIcon name="arrow" /></Link>
        </div>
      ) : (
        <div className="sf-cart-layout">
          <div className="sf-cart-lines">
            <div className="sf-cart-note">Kamu memiliki <strong>{totalQuantity} item</strong> di dalam keranjang belanja.</div>

            {items.map(({ product, quantity }) => {
              const href = productPath(product)
              return (
                <article className="sf-cart-item" key={product.slug}>
                  <div className="sf-cart-image"><img src={product.image} alt={product.name} /></div>
                  <div className="sf-cart-product">
                    {href ? <Link to={href}>{product.name}</Link> : <strong>{product.name}</strong>}
                    <span>{product.category}</span>
                    <small>{formatRupiah(product.price)} / unit</small>
                    {!isOrderable(product) && <small>Item ini belum bisa diproses lewat checkout.</small>}
                  </div>
                  <div className="sf-cart-quantity">
                    <span>Jumlah</span>
                    <div>
                      <button type="button" aria-label={`Kurangi jumlah ${product.name}`} onClick={() => quantity === 1 ? removeFromCart(product.slug) : setQuantity(product.slug, quantity - 1)}><StoreIcon name="minus" /></button>
                      <strong>{quantity}</strong>
                      <button type="button" aria-label={`Tambah jumlah ${product.name}`} onClick={() => setQuantity(product.slug, quantity + 1)}><StoreIcon name="plus" /></button>
                    </div>
                  </div>
                  <strong className="sf-cart-line-total">{formatRupiah(product.price * quantity)}</strong>
                  <button className="sf-remove-item" type="button" aria-label={`Hapus ${product.name}`} onClick={() => removeFromCart(product.slug)}><StoreIcon name="trash" /></button>
                </article>
              )
            })}

            <div className="sf-shipping-promo">
              <StoreIcon name="truck" />
              <span>
                <strong>{subtotal >= 1500000 ? 'Kamu mendapatkan Gratis Ongkir!' : `Tambah ${formatRupiah(1500000 - subtotal)} untuk Gratis Ongkir!`}</strong>
                <small>Untuk pengiriman ke seluruh wilayah Jabodetabek dengan asuransi penuh.</small>
              </span>
            </div>
            <Link className="sf-continue-shopping" to="/katalog">← Lanjut belanja</Link>
          </div>

          <aside className="sf-order-summary">
            <h2>Ringkasan Pesanan</h2>
            <p><span>Subtotal ({items.length} produk)</span><strong>{formatRupiah(subtotal)}</strong></p>
            <p><span>Diskon{voucher ? ` (${voucher.code})` : ''}</span><strong className="sf-discount">{discount ? `-${formatRupiah(discount)}` : 'Rp 0'}</strong></p>
            <p><span>Estimasi Ongkir</span><strong>{shipping ? formatRupiah(shipping) : 'Rp 0'}</strong></p>
            {shipping === 0 && subtotal > 0 && <span className="sf-free-label">GRATIS ONGKIR</span>}
            <div className="sf-summary-divider" />
            <label className="sf-coupon-label" htmlFor="coupon">Kode Voucher / Promo</label>
            <div className="sf-coupon">
              <input id="coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Masukkan kode promo" />
              <button type="button" onClick={applyCoupon} disabled={applying}>{applying ? '...' : 'Terapkan'}</button>
            </div>
            {couponMessage && <p className={`sf-coupon-message ${voucher ? 'is-success' : ''}`}>{couponMessage}</p>}
            {voucher && <button className="sf-text-link" type="button" onClick={() => { removeVoucher(); setCouponMessage('') }}>Hapus voucher {voucher.code}</button>}
            <p className="sf-total-row"><span>Total Harga</span><strong>{formatRupiah(total)}</strong></p>
            <button className="sf-button sf-summary-button" type="button" onClick={() => navigate('/checkout')}>Lanjut ke Pembayaran <StoreIcon name="arrow" /></button>
            <small className="sf-secure-note"><StoreIcon name="shield" /> Transaksi Aman & Terenkripsi</small>
          </aside>
        </div>
      )}
    </div>
  )
}
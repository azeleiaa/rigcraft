import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi, ordersApi } from '../../lib/api'
import { formatRupiah } from '../../storefront/data'
import { isOrderable, useStoreCart } from '../../storefront/StorefrontLayout'
import { StoreBreadcrumb, StoreIcon } from '../../storefront/StorefrontUI'

const shippingOptions = [
  { name: 'JNE Reguler (3–5 Hari Kerja)', detail: 'Pengiriman standar dengan asuransi kehilangan komponen penuh.', price: 25000 },
  { name: 'SiCepat Express (1–2 Hari Kerja)', detail: 'Prioritas kirim aman sampai ke seluruh Jabodetabek.', price: 35000 },
  { name: 'GoSend Same Day (Hari Ini)', detail: 'Instan untuk khusus Jakarta dan sekitarnya (maks. 40km dari HQ).', price: 50000 },
]

const payments = [
  { name: 'Transfer Bank (Verifikasi Otomatis)', detail: 'BCA, Mandiri, BNI Virtual Account', mark: 'VIRTUAL ACCOUNT' },
  { name: 'E-Wallet & QRIS', detail: 'GoPay, ShopeePay, OVO, Dana', mark: 'QRIS / INSTAN' },
  { name: 'Kartu Kredit / Debit Online', detail: 'Visa, Mastercard, JCB', mark: 'CC SECURE' },
]

export default function Checkout() {
  const { items, subtotal, voucher, clearCart, removeFromCart, applyVoucher, removeVoucher } = useStoreCart()
  const [shippingIndex, setShippingIndex] = useState(0)
  const [paymentIndex, setPaymentIndex] = useState(0)
  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ orderNumber: string; total: number } | null>(null)

  const token = authApi.getToken()
  const user: any = authApi.getUser()
  const blocked = items.filter((item) => !isOrderable(item.product))
  const discount = voucher?.discount ?? 0
  const shippingCost = subtotal >= 1500000 ? 0 : shippingOptions[shippingIndex].price
  const total = subtotal + shippingCost - discount

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

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('Silakan masuk dulu sebelum membayar.')
      return
    }
    if (blocked.length > 0) {
      setError('Hapus item yang belum bisa diproses dari keranjang terlebih dahulu.')
      return
    }

    const form = new FormData(event.currentTarget)
    const fullName = String(form.get('fullName') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const street = String(form.get('address') ?? '').trim()
    const province = String(form.get('province') ?? '')
    const city = String(form.get('city') ?? '')
    const postal = String(form.get('postal') ?? '').trim()
    const address = `${fullName} (${phone}) — ${street}, ${city}, ${province} ${postal}`

    setSubmitting(true)
    try {
      const res = await ordersApi.checkout({
        items: items.map(({ product, quantity }) => ({ productId: product.slug, quantity })),
        shippingDetails: { courier: shippingOptions[shippingIndex].name, address },
        paymentMethod: payments[paymentIndex].name,
        voucherCode: voucher?.code,
        customerName: fullName,
        customerEmail: user?.email,
      })
      const data: any = res.data ?? {}
      setDone({
        orderNumber: String(data.orderNumber ?? data.order_number ?? (res as any).orderNumber ?? ''),
        total: Number(data.totalAmount ?? data.total_amount ?? 0),
      })
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pesanan gagal diproses. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="sf-container sf-checkout-complete">
        <span className="sf-complete-icon"><StoreIcon name="check" /></span>
        <span className="sf-eyebrow">PESANAN DITERIMA</span>
        <h1>Terima kasih sudah memilih RigCraft.</h1>
        {done.orderNumber && <p>Nomor pesanan kamu: <strong>{done.orderNumber}</strong></p>}
        {done.total > 0 && <p>Total tercatat: <strong>{formatRupiah(done.total)}</strong></p>}
        <p>Tim kami akan menghubungimu untuk detail pembayaran dan pengiriman.</p>
        <Link className="sf-button" to="/">Kembali ke beranda</Link>
      </div>
    )
  }

  return (
    <div className="sf-container sf-flow-page">
      <StoreBreadcrumb items={[{ label: 'Beranda', to: '/' }, { label: 'Keranjang', to: '/keranjang' }, { label: 'Pembayaran' }]} />
      <div className="sf-flow-heading">
        <div><span className="sf-eyebrow">LANGKAH 02 DARI 03</span><h1>Pembayaran</h1></div>
        <div className="sf-checkout-progress">
          <span className="is-done"><i>✓</i> Keranjang Belanja</span><b />
          <span className="is-current"><i>2</i> Proses Pembayaran</span><b />
          <span><i>3</i> Konfirmasi Pesanan</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="sf-empty-cart">
          <h2>Belum ada item untuk dibayar</h2>
          <p>Isi keranjang dulu, lalu lanjut ke pembayaran.</p>
          <Link className="sf-button" to="/katalog">Kembali ke katalog</Link>
        </div>
      ) : (
        <form className="sf-checkout-layout" onSubmit={submitOrder}>
          <div className="sf-checkout-forms">
            {!token && (
              <div className="sf-cart-note">
                Kamu belum masuk. <Link to="/masuk" state={{ from: '/checkout' }}><strong>Masuk di sini</strong></Link> untuk melanjutkan pembayaran.
              </div>
            )}

            {blocked.length > 0 && (
              <div className="sf-cart-note">
                <strong>Item berikut belum bisa diproses lewat checkout:</strong>
                {blocked.map((item) => (
                  <div key={item.product.slug}>
                    {item.product.name}{' '}
                    <button className="sf-text-link" type="button" onClick={() => removeFromCart(item.product.slug)}>Hapus</button>
                  </div>
                ))}
              </div>
            )}

            <section className="sf-form-panel">
              <div className="sf-form-panel-heading"><h2>Alamat Pengiriman</h2><span>01</span></div>
              <div className="sf-checkout-fields">
                <label>Nama Lengkap<input name="fullName" required autoComplete="name" defaultValue={user?.name ?? ''} placeholder="Masukkan nama lengkap penerima" /></label>
                <label>Nomor Telepon<input name="phone" required type="tel" autoComplete="tel" placeholder="Contoh: 081234567890" /></label>
                <label className="sf-field-full">Alamat Lengkap<textarea name="address" required rows={3} autoComplete="street-address" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" /></label>
                <label>Provinsi
                  <select name="province" defaultValue="DKI Jakarta">
                    <option>DKI Jakarta</option><option>Jawa Barat</option><option>Jawa Tengah</option><option>Jawa Timur</option><option>Bali</option>
                  </select>
                </label>
                <label>Kota / Kabupaten
                  <select name="city" defaultValue="Jakarta Pusat">
                    <option>Jakarta Pusat</option><option>Jakarta Selatan</option><option>Jakarta Barat</option><option>Bandung</option><option>Surabaya</option>
                  </select>
                </label>
                <label>Kode Pos<input name="postal" required inputMode="numeric" placeholder="Contoh: 10110" /></label>
              </div>
            </section>

            <section className="sf-form-panel">
              <div className="sf-form-panel-heading"><h2>Metode Pengiriman</h2><span>02</span></div>
              <div className="sf-choice-list">
                {shippingOptions.map((option, index) => (
                  <label className={`sf-choice-row ${shippingIndex === index ? 'is-selected' : ''}`} key={option.name}>
                    <input type="radio" name="shipping" checked={shippingIndex === index} onChange={() => setShippingIndex(index)} />
                    <span className="sf-choice-copy"><strong>{option.name}</strong><small>{option.detail}</small></span>
                    <b>{subtotal >= 1500000 ? 'GRATIS' : formatRupiah(option.price)}</b>
                  </label>
                ))}
              </div>
            </section>

            <section className="sf-form-panel">
              <div className="sf-form-panel-heading"><h2>Metode Pembayaran</h2><span>03</span></div>
              <div className="sf-choice-list">
                {payments.map((option, index) => (
                  <label className={`sf-choice-row ${paymentIndex === index ? 'is-selected' : ''}`} key={option.name}>
                    <input type="radio" name="payment" checked={paymentIndex === index} onChange={() => setPaymentIndex(index)} />
                    <span className="sf-choice-copy"><strong>{option.name}</strong><small>{option.detail}</small></span>
                    <b>{option.mark}</b>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="sf-order-summary sf-checkout-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="sf-checkout-items">
              {items.map((item) => (
                <div className="sf-checkout-item" key={item.product.slug}>
                  <img src={item.product.image} alt="" />
                  <span><strong>{item.product.name}<small>Qty {item.quantity}</small></strong></span>
                  <b>{formatRupiah(item.product.price * item.quantity)}</b>
                </div>
              ))}
            </div>
            <p><span>Subtotal Produk</span><strong>{formatRupiah(subtotal)}</strong></p>
            <p><span>Ongkos Kirim ({shippingOptions[shippingIndex].name.split(' ')[0]})</span><strong>{shippingCost === 0 ? 'GRATIS' : formatRupiah(shippingCost)}</strong></p>
            <div className="sf-summary-divider" />
            <label className="sf-coupon-label" htmlFor="checkout-coupon">Kode Voucher / Promo</label>
            <div className="sf-coupon">
              <input id="checkout-coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Masukkan kode promo" />
              <button type="button" onClick={applyCoupon} disabled={applying}>{applying ? '...' : 'Terapkan'}</button>
            </div>
            {couponMessage && <p className={`sf-coupon-message ${voucher ? 'is-success' : ''}`}>{couponMessage}</p>}
            {voucher && <button className="sf-text-link" type="button" onClick={() => { removeVoucher(); setCouponMessage('') }}>Hapus voucher {voucher.code}</button>}
            {discount > 0 && <p><span>Diskon Promo</span><strong className="sf-discount">-{formatRupiah(discount)}</strong></p>}
            <p className="sf-total-row"><span>Total Pembayaran</span><strong>{formatRupiah(total)}</strong></p>
            {error && <p className="sf-form-notice" role="alert">{error}</p>}
            <button className="sf-button sf-summary-button" type="submit" disabled={submitting || !token || blocked.length > 0}>
              {submitting ? 'Memproses...' : 'Bayar Sekarang'} <StoreIcon name="arrow" />
            </button>
            <small className="sf-secure-note"><StoreIcon name="shield" /> Dengan melanjutkan, kamu menyetujui Syarat &amp; Ketentuan RigCraft.</small>
          </aside>
        </form>
      )}
    </div>
  )
}
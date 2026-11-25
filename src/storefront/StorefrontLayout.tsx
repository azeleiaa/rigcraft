import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authApi, voucherApi } from '../lib/api'
import type { StoreProduct } from './data'
import './storefront.css'

export type CartProduct = StoreProduct & { type?: string }

export interface CartItem {
  product: CartProduct
  quantity: number
}

export interface AppliedVoucher {
  code: string
  discount: number
}

interface StoreContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  voucher: AppliedVoucher | null
  addToCart: (product: StoreProduct, quantity?: number) => void
  setQuantity: (slug: string, quantity: number) => void
  removeFromCart: (slug: string) => void
  clearCart: () => void
  applyVoucher: (code: string) => Promise<string>
  removeVoucher: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

// Kunci baru: membuang keranjang lama yang berisi data dummy
const CART_KEY = 'rigcraft-store-cart-v2'

// Hanya produk dari database (ID Mongo 24 karakter hex) yang bisa dipesan lewat API
export function isOrderable(product: StoreProduct) {
  return /^[a-f\d]{24}$/i.test(product.slug)
}

function loadCart(): CartItem[] {
  try {
    window.localStorage.removeItem('rigcraft-store-cart')
    const saved = window.localStorage.getItem(CART_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    if (!Array.isArray(parsed)) return []
    return (parsed as CartItem[]).filter((item) => item?.product?.slug && item.quantity > 0)
  } catch {
    return []
  }
}

// Simpan field yang dibutuhkan saja agar localStorage tidak membengkak
function toCartProduct(product: StoreProduct): CartProduct {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    image: product.image,
    status: product.status,
    type: (product as { type?: string }).type,
  }
}

function discountFrom(data: { discountPercentage?: number; discountAmount?: number }, subtotal: number) {
  const amount = Number(data.discountAmount ?? 0)
  if (amount > 0) return Math.min(amount, subtotal)
  const percentage = Number(data.discountPercentage ?? 0)
  return Math.min(Math.round((subtotal * percentage) / 100), subtotal)
}

export function useStoreCart() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStoreCart must be used inside StorefrontLayout')
  return context
}

function BrandMark() {
  return <span className="sf-brand-mark">R</span>
}

function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [, setTick] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useStoreCart()
  useEffect(() => setMenuOpen(false), [location.pathname])

  // Dibaca setiap render; header ikut render ulang saat rute berubah
  const user: any = authApi.getToken() ? authApi.getUser() : null

  function logout() {
    authApi.logout()
    window.localStorage.removeItem('rigcraft-auth')
    setMenuOpen(false)
    setTick((value) => value + 1)
    navigate('/')
  }

  const links = [
    { to: '/', label: 'Beranda', end: true },
    { to: '/katalog', label: 'Katalog' },
    { to: '/rakit-pc', label: 'Rakit PC' },
    { to: '/prebuilt-pc', label: 'Prebuilt PC' },
    { to: '/tentang', label: 'Tentang Kami' },
  ]

  return (
    <header className="sf-header">
      <div className="sf-header-inner">
        <Link className="sf-brand" to="/" aria-label="RigCraft beranda"><BrandMark /><span>Rig<span>Craft</span></span></Link>
        <button className={`sf-menu-toggle ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
        <nav className={`sf-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi utama">
          {links.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `sf-nav-link ${isActive ? 'is-active' : ''}`}>{link.label}</NavLink>)}
        </nav>
        <div className="sf-header-actions">
          {user ? (
            <>
              {user.role === 'admin' && <Link className="sf-sign-in" to="/dashboard">Dashboard</Link>}
              <span className="sf-sign-in" title={user.email}>Halo, {String(user.name ?? 'Pengguna').split(' ')[0]}</span>
              <button className="sf-sign-in" type="button" onClick={logout}>Keluar</button>
            </>
          ) : (
            <>
              <Link className="sf-sign-in" to="/masuk">Masuk</Link>
              <Link className="sf-button sf-button-small" to="/daftar">Daftar</Link>
            </>
          )}
          <Link className="sf-cart-link" to="/keranjang" aria-label="Keranjang belanja"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></svg><span>Keranjang</span>{count > 0 && <span className="sf-cart-badge" aria-label={`${count} item`}>{count > 99 ? '99+' : count}</span>}</Link>
        </div>
      </div>
    </header>
  )
}

function StoreFooter() {
  return (
    <footer className="sf-footer">
      <div className="sf-footer-main">
        <div className="sf-footer-brand"><Link className="sf-brand" to="/"><BrandMark /><span>Rig<span>Craft</span></span></Link><p>Premium gaming rigs dan hardware komputer yang dirakit di Jakarta, Indonesia. Built by gamers for ultimate gamers.</p><div className="sf-social-links"><a href="https://instagram.com" aria-label="Instagram">ig</a><a href="https://youtube.com" aria-label="YouTube">yt</a><a href="https://x.com" aria-label="X">x</a></div></div>
        <div className="sf-footer-column"><h2>Hubungi Kami</h2><p>RigCraft HQ, Ruko Mangga Dua Mall<br />No. 42, Jakarta Pusat, DKI Jakarta</p><a href="tel:+622134567890">+62 812-3456-7890</a><a href="mailto:support@rigcraft.co.id">support@rigcraft.co.id</a></div>
        <div className="sf-footer-column"><h2>Metode Pembayaran</h2><div className="sf-payment-tags">{['BCA', 'Mandiri', 'QRIS', 'Kredivo', 'GoPay', 'ShopeePay'].map((item) => <span key={item}>{item}</span>)}</div><h2 className="sf-footer-subheading">Pengiriman</h2><div className="sf-payment-tags"><span>JNE</span><span>SiCepat</span><span>GoSend</span><span>J&T</span></div></div>
      </div>
      <div className="sf-footer-bottom"><span>© 2026 RigCraft Indonesia. Hak Cipta Dilindungi.</span><div><Link to="/tentang">Terms of Service</Link><Link to="/tentang">Privacy Policy</Link><Link to="/tentang">Warranty Guide</Link></div></div>
    </footer>
  )
}

export default function StorefrontLayout() {
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [voucher, setVoucher] = useState<AppliedVoucher | null>(null)
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  // Subtotal berubah: cek ulang voucher ke server (syarat minimal belanja bisa tidak terpenuhi lagi)
  useEffect(() => {
    if (!voucher) return
    if (subtotal <= 0) {
      setVoucher(null)
      return
    }
    let cancelled = false
    voucherApi
      .validate(voucher.code, subtotal)
      .then((res) => {
        if (!cancelled) setVoucher({ code: res.data.code, discount: discountFrom(res.data, subtotal) })
      })
      .catch(() => {
        if (!cancelled) setVoucher(null)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal])

  function addToCart(product: StoreProduct, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product.slug === product.slug)
      if (existing) return current.map((item) => item.product.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item)
      return [...current, { product: toCartProduct(product), quantity }]
    })
  }

  function setQuantity(slug: string, quantity: number) {
    if (quantity < 1) return
    setItems((current) => current.map((item) => item.product.slug === slug ? { ...item, quantity } : item))
  }

  function removeFromCart(slug: string) {
    setItems((current) => current.filter((item) => item.product.slug !== slug))
  }

  async function applyVoucher(code: string) {
    if (subtotal <= 0) throw new Error('Keranjang masih kosong.')
    try {
      const res = await voucherApi.validate(code.trim().toUpperCase(), subtotal)
      setVoucher({ code: res.data.code, discount: discountFrom(res.data, subtotal) })
      return res.message || 'Voucher berhasil diterapkan.'
    } catch (error) {
      setVoucher(null)
      throw error
    }
  }

  const value: StoreContextValue = {
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    voucher,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart: () => {
      setItems([])
      setVoucher(null)
    },
    applyVoucher,
    removeVoucher: () => setVoucher(null),
  }

  return (
    <StoreContext.Provider value={value}>
      <div className="storefront">
        <StoreHeader />
        <main className="sf-main"><Outlet /></main>
        <StoreFooter />
      </div>
    </StoreContext.Provider>
  )
}

export function StoreButton({ children, onClick, type = 'button', variant = 'primary', className = '' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; variant?: 'primary' | 'outline'; className?: string }) {
  return <button className={`sf-button sf-button-${variant} ${className}`} onClick={onClick} type={type}>{children}</button>
}
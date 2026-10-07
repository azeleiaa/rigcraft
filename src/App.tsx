import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/Layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import StorefrontLayout from './storefront/StorefrontLayout'
import Home from './pages/storefront/Home'
import Catalog from './pages/storefront/Catalog'
import Prebuilt from './pages/storefront/Prebuilt'
import ProductDetail from './pages/storefront/ProductDetail'
import Builder from './pages/storefront/Builder'
import Cart from './pages/storefront/Cart'
import Checkout from './pages/storefront/Checkout'
import Auth from './pages/storefront/Auth'
import About from './pages/storefront/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/katalog" element={<Catalog />} />
          <Route path="/rakit-pc" element={<Builder />} />
          <Route path="/prebuilt-pc" element={<Prebuilt />} />
          <Route path="/prebuilt-pc/:slug" element={<ProductDetail />} />
          <Route path="/produk/:slug" element={<ProductDetail />} />
          <Route path="/keranjang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/masuk" element={<Auth />} />
          <Route path="/daftar" element={<Auth />} />
          <Route path="/tentang" element={<About />} />
        </Route>
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pesanan" element={<Orders />} />
          <Route path="/produk" element={<Products />} />
          <Route path="/pelanggan" element={<Customers />} />
          <Route path="/laporan" element={<Reports />} />
          <Route path="/pengaturan" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

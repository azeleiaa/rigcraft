// ============================================================
// RigCraft — REST API Client (Laravel + MongoDB Decoupled Backend)
// Based on SRS §3.3 Spesifikasi Endpoint RESTful API
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
export const isApiConfigured = Boolean(import.meta.env.VITE_API_URL)

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('rigcraft_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  }

  const response = await fetch(url, { ...options, headers })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errors = data && typeof data.errors === 'object' && data.errors !== null
      ? Object.values(data.errors as Record<string, string[]>).flat()
      : []
    throw new Error(data?.message || errors[0] || `Request failed with status ${response.status}`)
  }

  return data
}

// -------------------------------------------------------------
// Authentication (FR-001)
// -------------------------------------------------------------
export const authApi = {
  async register(name: string, email: string, password: string) {
    const res = await request<{ success: boolean; data: { token: string; user: any } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    if (res.data?.token) {
      localStorage.setItem('rigcraft_token', res.data.token)
      localStorage.setItem('rigcraft_user', JSON.stringify(res.data.user))
    }
    return res.data
  },

  async login(email: string, password: string) {
    const res = await request<{ success: boolean; data: { token: string; user: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (res.data?.token) {
      localStorage.setItem('rigcraft_token', res.data.token)
      localStorage.setItem('rigcraft_user', JSON.stringify(res.data.user))
    }
    return res.data
  },

  async me() {
    return request<{ success: boolean; data: any }>('/auth/me')
  },

  logout() {
    request('/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('rigcraft_token')
    localStorage.removeItem('rigcraft_user')
  },

  getToken(): string | null {
    return localStorage.getItem('rigcraft_token')
  },

  getUser(): any | null {
    const raw = localStorage.getItem('rigcraft_user')
    return raw ? JSON.parse(raw) : null
  },
}

// -------------------------------------------------------------
// Products Catalog & Details (FR-002, FR-003, FR-005)
// -------------------------------------------------------------
export const productsApi = {
  async getAll(params: {
    q?: string
    category?: string
    type?: string
    brand?: string
    min_price?: number
    max_price?: number
    sort?: string
  } = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') query.append(k, String(v))
    })
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request<{ success: boolean; count: number; data: any[] }>(`/products${qs}`)
  },

  async getById(id: string) {
    return request<{ success: boolean; data: any }>(`/products/${id}`)
  },
}

// -------------------------------------------------------------
// PC Builder Simulation & Rule-Based Validation (FR-004)
// -------------------------------------------------------------
export const builderApi = {
  async validate(components: Record<string, string>) {
    return request<{
      success: boolean
      is_compatible: boolean
      estimated_wattage: number
      recommended_psu_wattage: number
      checks: Record<string, boolean>
      warnings: string[]
    }>('/builder/validate', {
      method: 'POST',
      body: JSON.stringify({ components }),
    })
  },
}

// -------------------------------------------------------------
// Vouchers & Discounts
// -------------------------------------------------------------
export const voucherApi = {
  async validate(code: string, subtotal: number) {
    return request<{
      success: boolean
      message: string
      data: {
        code: string
        discountPercentage: number
        discountAmount: number
      }
    }>('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    })
  },
}

// -------------------------------------------------------------
// Shopping Cart (FR-006)
// -------------------------------------------------------------
export const cartApi = {
  async get() {
    return request<{ success: boolean; data: { items: any[]; total: number; itemCount: number } }>('/cart')
  },

  async add(productId: string, quantity = 1, selectedSpecs = {}) {
    return request<{ success: boolean; message: string }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, selectedSpecs }),
    })
  },

  async remove(productId: string) {
    return request<{ success: boolean; message: string }>(`/cart/${productId}`, {
      method: 'DELETE',
    })
  },

  async clear() {
    return request<{ success: boolean; message: string }>('/cart', {
      method: 'DELETE',
    })
  },
}

// -------------------------------------------------------------
// Orders & Checkout (FR-006)
// -------------------------------------------------------------
export const ordersApi = {
  async checkout(orderData: {
    items: Array<{ productId: string; quantity: number; price?: number; name?: string }>
    shippingDetails: { courier: string; address: string }
    paymentMethod?: string
    voucherCode?: string
    customerName?: string
    customerEmail?: string
  }) {
    return request<{ success: boolean; message: string; data: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  async getMyOrders() {
    return request<{ success: boolean; data: any[] }>('/orders')
  },
}

// -------------------------------------------------------------
// Admin Dashboard & Management (FR-002, FR-007)
// -------------------------------------------------------------
export const adminApi = {
  async getStats() {
    return request<{ success: boolean; data: any }>('/admin/stats')
  },

  async getProducts() {
    return request<{ success: boolean; data: any[] }>('/admin/products')
  },

  async createProduct(product: any) {
    return request<{ success: boolean; message: string; data: any }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  },

  async updateProduct(id: string, product: any) {
    return request<{ success: boolean; message: string; data: any }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  },

  async deleteProduct(id: string) {
    return request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    })
  },

  async getOrders() {
    return request<{ success: boolean; data: any[] }>('/admin/orders')
  },

  async updateOrderStatus(id: string, status: string) {
    return request<{ success: boolean; message: string; data: any }>(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },
}

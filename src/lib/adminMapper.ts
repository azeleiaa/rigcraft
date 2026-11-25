export function formatDate(value: unknown): string {
  if (!value) return '-'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export interface OrderView {
  id: string
  number: string
  customer: string
  product: string
  date: string
  total: number
  status: string
}

// Membaca pesanan dari backend dengan beberapa kemungkinan nama field
export function orderView(o: any): OrderView {
  const id = String(o._id ?? o.id ?? '')
  const items: any[] = Array.isArray(o.items) ? o.items : []
  const names = items
    .map((item) => String(item?.name ?? item?.productName ?? item?.product?.name ?? ''))
    .filter(Boolean)
  const product =
    names.length === 0
      ? items.length ? `${items.length} item` : '-'
      : names.length === 1
        ? names[0]
        : `${names[0]} +${names.length - 1} lainnya`

  return {
    id,
    number: String(o.orderNumber ?? o.order_number ?? id),
    customer: String(o.customerName ?? o.customer_name ?? o.user?.name ?? o.customer?.name ?? '-'),
    product,
    date: formatDate(o.created_at ?? o.createdAt ?? o.date),
    total: Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0),
    status: String(o.status ?? '-'),
  }
}
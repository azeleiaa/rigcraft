// ============================================
// RigCraft Admin Dashboard - Dummy Data
// ============================================

export const dashboardStats = [
  {
    label: 'TOTAL PENDAPATAN',
    value: 'Rp 487.500.000',
    change: '+12.5%',
    changeType: 'positive' as const,
    changeLabel: 'dari bulan lalu',
  },
  {
    label: 'TOTAL PESANAN',
    value: '1.247',
    change: '+8.3%',
    changeType: 'positive' as const,
    changeLabel: 'dari bulan lalu',
  },
  {
    label: 'PRODUK TERJUAL',
    value: '3.891',
    change: '+15.2%',
    changeType: 'positive' as const,
    changeLabel: 'dari bulan lalu',
  },
  {
    label: 'PELANGGAN BARU',
    value: '326',
    change: '+5.7%',
    changeType: 'positive' as const,
    changeLabel: 'dari bulan lalu',
  },
];

export const reportStats = [
  {
    label: 'TOTAL PENDAPATAN',
    value: 'Rp 487.500.000',
    change: '+12.5%',
    changeType: 'positive' as const,
    changeLabel: 'vs bulan lalu',
  },
  {
    label: 'RATA-RATA PER PESANAN',
    value: 'Rp 390.817',
    change: '+4.2%',
    changeType: 'positive' as const,
    changeLabel: 'vs bulan lalu',
  },
  {
    label: 'MARGIN KEUNTUNGAN',
    value: '23.4%',
    change: '+0.8%',
    changeType: 'positive' as const,
    changeLabel: 'vs bulan lalu',
  },
];

export const weeklySalesData = [
  { day: 'Sen', value: 13000000, label: '13jt' },
  { day: 'Sel', value: 9000000, label: '9jt' },
  { day: 'Rab', value: 17000000, label: '17jt' },
  { day: 'Kam', value: 11000000, label: '11jt' },
  { day: 'Jum', value: 14000000, label: '14jt' },
  { day: 'Sab', value: 19000000, label: '19jt' },
  { day: 'Min', value: 12000000, label: '12jt' },
];

export const monthlySalesData = [
  { month: 'Apr', value: 310000000 },
  { month: 'Mei', value: 350000000 },
  { month: 'Jun', value: 380000000 },
  { month: 'Jul', value: 360000000 },
  { month: 'Agt', value: 420000000 },
  { month: 'Sep', value: 487500000 },
];

export const topProducts = [
  { rank: 1, name: 'AMD Ryzen 9 7950X3D', sold: 89 },
  { rank: 2, name: 'RTX 4070 Ti Super', sold: 76 },
  { rank: 3, name: 'RigCraft Titan X Gaming', sold: 54 },
  { rank: 4, name: 'Corsair Vengeance DDR5 32GB', sold: 48 },
  { rank: 5, name: 'Samsung 990 Pro 2TB', sold: 41 },
];

export const recentOrders = [
  {
    id: '#RG-20261001',
    customer: 'Budi Santoso',
    product: 'RigCraft Titan X Gaming',
    total: 'Rp 35.000.000',
    status: 'Diproses',
    date: '30 Sep 2026',
  },
  {
    id: '#RG-20261002',
    customer: 'Rina Wijaya',
    product: 'AMD Ryzen 9 7950X3D + 2 lainnya',
    total: 'Rp 12.149.000',
    status: 'Dikirim',
    date: '30 Sep 2026',
  },
  {
    id: '#RG-20261003',
    customer: 'Ahmad Fauzi',
    product: 'RigCraft Storm Pro',
    total: 'Rp 24.999.000',
    status: 'Selesai',
    date: '29 Sep 2026',
  },
  {
    id: '#RG-20261004',
    customer: 'Siti Nurhaliza',
    product: 'Corsair DDR5 + RTX 4080 Super',
    total: 'Rp 25.540.000',
    status: 'Diproses',
    date: '29 Sep 2026',
  },
  {
    id: '#RG-20261005',
    customer: 'Dian Prasetyo',
    product: 'RigCraft Nova Office',
    total: 'Rp 8.999.000',
    status: 'Selesai',
    date: '28 Sep 2026',
  },
];

export const allOrders = [
  {
    id: '#RG-20261001',
    customer: 'Budi Santoso',
    product: 'RigCraft Titan X Gaming',
    total: 'Rp 35.000.000',
    status: 'Menunggu Pembayaran',
    date: '30 Sep 2026',
  },
  {
    id: '#RG-20261002',
    customer: 'Rina Wijaya',
    product: 'AMD Ryzen 9 + 2 lainnya',
    total: 'Rp 12.149.000',
    status: 'Diproses',
    date: '30 Sep 2026',
  },
  {
    id: '#RG-20261003',
    customer: 'Ahmad Fauzi',
    product: 'RigCraft Storm Pro',
    total: 'Rp 24.999.000',
    status: 'Dikirim',
    date: '29 Sep 2026',
  },
  {
    id: '#RG-20261004',
    customer: 'Siti Nurhaliza',
    product: 'Corsair DDR5 + RTX 4080',
    total: 'Rp 25.540.000',
    status: 'Selesai',
    date: '29 Sep 2026',
  },
  {
    id: '#RG-20261005',
    customer: 'Dian Prasetyo',
    product: 'RigCraft Nova Office',
    total: 'Rp 8.999.000',
    status: 'Selesai',
    date: '28 Sep 2026',
  },
  {
    id: '#RG-20261006',
    customer: 'Reza Mahendra',
    product: 'Samsung 990 Pro 2TB x2',
    total: 'Rp 5.898.000',
    status: 'Dikirim',
    date: '28 Sep 2026',
  },
  {
    id: '#RG-20261007',
    customer: 'Maya Putri',
    product: 'RigCraft Bolt Mini',
    total: 'Rp 14.999.000',
    status: 'Dibatalkan',
    date: '27 Sep 2026',
  },
  {
    id: '#RG-20261008',
    customer: 'Hendra Gunawan',
    product: 'RTX 4070 Ti Super + PSU',
    total: 'Rp 9.350.000',
    status: 'Diproses',
    date: '27 Sep 2026',
  },
];

export const orderStatusCounts = {
  Semua: 247,
  Menunggu: 18,
  Diproses: 32,
  Dikirim: 45,
  Selesai: 142,
  Dibatalkan: 10,
};

export const products = [
  {
    id: 1,
    name: 'AMD Ryzen 9 7950X3D',
    category: 'CPU',
    price: 'Rp 8.499.000',
    stock: 45,
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'RTX 4070 Ti Super',
    category: 'GPU',
    price: 'Rp 9.890.000',
    stock: 32,
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'RigCraft Titan X Gaming',
    category: 'PREBUILT PC',
    price: 'Rp 35.000.000',
    stock: 12,
    status: 'Aktif',
  },
  {
    id: 4,
    name: 'Corsair Vengeance DDR5 32GB',
    category: 'RAM',
    price: 'Rp 1.825.000',
    stock: 78,
    status: 'Aktif',
  },
  {
    id: 5,
    name: 'Samsung 990 Pro 2TB',
    category: 'SSD',
    price: 'Rp 2.949.000',
    stock: 56,
    status: 'Aktif',
  },
  {
    id: 6,
    name: 'Corsair RM850x 850W',
    category: 'PSU',
    price: 'Rp 1.899.000',
    stock: 3,
    status: 'Aktif',
  },
  {
    id: 7,
    name: 'RigCraft Storm Pro',
    category: 'PREBUILT PC',
    price: 'Rp 24.999.000',
    stock: 8,
    status: 'Aktif',
  },
  {
    id: 8,
    name: 'Logitech G Pro X Superlight',
    category: 'PERIPHERAL',
    price: 'Rp 1.599.000',
    stock: 0,
    status: 'Draft',
  },
];

export const productCategoryCounts = {
  Semua: 186,
  Sparepart: 98,
  'Prebuilt PC': 24,
  Peripheral: 64,
};

export const categoryDistribution = [
  { name: 'Sparepart', percentage: 52, color: '#00E5FF' },
  { name: 'Prebuilt PC', percentage: 31, color: '#A855F7' },
  { name: 'Peripheral', percentage: 17, color: '#EC4899' },
];

export const salesPerformance = [
  { product: 'AMD Ryzen 9 7950X3D', sold: 89, revenue: 'Rp 756.4jt', trend: 'up' },
  { product: 'RTX 4070 Ti Super', sold: 76, revenue: 'Rp 751.6jt', trend: 'up' },
  { product: 'RigCraft Titan X Gaming', sold: 54, revenue: 'Rp 1.89M', trend: 'up' },
  { product: 'Corsair Vengeance DDR5', sold: 48, revenue: 'Rp 87.6jt', trend: 'down' },
  { product: 'Samsung 990 Pro 2TB', sold: 41, revenue: 'Rp 120.9jt', trend: 'neutral' },
];

export const paymentMethods = [
  { name: 'Transfer Bank', percentage: 45, color: '#00E5FF' },
  { name: 'E-Wallet', percentage: 32, color: '#3B82F6' },
  { name: 'Kartu Kredit', percentage: 18, color: '#EF4444' },
  { name: 'COD', percentage: 5, color: '#F59E0B' },
];

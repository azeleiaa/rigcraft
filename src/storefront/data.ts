export interface StoreProduct {
  slug: string
  name: string
  category: string
  price: number
  description: string
  image: string
  status: 'Tersedia' | 'Habis'
  featured?: string
}

export const componentProducts: StoreProduct[] = [
  { slug: 'intel-core-i7-14700k', name: 'Intel Core i7-14700K', category: 'Processor', price: 6899000, description: '20 Core, boost hingga 5.6GHz, L3 33MB', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
  { slug: 'asus-rtx-4070-ti-super', name: 'ASUS TUF RTX 4070 Ti Super', category: 'GPU', price: 15499000, description: '16GB GDDR6X, OC Edition', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
  { slug: 'corsair-vengeance-ddr5', name: 'Corsair Vengeance RGB DDR5', category: 'RAM', price: 1950000, description: '32GB (2x16GB) 6000MHz CL36', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
  { slug: 'msi-mag-b760-tomahawk', name: 'MSI MAG B760 Tomahawk WiFi', category: 'Motherboard', price: 3349000, description: 'LGA1700, DDR5, PCIe 5.0', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
  { slug: 'samsung-990-pro-2tb', name: 'Samsung 990 Pro NVMe 2TB', category: 'Storage', price: 2949000, description: '2TB, PCIe Gen4, read up to 7450MB/s', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
  { slug: 'corsair-rm850x', name: 'Corsair RM850x Shift 850W', category: 'Power Supply', price: 2450000, description: '80+ Gold, fully modular side interface', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
  { slug: 'asus-rog-strix-x670e', name: 'ASUS ROG Strix X670E-E WiFi', category: 'Motherboard', price: 7890000, description: 'AM5, DDR5, PCIe 5.0, RGB design', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=85', status: 'Habis' },
  { slug: 'nzxt-kraken-x63', name: 'NZXT Kraken X63 280mm', category: 'Cooling', price: 2850000, description: 'AIO liquid cooler, dual 140mm fans', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85', status: 'Tersedia' },
]

export const prebuiltProducts: StoreProduct[] = [
  { slug: 'titan-x-gaming', name: 'RigCraft Titan X Gaming', category: 'Gaming', price: 35000000, description: 'AMD Ryzen 9 7950X3D · RTX 4070 Ti Super · 32GB DDR5', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=90', status: 'Tersedia', featured: 'Terlaris' },
  { slug: 'storm-pro', name: 'RigCraft Storm Pro', category: 'Gaming', price: 24999000, description: 'AMD Ryzen 7 7800X3D · 32GB DDR5 · RTX 4070', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1400&q=90', status: 'Tersedia' },
  { slug: 'vertex-workstation', name: 'RigCraft Vertex Workstation', category: 'Workstation', price: 29500000, description: 'AMD Ryzen 9 7900 · 64GB DDR5 · RTX 4080', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1400&q=90', status: 'Tersedia' },
  { slug: 'nova-office', name: 'RigCraft Nova Office', category: 'Office', price: 8999000, description: 'Intel Core i5-13400 · 16GB DDR4 · Intel UHD', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1400&q=90', status: 'Tersedia' },
  { slug: 'phantom-stream', name: 'RigCraft Phantom Stream', category: 'Creator', price: 31500000, description: 'AMD Ryzen 7 7800X3D · 32GB DDR5 · RTX 4070 Ti', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1400&q=90', status: 'Tersedia' },
  { slug: 'bolt-mini', name: 'RigCraft Bolt Mini', category: 'Gaming', price: 14999000, description: 'Intel Core i7-13700 · 16GB DDR5 · RTX 4060', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1400&q=90', status: 'Tersedia' },
]

export const titanSpecifications = [
  ['Processor', 'AMD Ryzen 9 7950X3D (16 Cores, 32 Threads, 4.2GHz base / 5.7GHz boost)'],
  ['GPU', 'NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X'],
  ['Motherboard', 'ASUS ROG STRIX B650E-E Gaming WiFi'],
  ['RAM', 'Corsair Vengeance DDR5 RGB 32GB (2x16GB) 6000MHz CL30'],
  ['Storage', 'Samsung 990 Pro NVMe M.2 SSD 2TB'],
  ['PSU', 'Corsair RM850x 850W 80+ Gold Fully Modular'],
  ['Casing', 'NZXT H7 Flow RGB Mid Tower'],
  ['Cooling', 'NZXT Kraken X63 280mm AIO Liquid Cooler'],
  ['OS', 'Windows 11 Pro (Pre-installed)'],
  ['Connectivity', 'WiFi 6E, Bluetooth 5.3, 2.5G LAN'],
]

export const upgradeProducts = [
  { title: 'Upgrade RAM', detail: 'Dari 32GB ke 64GB DDR5 Corsair Vengeance', price: 1800000, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80' },
  { title: 'Upgrade Storage', detail: 'Tambah Samsung 990 Pro 2TB NVMe SSD', price: 2949000, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80' },
  { title: 'Upgrade GPU', detail: 'Dari RTX 4070 Ti ke RTX 4080 Super 16GB', price: 5500000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80' },
  { title: 'Upgrade Cooling', detail: 'Dari 280mm AIO ke Corsair iCUE H150i 360mm', price: 850000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80' },
]

export const benchmarkGames = [
  { game: 'Cyberpunk 2077 (4K Ultra, DLSS Frame Gen)', fps: 85, max: 400 },
  { game: 'Fortnite (1080p Epic, Pro Settings)', fps: 240, max: 400 },
  { game: 'Valorant (1080p High, Competitive)', fps: 400, max: 400 },
]

export const builderComponents = [
  { id: 'motherboard', name: 'Motherboard', category: 'Motherboard', watt: 45, options: [{ name: 'ASUS ROG Strix B650E-E Gaming WiFi', price: 3899000, socket: 'AM5' }, { name: 'MSI MAG B760 Tomahawk WiFi', price: 3349000, socket: 'LGA1700' }] },
  { id: 'processor', name: 'Processor (CPU)', category: 'Processor', watt: 120, options: [{ name: 'AMD Ryzen 7 7800X3D', price: 6499000, socket: 'AM5' }, { name: 'Intel Core i7-14700K', price: 6899000, socket: 'LGA1700' }] },
  { id: 'ram', name: 'RAM (Memory)', category: 'RAM', watt: 10, options: [{ name: 'Corsair Vengeance RGB DDR5 32GB', price: 1950000, socket: 'DDR5' }, { name: 'Corsair Vengeance DDR5 64GB', price: 3750000, socket: 'DDR5' }] },
  { id: 'gpu', name: 'Kartu Grafis (VGA)', category: 'GPU', watt: 285, options: [{ name: 'ASUS TUF RTX 4070 Ti Super', price: 15499000, socket: 'PCIe' }, { name: 'NVIDIA RTX 4080 Super 16GB', price: 20999000, socket: 'PCIe' }] },
  { id: 'storage', name: 'Penyimpanan (SSD/HDD)', category: 'Storage', watt: 8, options: [{ name: 'Samsung 990 Pro NVMe 2TB', price: 2949000, socket: 'M.2' }, { name: 'Samsung 990 Pro NVMe 4TB', price: 5499000, socket: 'M.2' }] },
  { id: 'psu', name: 'Power Supply (PSU)', category: 'Power Supply', watt: 0, options: [{ name: 'Corsair CV Series 450W', price: 650000, socket: '450W' }, { name: 'Corsair RM850x 850W Gold', price: 2450000, socket: '850W' }] },
  { id: 'cooling', name: 'Pendingin (Cooler)', category: 'Cooling', watt: 15, options: [{ name: 'Air Cooler Dual Tower', price: 650000, socket: 'Air' }, { name: 'NZXT Kraken X63 280mm AIO', price: 2850000, socket: 'AIO' }] },
  { id: 'case', name: 'Casing', category: 'Casing', watt: 0, options: [{ name: 'NZXT H7 Flow RGB Mid Tower', price: 2199000, socket: 'Mid Tower' }, { name: 'Lian Li O11 Dynamic EVO', price: 2799000, socket: 'Mid Tower' }] },
]

export const categoryLinks = [
  { title: 'Processor', icon: 'cpu' },
  { title: 'VGA', icon: 'gpu' },
  { title: 'RAM', icon: 'ram' },
  { title: 'Storage', icon: 'storage' },
  { title: 'Motherboard', icon: 'board' },
  { title: 'Power Supply', icon: 'power' },
  { title: 'Casing', icon: 'case' },
]

export function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
}
import { create } from 'zustand'

const DEFAULT_PRODUCTS = [
  {
    id: 1, name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'High-quality wireless earbuds with active noise cancellation, crystal clear audio, and 24h battery life.',
    longDesc: 'Experience the ultimate audio fidelity with the Wireless Earbuds Pro. Featuring advanced active noise cancellation that adapts to your environment, keeping you immersed in your music. The long-lasting 24-hour battery life ensures you are never left without your favorite tunes.',
    price: 299000, discountPrice: 249000, discountPct: 16, category: 'Electronics', subCategory: 'Audio', stock: 50, sold: 128, views: 1045, eta: '2-3 days', badges: ['New', 'Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=800&fit=crop'],
    specs: [{ key: 'Battery', value: '24 Hours' }, { key: 'Bluetooth', value: '5.2' }],
    faq: [{ q: 'Is it waterproof?', a: 'Yes, IPX4 rating.' }],
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 2, name: 'Minimalist Watch Silver',
    slug: 'minimalist-watch-silver',
    description: 'Elegant minimalist watch with stainless steel case, sapphire crystal glass, and genuine leather strap.',
    longDesc: 'A timeless piece for any occasion. This minimalist watch features a premium stainless steel case paired with scratch-resistant sapphire crystal. The genuine leather strap ensures comfort and durability, making it the perfect daily companion.',
    price: 459000, discountPrice: null, discountPct: 0, category: 'Fashion', subCategory: 'Accessories', stock: 30, sold: 89, views: 560, eta: '3-5 days', badges: ['Premium'],
    thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop'],
    specs: [{ key: 'Movement', value: 'Quartz' }, { key: 'Case', value: 'Stainless Steel' }],
    faq: [{ q: 'Is the strap replaceable?', a: 'Yes, it uses standard 20mm pins.' }],
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 3, name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    description: 'Premium canvas tote bag with reinforced handles. Spacious interior with inner pocket.',
    longDesc: 'Carry everything you need with ease. Our premium canvas tote bag features reinforced stitching on the handles for extra durability. The spacious main compartment and convenient inner pocket keep your belongings organized and accessible.',
    price: 149000, discountPrice: 129000, discountPct: 13, category: 'Fashion', subCategory: 'Bags', stock: 100, sold: 234, views: 1200, eta: '1-2 days', badges: ['Eco-friendly'],
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop'],
    specs: [{ key: 'Material', value: '100% Cotton Canvas' }, { key: 'Dimensions', value: '40 x 35 x 10 cm' }],
    faq: [{ q: 'Is it machine washable?', a: 'Yes, machine wash cold.' }],
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 4, name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    description: 'Modern LED desk lamp with adjustable brightness, color temperature control, and USB charging port.',
    longDesc: 'Illuminate your workspace with precision. This modern LED desk lamp offers touch controls for brightness and color temperature adjustments. A built-in USB port lets you charge your devices conveniently while you work or study.',
    price: 189000, discountPrice: 159000, discountPct: 15, category: 'Home', subCategory: 'Lighting', stock: 75, sold: 156, views: 800, eta: '2-4 days', badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop'],
    specs: [{ key: 'Power', value: '12W' }, { key: 'Lifespan', value: '50,000 Hours' }],
    faq: [{ q: 'Does it come with a power adapter?', a: 'Yes, a 12V adapter is included.' }],
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 5, name: 'Mechanical Keyboard RGB',
    slug: 'mechanical-keyboard-rgb',
    description: 'Full RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and programmable macros.',
    longDesc: 'Elevate your typing and gaming experience. This mechanical keyboard features customizable RGB backlighting, durable PBT keycaps, and hot-swappable switches so you can tailor the feel to your exact preferences.',
    price: 549000, discountPrice: null, discountPct: 0, category: 'Electronics', subCategory: 'Peripherals', stock: 25, sold: 67, views: 950, eta: '3-5 days', badges: ['Gamer Choice'],
    thumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop'],
    specs: [{ key: 'Switches', value: 'Linear Red' }, { key: 'Connectivity', value: 'Wired USB-C' }],
    faq: [{ q: 'Are the switches hot-swappable?', a: 'Yes, supports 3-pin and 5-pin switches.' }],
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 6, name: 'Aromatherapy Diffuser',
    slug: 'aromatherapy-diffuser',
    description: 'Ultrasonic essential oil diffuser with 7 LED color lights, timer function, and whisper-quiet operation.',
    longDesc: 'Create a relaxing atmosphere in any room. This ultrasonic diffuser quietly disperses your favorite essential oils while glowing in 7 soothing LED colors. Features auto shut-off for safety and multiple timer settings.',
    price: 179000, discountPrice: 149000, discountPct: 16, category: 'Home', subCategory: 'Wellness', stock: 60, sold: 198, views: 600, eta: '2-3 days', badges: ['Relax'],
    thumbnail: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&h=800&fit=crop'],
    specs: [{ key: 'Capacity', value: '300ml' }, { key: 'Runtime', value: 'Up to 10 Hours' }],
    faq: [{ q: 'Can I use any essential oil?', a: 'Yes, 100% pure essential oils are recommended.' }],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 7, name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof portable Bluetooth 5.3 speaker with 360° surround sound and 20h playtime.',
    longDesc: 'Take your music anywhere with this rugged, waterproof Bluetooth speaker. Experience immersive 360-degree sound and enjoy up to 20 hours of continuous playtime on a single charge.',
    price: 349000, discountPrice: 299000, discountPct: 14, category: 'Electronics', subCategory: 'Audio', stock: 40, sold: 312, views: 1500, eta: '2-4 days', badges: ['Hot'],
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
    specs: [{ key: 'Waterproof', value: 'IP67' }, { key: 'Bluetooth', value: '5.3' }],
    faq: [{ q: 'Can I pair two speakers?', a: 'Yes, supports TWS stereo pairing.' }],
    createdAt: '2026-03-10T10:00:00Z'
  },
  {
    id: 8, name: 'Skincare Set Premium',
    slug: 'skincare-set-premium',
    description: 'Complete skincare routine set with cleanser, toner, serum, moisturizer, and sunscreen.',
    longDesc: 'Revitalize your skin with our premium 5-step skincare routine. Formulated with natural ingredients to cleanse, tone, treat, moisturize, and protect your skin all day long.',
    price: 399000, discountPrice: 349000, discountPct: 12, category: 'Beauty', subCategory: 'Skincare', stock: 35, sold: 445, views: 2200, eta: '1-3 days', badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop'],
    specs: [{ key: 'Skin Type', value: 'All Types' }, { key: 'Cruelty-Free', value: 'Yes' }],
    faq: [{ q: 'Is it suitable for sensitive skin?', a: 'Yes, it is dermatologist tested and gentle.' }],
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 9, name: 'Coffee Dripper Set',
    slug: 'coffee-dripper-set',
    description: 'Pour-over coffee dripper set with borosilicate glass server, stainless steel filter.',
    longDesc: 'Brew the perfect cup of pour-over coffee at home. This set includes a high-quality borosilicate glass server and a reusable dual-layer stainless steel filter that extracts the maximum flavor from your beans.',
    price: 219000, discountPrice: null, discountPct: 0, category: 'Home', subCategory: 'Kitchen', stock: 45, sold: 178, views: 730, eta: '2-4 days', badges: [],
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop'],
    specs: [{ key: 'Material', value: 'Glass & Stainless Steel' }, { key: 'Capacity', value: '600ml' }],
    faq: [{ q: 'Do I need paper filters?', a: 'No, the stainless steel filter is reusable.' }],
    createdAt: '2026-04-01T10:00:00Z'
  },
  {
    id: 10, name: 'Running Shoes Ultra',
    slug: 'running-shoes-ultra',
    description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper.',
    longDesc: 'Push your limits with the Running Shoes Ultra. Designed for maximum comfort and speed, featuring a highly breathable mesh upper and ultra-responsive foam cushioning that absorbs impact on every stride.',
    price: 599000, discountPrice: 499000, discountPct: 16, category: 'Fashion', subCategory: 'Footwear', stock: 20, sold: 87, views: 890, eta: '3-5 days', badges: ['New', 'Trending'],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
    specs: [{ key: 'Weight', value: '250g' }, { key: 'Drop', value: '8mm' }],
    faq: [{ q: 'Are these true to size?', a: 'Yes, we recommend ordering your usual size.' }],
    createdAt: '2026-04-10T10:00:00Z'
  },
  {
    id: 11, name: 'Wireless Charging Pad',
    slug: 'wireless-charging-pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Slim design with LED indicator.',
    longDesc: 'Simplify your charging routine with this ultra-slim wireless charging pad. Provides up to 15W fast charging for compatible devices and features a subtle LED indicator to confirm charging status.',
    price: 129000, discountPrice: 99000, discountPct: 23, category: 'Electronics', subCategory: 'Accessories', stock: 80, sold: 267, views: 1100, eta: '1-3 days', badges: ['Sale'],
    thumbnail: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&h=800&fit=crop'],
    specs: [{ key: 'Output', value: '15W Max' }, { key: 'Compatibility', value: 'Qi-enabled devices' }],
    faq: [{ q: 'Does it charge through cases?', a: 'Yes, supports cases up to 5mm thick.' }],
    createdAt: '2026-04-20T10:00:00Z'
  },
  {
    id: 12, name: 'Scented Candle Set',
    slug: 'scented-candle-set',
    description: 'Hand-poured soy wax scented candle set. 3 premium fragrances included.',
    longDesc: 'Set the perfect mood with our trio of hand-poured soy wax candles. Each set includes three carefully curated, long-lasting fragrances designed to relax and uplift your living space.',
    price: 169000, discountPrice: null, discountPct: 0, category: 'Home', subCategory: 'Decor', stock: 55, sold: 342, views: 650, eta: '2-4 days', badges: ['Gift Idea'],
    thumbnail: 'https://images.unsplash.com/photo-1602607688066-d2c9440512e9?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1602607688066-d2c9440512e9?w=800&h=800&fit=crop'],
    specs: [{ key: 'Material', value: '100% Soy Wax' }, { key: 'Burn Time', value: '30 Hours per candle' }],
    faq: [{ q: 'Are the wicks lead-free?', a: 'Yes, we use 100% cotton lead-free wicks.' }],
    createdAt: '2026-05-01T10:00:00Z'
  }
]

export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,

  init: () => {
    const saved = localStorage.getItem('lumi-products')
    if (saved) {
      try {
        set({ products: JSON.parse(saved), loading: false })
      } catch(e) {
        localStorage.setItem('lumi-products', JSON.stringify(DEFAULT_PRODUCTS))
        set({ products: DEFAULT_PRODUCTS, loading: false })
      }
    } else {
      localStorage.setItem('lumi-products', JSON.stringify(DEFAULT_PRODUCTS))
      set({ products: DEFAULT_PRODUCTS, loading: false })
    }
  },

  getProductBySlug: (slug) => {
    return get().products.find(p => p.slug === slug)
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id)
  },

  trackView: (id) => {
    const updated = get().products.map(p => {
      if (p.id === id) {
        return { ...p, views: (p.views || 0) + 1 }
      }
      return p
    })
    localStorage.setItem('lumi-products', JSON.stringify(updated))
    set({ products: updated })
  },

  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      sold: 0,
      views: 0,
      createdAt: new Date().toISOString()
    }
    const updated = [...get().products, newProduct]
    localStorage.setItem('lumi-products', JSON.stringify(updated))
    set({ products: updated })
  },

  updateProduct: (id, data) => {
    const updated = get().products.map(p => p.id === id ? { ...p, ...data } : p)
    localStorage.setItem('lumi-products', JSON.stringify(updated))
    set({ products: updated })
  },

  deleteProduct: (id) => {
    const updated = get().products.filter(p => p.id !== id)
    localStorage.setItem('lumi-products', JSON.stringify(updated))
    set({ products: updated })
  },

  updateStock: (id, soldQty) => {
    const updated = get().products.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock - soldQty), sold: p.sold + soldQty }
      }
      return p
    })
    localStorage.setItem('lumi-products', JSON.stringify(updated))
    set({ products: updated })
  },

  getCategories: () => {
    return [...new Set(get().products.map(p => p.category))]
  },

  getBestSellers: () => {
    return [...get().products].sort((a, b) => b.sold - a.sold).slice(0, 5)
  },

  getTrending: () => {
    return [...get().products].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
  }
}))

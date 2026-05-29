import { create } from 'zustand'

const DEFAULT_PROMOS = [
  { code: 'WELCOME10', discountPct: 10, minPurchase: 100000, maxDiscount: 50000, active: true },
  { code: 'FREESHIP', discountAmount: 20000, minPurchase: 150000, active: true }
]

const DEFAULT_FLASH_SALES = {
  active: true,
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  products: [1, 3, 7]
}

export const usePromoStore = create((set, get) => ({
  promos: [],
  flashSales: null,

  init: () => {
    const savedPromos = localStorage.getItem('lumi-promos')
    const savedFlashSales = localStorage.getItem('lumi-flash-sales')
    
    if (savedPromos) {
      try {
        set({ promos: JSON.parse(savedPromos) })
      } catch(e) {
        set({ promos: DEFAULT_PROMOS })
      }
    } else {
      set({ promos: DEFAULT_PROMOS })
      localStorage.setItem('lumi-promos', JSON.stringify(DEFAULT_PROMOS))
    }

    if (savedFlashSales) {
      try {
        set({ flashSales: JSON.parse(savedFlashSales) })
      } catch(e) {
        set({ flashSales: DEFAULT_FLASH_SALES })
      }
    } else {
      set({ flashSales: DEFAULT_FLASH_SALES })
      localStorage.setItem('lumi-flash-sales', JSON.stringify(DEFAULT_FLASH_SALES))
    }
  },

  validatePromo: (code, subtotal) => {
    const promo = get().promos.find(p => p.code === code && p.active)
    if (!promo) return { valid: false, error: 'Invalid or expired promo code' }
    if (promo.minPurchase && subtotal < promo.minPurchase) {
      return { valid: false, error: `Minimum purchase of ${promo.minPurchase} required` }
    }
    
    let discount = 0
    if (promo.discountPct) {
      discount = (subtotal * promo.discountPct) / 100
      if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount)
    } else if (promo.discountAmount) {
      discount = promo.discountAmount
    }
    
    return { valid: true, discount, promo }
  },
  
  getFlashSaleProducts: () => {
    const fs = get().flashSales
    if (!fs || !fs.active) return []
    if (new Date(fs.endTime) < new Date()) return []
    return fs.products
  }
}))

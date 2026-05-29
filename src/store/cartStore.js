import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  
  init: () => {
    const saved = localStorage.getItem('lumi-cart')
    if (saved) {
      try {
        set({ items: JSON.parse(saved) })
      } catch(e) {
        localStorage.removeItem('lumi-cart')
      }
    }
  },

  addItem: (product, qty = 1) => {
    const { items } = get()
    const existing = items.find(i => i.id === product.id)
    let updated
    if (existing) {
      updated = items.map(i => 
        i.id === product.id 
          ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
          : i
      )
    } else {
      updated = [...items, { ...product, qty: Math.min(qty, product.stock) }]
    }
    localStorage.setItem('lumi-cart', JSON.stringify(updated))
    set({ items: updated })
  },

  removeItem: (productId) => {
    const updated = get().items.filter(i => i.id !== productId)
    localStorage.setItem('lumi-cart', JSON.stringify(updated))
    set({ items: updated })
  },

  updateQty: (productId, qty) => {
    if (qty < 1) return get().removeItem(productId)
    const updated = get().items.map(i =>
      i.id === productId ? { ...i, qty } : i
    )
    localStorage.setItem('lumi-cart', JSON.stringify(updated))
    set({ items: updated })
  },

  updateNote: (productId, note) => {
    const updated = get().items.map(i =>
      i.id === productId ? { ...i, note } : i
    )
    localStorage.setItem('lumi-cart', JSON.stringify(updated))
    set({ items: updated })
  },

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + (i.price * i.qty), 0)
  },

  getCount: () => {
    return get().items.reduce((sum, i) => sum + i.qty, 0)
  },

  clear: () => {
    localStorage.setItem('lumi-cart', JSON.stringify([]))
    set({ items: [] })
  }
}))

import { create } from 'zustand'

export const useWishlistStore = create((set, get) => ({
  wishlist: [],

  init: () => {
    const saved = localStorage.getItem('lumi-wishlist')
    if (saved) {
      try {
        set({ wishlist: JSON.parse(saved) })
      } catch(e) {
        localStorage.removeItem('lumi-wishlist')
      }
    }
  },

  addWishlist: (productId) => {
    const current = get().wishlist
    if (!current.includes(productId)) {
      const updated = [...current, productId]
      localStorage.setItem('lumi-wishlist', JSON.stringify(updated))
      set({ wishlist: updated })
    }
  },

  removeWishlist: (productId) => {
    const updated = get().wishlist.filter(id => id !== productId)
    localStorage.setItem('lumi-wishlist', JSON.stringify(updated))
    set({ wishlist: updated })
  },
  
  toggleWishlist: (productId) => {
    const current = get().wishlist
    if (current.includes(productId)) {
      get().removeWishlist(productId)
    } else {
      get().addWishlist(productId)
    }
  },

  isInWishlist: (productId) => {
    return get().wishlist.includes(productId)
  }
}))

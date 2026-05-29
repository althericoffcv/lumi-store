import { create } from 'zustand'

export const useReviewStore = create((set, get) => ({
  reviews: [],

  init: () => {
    const saved = localStorage.getItem('lumi-reviews')
    if (saved) {
      try {
        set({ reviews: JSON.parse(saved) })
      } catch(e) {
        localStorage.removeItem('lumi-reviews')
      }
    }
  },

  addReview: (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString()
    }
    const updated = [newReview, ...get().reviews]
    localStorage.setItem('lumi-reviews', JSON.stringify(updated))
    set({ reviews: updated })
    return newReview
  },

  getReviewsForProduct: (productId) => {
    return get().reviews.filter(r => r.productId === productId)
  },
  
  getAverageRating: (productId) => {
    const productReviews = get().getReviewsForProduct(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
    return sum / productReviews.length
  }
}))

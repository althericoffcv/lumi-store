import { create } from 'zustand'

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = Date.now()
    set(s => ({ toasts: [...s.toasts, { id, message, type, exiting: false }] }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.map(t => t.id === id ? { ...t, exiting: true } : t) }))
      setTimeout(() => {
        set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
      }, 300)
    }, 3000)
  },

  removeToast: (id) => {
    set(s => ({ toasts: s.toasts.map(t => t.id === id ? { ...t, exiting: true } : t) }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 300)
  }
}))

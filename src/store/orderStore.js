import { create } from 'zustand'

export const useOrderStore = create((set, get) => ({
  orders: [],

  init: () => {
    const saved = localStorage.getItem('lumi-orders')
    if (saved) {
      try {
        set({ orders: JSON.parse(saved) })
      } catch(e) {
        localStorage.removeItem('lumi-orders')
      }
    }
  },

  generateInvoiceId: () => {
    const date = new Date()
    const prefix = `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
    const randomSeq = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomSeq}`
  },

  addOrder: (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      invoiceId: order.invoiceId || get().generateInvoiceId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    const updated = [newOrder, ...get().orders]
    localStorage.setItem('lumi-orders', JSON.stringify(updated))
    set({ orders: updated })
    return newOrder
  },

  updateStatus: (orderId, status) => {
    const updated = get().orders.map(o =>
      o.id === orderId ? { ...o, status } : o
    )
    localStorage.setItem('lumi-orders', JSON.stringify(updated))
    set({ orders: updated })
  },
  
  cancelOrder: (orderId) => {
    get().updateStatus(orderId, 'cancelled')
  },

  getOrdersByUser: (userId) => {
    return get().orders.filter(o => o.userId === userId)
  },

  getTodayOrders: () => {
    const today = new Date().toDateString()
    return get().orders.filter(o => new Date(o.createdAt).toDateString() === today)
  },

  getWeekOrders: () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return get().orders.filter(o => new Date(o.createdAt) >= weekAgo)
  },

  getMonthOrders: () => {
    const now = new Date()
    return get().orders.filter(o => {
      const d = new Date(o.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  },

  getPendingOrders: () => get().orders.filter(o => o.status === 'pending'),
  getDoneOrders: () => get().orders.filter(o => o.status === 'delivered' || o.status === 'done'),

  getTotalRevenue: () => {
    return get().orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)
  },

  getRecentOrders: (n = 10) => get().orders.slice(0, n)
}))

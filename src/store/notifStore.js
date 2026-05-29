import { create } from 'zustand'

export const useNotifStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  showPanel: false,

  init: () => {
    const saved = localStorage.getItem('lumi-notifs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        set({ notifications: parsed, unreadCount: parsed.filter(n => !n.read).length })
      } catch(e) {
        localStorage.removeItem('lumi-notifs')
      }
    }
  },

  addNotification: (notif) => {
    const newNotif = {
      ...notif,
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString()
    }
    const updated = [newNotif, ...get().notifications]
    localStorage.setItem('lumi-notifs', JSON.stringify(updated))
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length })
  },

  markAllRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }))
    localStorage.setItem('lumi-notifs', JSON.stringify(updated))
    set({ notifications: updated, unreadCount: 0 })
  },

  togglePanel: () => set(s => ({ showPanel: !s.showPanel })),
  closePanel: () => set({ showPanel: false }),

  clearAll: () => {
    localStorage.setItem('lumi-notifs', JSON.stringify([]))
    set({ notifications: [], unreadCount: 0 })
  }
}))

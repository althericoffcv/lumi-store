import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
  user: null,
  users: [],
  
  init: () => {
    const saved = localStorage.getItem('lumi-user')
    if (saved) {
      try {
        set({ user: JSON.parse(saved) })
      } catch(e) {
        localStorage.removeItem('lumi-user')
      }
    }
    // Load users from localStorage
    let savedUsers = localStorage.getItem('lumi-users')
    let usersList = savedUsers ? JSON.parse(savedUsers) : []
    
    // Force inject / update admin user to use lowercase 'lumi' and 'lumistore'
    const adminIndex = usersList.findIndex(u => u.role === 'admin')
    if (adminIndex >= 0) {
      usersList[adminIndex].username = 'lumi'
      usersList[adminIndex].password = 'lumistore'
    } else {
      usersList.push({
        id: 1,
        username: 'lumi',
        password: 'lumistore',
        nama: 'Admin Lumi',
        whatsapp: '628123456789',
        role: 'admin',
        createdAt: new Date().toISOString()
      })
    }
    
    localStorage.setItem('lumi-users', JSON.stringify(usersList))
    set({ users: usersList })
  },

  login: (username, password) => {
    const { users } = get()
    const found = users.find(u => u.username === username && u.password === password)
    if (!found) return { success: false, message: 'Username atau password salah' }
    localStorage.setItem('lumi-user', JSON.stringify(found))
    set({ user: found })
    return { success: true }
  },

  register: ({ username, password, nama, whatsapp }) => {
    const { users } = get()
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username sudah digunakan' }
    }
    const newUser = {
      id: Date.now(),
      username,
      password,
      nama,
      whatsapp,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    const updated = [...users, newUser]
    localStorage.setItem('lumi-users', JSON.stringify(updated))
    localStorage.setItem('lumi-user', JSON.stringify(newUser))
    set({ users: updated, user: newUser })
    return { success: true }
  },

  logout: () => {
    localStorage.removeItem('lumi-user')
    set({ user: null })
  },

  getUsers: () => get().users,
  getUserCount: () => get().users.filter(u => u.role !== 'admin').length
}))

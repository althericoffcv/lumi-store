import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', nama: '', whatsapp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore(s => s.register)
  const navigate = useNavigate()
  const addToast = useToastStore(s => s.addToast)

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim() || !form.password.trim() || !form.nama.trim() || !form.whatsapp.trim()) {
      setError('Semua field harus diisi')
      return
    }
    if (form.password.length < 4) {
      setError('Password minimal 4 karakter')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const result = register(form)
      if (result.success) {
        addToast('Registrasi berhasil! Selamat berbelanja 🎉', 'success')
        navigate('/')
      } else {
        setError(result.message)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-logo">Lumi <em>Store</em></div>
        <div className="auth-subtitle">Buat akun baru</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input className="form-input" type="text" value={form.nama} onChange={handleChange('nama')} placeholder="Masukkan nama lengkap" />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={form.username} onChange={handleChange('username')} placeholder="Pilih username" autoComplete="username" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={handleChange('password')} placeholder="Minimal 4 karakter" autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp</label>
            <input className="form-input" type="text" value={form.whatsapp} onChange={handleChange('whatsapp')} placeholder="628xxxxxxxxxx" />
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12, textAlign: 'center' }}>{error}</div>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        <div className="auth-switch">
          Sudah punya akun? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

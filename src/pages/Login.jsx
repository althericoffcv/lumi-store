import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import GridBg from '../components/GridBg'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()
  const addToast = useToastStore(s => s.addToast)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Semua field harus diisi')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const result = login(username, password)
      if (result.success) {
        addToast('Login berhasil! Selamat datang 👋', 'success')
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
        <div className="auth-subtitle">Masuk ke akun kamu</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12, textAlign: 'center' }}>{error}</div>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        <div className="auth-switch">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </div>
      </div>
    </div>
  )
}

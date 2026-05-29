import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useOrderStore } from '../store/orderStore'
import { useToastStore } from '../store/toastStore'

function formatPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function Profile() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const orders = useOrderStore(s => s.orders)
  const initOrders = useOrderStore(s => s.init)
  const addToast = useToastStore(s => s.addToast)
  const navigate = useNavigate()

  React.useEffect(() => { initOrders() }, [])

  const myOrders = orders.filter(o => o.userId === user?.id)

  const handleLogout = () => {
    logout()
    addToast('Berhasil logout. Sampai jumpa! 👋', 'info')
    navigate('/login')
  }

  return (
    <div className="profile-page page-enter">
      <div className="section-header">
        <h2 className="section-title">Profile</h2>
        <div className="section-line" />
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{user?.nama?.[0]?.toUpperCase() || '?'}</div>
        <div className="profile-name">{user?.nama}</div>
        <div className="profile-username">@{user?.username}</div>

        <div className="profile-row">
          <span className="profile-row-label">Role</span>
          <span className="profile-row-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
        </div>
        <div className="profile-row">
          <span className="profile-row-label">WhatsApp</span>
          <span className="profile-row-value">{user?.whatsapp}</span>
        </div>
        <div className="profile-row">
          <span className="profile-row-label">Member Sejak</span>
          <span className="profile-row-value">{new Date(user?.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="profile-row">
          <span className="profile-row-label">Total Pesanan</span>
          <span className="profile-row-value">{myOrders.length}</span>
        </div>
        {myOrders.length > 0 && (
          <div className="profile-row">
            <span className="profile-row-label">Total Belanja</span>
            <span className="profile-row-value" style={{ color: 'var(--accent)' }}>
              {formatPrice(myOrders.reduce((s, o) => s + o.total, 0))}
            </span>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {myOrders.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: 20 }}>Riwayat Pesanan</h2>
            <div className="section-line" />
          </div>
          {myOrders.map(order => (
            <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>#{order.id}</span>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>
              {order.products.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: '3px 0', color: 'var(--text)' }}>
                  <span>{p.name} × {p.qty}</span>
                  <span style={{ color: 'var(--muted)' }}>{formatPrice(p.price * p.qty)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border2)', marginTop: 8, paddingTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--accent)' }}>
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 4 }}>
                {new Date(order.createdAt).toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { useNotifStore } from '../store/notifStore'

function timeAgo(date) {
  const s = Math.floor((new Date() - new Date(date)) / 1000)
  if (s < 60) return 'Baru saja'
  if (s < 3600) return Math.floor(s / 60) + ' menit lalu'
  if (s < 86400) return Math.floor(s / 3600) + ' jam lalu'
  return Math.floor(s / 86400) + ' hari lalu'
}

export default function NotifPanel() {
  const notifications = useNotifStore(s => s.notifications)
  const markAllRead = useNotifStore(s => s.markAllRead)
  const closePanel = useNotifStore(s => s.closePanel)
  const clearAll = useNotifStore(s => s.clearAll)

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <span>🔔 Notifikasi</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={markAllRead} style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Tandai dibaca</button>
          <button onClick={clearAll} style={{ fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Hapus semua</button>
          <button onClick={closePanel} style={{ fontSize: 14, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      </div>
      {notifications.length === 0 ? (
        <div className="notif-empty">Belum ada notifikasi</div>
      ) : (
        notifications.map(n => (
          <div key={n.id} className="notif-item" style={{ background: n.read ? 'transparent' : 'var(--accent3)' }}>
            <div className="notif-item-title">{n.title}</div>
            <div className="notif-item-detail">{n.detail}</div>
            <div className="notif-item-time">{timeAgo(n.createdAt)}</div>
          </div>
        ))
      )}
    </div>
  )
}

import React from 'react'
import { useToastStore } from '../store/toastStore'

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}

export default function ToastContainer() {
  const toasts = useToastStore(s => s.toasts)
  const removeToast = useToastStore(s => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast ${t.type}${t.exiting ? ' toast-exit' : ''}`}
          onClick={() => removeToast(t.id)}
        >
          <span className="toast-icon">{icons[t.type] || 'ℹ'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

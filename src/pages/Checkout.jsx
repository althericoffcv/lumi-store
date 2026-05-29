import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useOrderStore } from '../store/orderStore'
import { useProductStore } from '../store/productStore'
import { useNotifStore } from '../store/notifStore'
import { useToastStore } from '../store/toastStore'

function formatPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function Checkout() {
  const items = useCartStore(s => s.items)
  const getTotal = useCartStore(s => s.getTotal)
  const clearCart = useCartStore(s => s.clear)
  const user = useAuthStore(s => s.user)
  const addOrder = useOrderStore(s => s.addOrder)
  const initOrders = useOrderStore(s => s.init)
  const updateStock = useProductStore(s => s.updateStock)
  const addNotif = useNotifStore(s => s.addNotification)
  const addToast = useToastStore(s => s.addToast)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nama: user?.nama || '',
    whatsapp: user?.whatsapp || '',
    note: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    initOrders()
    if (items.length === 0) navigate('/cart')
  }, [])

  const total = getTotal()

  const validate = () => {
    const errs = {}
    if (!form.nama.trim()) {
      errs.nama = 'Nama wajib diisi'
    } else if (form.nama.trim().length < 3) {
      errs.nama = 'Nama minimal 3 karakter'
    }
    
    if (!form.whatsapp.trim()) {
      errs.whatsapp = 'WhatsApp wajib diisi'
    } else if (!/^(0|62|\+62)8[1-9][0-9]{6,10}$/.test(form.whatsapp.trim().replace(/[\s-]/g, ''))) {
      errs.whatsapp = 'Format nomor WhatsApp tidak valid. Gunakan format: 08xx atau 628xx'
    }
    
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    setTimeout(() => {
      // Create order
      const order = addOrder({
        userId: user.id,
        nama: form.nama,
        whatsapp: form.whatsapp,
        products: items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          thumbnail: i.thumbnail,
          note: i.note
        })),
        total,
        note: form.note
      })

      // Update stock
      items.forEach(item => {
        updateStock(item.id, item.qty)
      })

      // Add notification for admin
      const productList = items.map(i => `${i.name} x${i.qty}${i.note ? ` (Note: ${i.note})` : ''}`).join(', ')
      addNotif({
        title: '🛒 Pesanan Baru!',
        detail: `${form.nama} (${form.whatsapp})\nProduk: ${productList}\nTotal: ${formatPrice(total)}${form.note ? '\nCatatan: ' + form.note : ''}`
      })

      // Clear cart
      clearCart()

      addToast('Checkout berhasil! Pesanan kamu sedang diproses 🎉', 'success')
      navigate('/')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="checkout-page page-enter">
      <div className="section-header">
        <h2 className="section-title">Checkout</h2>
        <div className="section-line" />
      </div>

      <div className="order-items-summary">
        <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Pesanan kamu</div>
        {items.map(item => (
          <div key={item.id} className="order-item-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent)' }}>{formatPrice(item.price * item.qty)}</span>
            </div>
            {item.note && (
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', fontStyle: 'italic' }}>
                Note: {item.note}
              </div>
            )}
          </div>
        ))}
        <div className="order-item-row" style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, fontWeight: 600 }}>
          <span>Total</span>
          <span style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent)', fontSize: 16 }}>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input
            className="form-input"
            type="text"
            value={form.nama}
            onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
            placeholder="Nama lengkap penerima"
          />
          {errors.nama && <div className="form-error">{errors.nama}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Nomor WhatsApp</label>
          <input
            className="form-input"
            type="text"
            value={form.whatsapp}
            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            placeholder="628xxxxxxxxxx"
          />
          {errors.whatsapp && <div className="form-error">{errors.whatsapp}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Catatan / Deskripsi</label>
          <textarea
            className="form-input form-textarea"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="Catatan untuk penjual (opsional)"
          />
        </div>
        <button className="checkout-btn" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : `Bayar ${formatPrice(total)}`}
        </button>
      </form>
    </div>
  )
}

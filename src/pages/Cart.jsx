import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

function formatPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function Cart() {
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const updateNote = useCartStore(s => s.updateNote)
  const removeItem = useCartStore(s => s.removeItem)
  const clearCart = useCartStore(s => s.clear)
  const getTotal = useCartStore(s => s.getTotal)
  const addToast = useToastStore(s => s.addToast)
  const navigate = useNavigate()

  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', paddingBottom: '100px', boxSizing: 'border-box' }}>
        <div className="section-header">
          <h2 className="section-title">Keranjang</h2>
          <div className="section-line" />
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <div className="empty-cart-text">Keranjang kamu masih kosong</div>
          <Link to="/" className="not-found-btn">Belanja Sekarang</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page page-enter" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', paddingBottom: '100px', boxSizing: 'border-box' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Keranjang</h2>
          <div className="section-line" style={{ width: '40px' }} />
        </div>
        <button onClick={() => { clearCart(); addToast('Keranjang dibersihkan', 'info'); }} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '20px', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px' }}>
          Clear Cart
        </button>
      </div>

      {items.map(item => (
        <div key={item.id} className="cart-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={item.thumbnail} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">{formatPrice(item.price)}</div>
            </div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
              <span className="qty-val">{item.qty}</span>
              <button className="qty-btn" onClick={() => updateQty(item.id, Math.min(item.stock, item.qty + 1))}>+</button>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--text)', minWidth: 100, textAlign: 'right' }}>
              {formatPrice(item.price * item.qty)}
            </div>
            <button className="cart-item-remove" onClick={() => { removeItem(item.id); addToast('Item dihapus dari keranjang', 'info') }}>✕</button>
          </div>
          <div style={{ marginTop: '12px', paddingLeft: '80px' }}>
            <input 
              type="text" 
              placeholder="Tambahkan catatan untuk item ini..." 
              value={item.note || ''}
              onChange={(e) => updateNote(item.id, e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                padding: '8px 12px',
                borderRadius: '8px',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: '12px'
              }}
            />
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal ({items.length} item)</span>
          <span style={{ color: 'var(--text)', fontFamily: "'DM Mono', monospace" }}>{formatPrice(total)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Ongkir</span>
          <span style={{ color: '#3da85e' }}>Gratis</span>
        </div>
        <div className="cart-summary-total">
          <span>Total</span>
          <span style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
        </div>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Checkout →
        </button>
      </div>
    </div>
  )
}

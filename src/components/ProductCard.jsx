import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

function formatPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1)
  const addItem = useCartStore(s => s.addItem)
  const addToast = useToastStore(s => s.addToast)
  const outOfStock = product.stock <= 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product, qty)
    addToast(`${product.name} ditambahkan ke keranjang!`, 'success')
    setQty(1)
  }

  const isBestseller = product.sold >= 200
  const isNew = new Date() - new Date(product.createdAt) < 30 * 24 * 60 * 60 * 1000

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="product-card-img-wrap">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="%23f0e4ea" width="400" height="400"/><text x="200" y="200" text-anchor="middle" dy=".3em" fill="%23c4a8b4" font-family="sans-serif" font-size="40">📦</text></svg>' }}
          />
          {outOfStock && <span className="product-card-badge out-of-stock">Habis</span>}
          {!outOfStock && isBestseller && <span className="product-card-badge bestseller">Best Seller</span>}
          {!outOfStock && !isBestseller && isNew && <span className="product-card-badge new">New</span>}
        </div>
        <div className="product-card-body">
          <div className="product-card-category">{product.category}</div>
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-desc">{product.description}</div>
          <div className="product-card-footer">
            <span className="product-card-price">{formatPrice(product.price)}</span>
            <div className="product-card-stats">
              <span>📦 {product.stock}</span>
              <span>🔥 {product.sold} sold</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="product-card-actions">
        <div className="qty-control">
          <button className="qty-btn" onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)); }} disabled={outOfStock}>−</button>
          <span className="qty-val">{qty}</span>
          <button className="qty-btn" onClick={(e) => { e.preventDefault(); setQty(Math.min(product.stock, qty + 1)); }} disabled={outOfStock}>+</button>
        </div>
        <button className="add-cart-btn" onClick={(e) => { e.preventDefault(); handleAdd(); }} disabled={outOfStock}>
          {outOfStock ? 'Habis' : '+ Keranjang'}
        </button>
      </div>
    </div>
  )
}

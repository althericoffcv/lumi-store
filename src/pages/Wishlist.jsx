import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '../store/wishlistStore'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const wishlistIds = useWishlistStore(s => s.wishlist || [])
  const products = useProductStore(s => s.products)
  
  const items = wishlistIds.map(id => products.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="page-enter" style={{ 
      padding: '24px 16px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      height: 'calc(100vh - 64px)', 
      overflowY: 'auto',
      paddingBottom: '100px' // for bottom nav clearance
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="modern-hero-title" style={{ fontSize: '2rem' }}>My <em>Wishlist</em></h1>
        <p className="modern-hero-sub" style={{ fontSize: '1rem' }}>Your favorite items saved for later.</p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤍</div>
          <h2>Your wishlist is empty</h2>
          <p style={{ marginBottom: '24px' }}>Explore our store and find something you love!</p>
          <Link to="/" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '30px', background: 'var(--accent)', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

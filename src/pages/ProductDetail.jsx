import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useToastStore } from '../store/toastStore'

function formatPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const products = useProductStore(s => s.products)
  const product = products.find(p => p.id.toString() === slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  
  const addItem = useCartStore(s => s.addItem)
  const toggleWishlistFn = useWishlistStore(s => s.toggleWishlist)
  const toggleWishlist = () => toggleWishlistFn(product?.id)
  const inWishlist = useWishlistStore(s => product ? s.isInWishlist(product.id) : false)
  const addToast = useToastStore(s => s.addToast)

  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!product) {
    return (
      <div className="page-enter modern-hero" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 24px', marginTop: '20px', borderRadius: '30px', background: 'var(--accent)', color: '#fff', border: 'none' }}>Back to Store</button>
      </div>
    )
  }

  const outOfStock = product.stock <= 0
  const isBestseller = product.sold >= 200
  
  // Mock gallery
  const gallery = [
    product.thumbnail,
    product.thumbnail + '&q=80',
    product.thumbnail + '&q=60'
  ]

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product, qty)
    addToast(`${product.name} ditambahkan ke keranjang!`, 'success')
  }

  const handleBuyNow = () => {
    if (outOfStock) return
    addItem(product, qty)
    navigate('/cart')
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      addToast('Link copied to clipboard!', 'info')
    }
  }

  return (
    <div className="page-enter" style={{ padding: '24px 16px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', md: { flexDirection: 'row' } }} className="pdp-layout">
        
        {/* Gallery */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            aspectRatio: '1',
            cursor: 'zoom-in'
          }} className="zoom-container">
            <img 
              src={gallery[activeImage]} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              className="zoom-image"
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
              {outOfStock && <span className="badge" style={{ background: '#ff4d4f', color: '#fff' }}>Habis</span>}
              {!outOfStock && isBestseller && <span className="badge">Best Seller</span>}
            </div>
            <button 
              onClick={() => { toggleWishlist(); addToast(inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist', 'info'); }}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '20px', color: inWishlist ? 'var(--accent)' : 'var(--muted)'
              }}
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {gallery.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${product.name} ${idx}`}
                onClick={() => setActiveImage(idx)}
                style={{
                  width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover',
                  border: activeImage === idx ? '2px solid var(--accent)' : '1px solid var(--border)',
                  cursor: 'pointer', opacity: activeImage === idx ? 1 : 0.6
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div className="header-eyebrow">{product.category}</div>
            <h1 className="modern-hero-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: '#FFB800' }}>★★★★★ <span style={{ color: 'var(--muted)', marginLeft: '8px', fontSize: '0.9rem' }}>(4.8)</span></div>
              <span style={{ color: 'var(--muted)' }}>•</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{product.sold} sold</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accentd)' }}>
              {formatPrice(product.price)}
            </div>
          </div>

          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>{product.description}</p>

          <div style={{ padding: '20px', background: 'var(--surface2)', borderRadius: '16px', border: '1px solid var(--border2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: '600' }}>Availability:</span>
              <span style={{ color: outOfStock ? '#ff4d4f' : 'var(--accent)' }}>
                {outOfStock ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontWeight: '600' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '30px', padding: '4px 8px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={outOfStock} style={{ background: 'none', border: 'none', padding: '4px 12px', fontSize: '18px', cursor: 'pointer', color: 'var(--text)' }}>−</button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} disabled={outOfStock} style={{ background: 'none', border: 'none', padding: '4px 12px', fontSize: '18px', cursor: 'pointer', color: 'var(--text)' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleAdd} disabled={outOfStock} className="add-cart-btn" style={{ flex: 1, padding: '14px', borderRadius: '30px', background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)', fontWeight: 'bold', cursor: outOfStock ? 'not-allowed' : 'pointer', opacity: outOfStock ? 0.5 : 1 }}>
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} disabled={outOfStock} className="add-cart-btn" style={{ flex: 1, padding: '14px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: outOfStock ? 'not-allowed' : 'pointer', opacity: outOfStock ? 0.5 : 1 }}>
                  Buy Now
                </button>
              </div>
              <button onClick={handleShare} style={{ padding: '12px', borderRadius: '30px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                🔗 Share this product
              </button>
            </div>
          </div>

          {/* Specs & FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <details style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <summary style={{ fontWeight: '600', cursor: 'pointer', outline: 'none' }}>Specifications</summary>
              <div style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.9rem', display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Category</span><span>{product.category}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SKU</span><span>LUMI-{product.id}-00{product.id}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Weight</span><span>500g</span></div>
              </div>
            </details>
            <details style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <summary style={{ fontWeight: '600', cursor: 'pointer', outline: 'none' }}>Shipping & Returns</summary>
              <div style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Free shipping on orders over Rp 500.000. Returns accepted within 14 days of delivery.
              </div>
            </details>
            <details style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <summary style={{ fontWeight: '600', cursor: 'pointer', outline: 'none' }}>Reviews (12)</summary>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem' }}>Alice M.</strong>
                    <span style={{ color: '#FFB800', fontSize: '0.8rem' }}>★★★★★</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Amazing quality, exactly as described. Will definitely buy again!</p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem' }}>Budi S.</strong>
                    <span style={{ color: '#FFB800', fontSize: '0.8rem' }}>★★★★☆</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Good product, but delivery took a bit longer than expected.</p>
                </div>
              </div>
            </details>
          </div>

        </div>
      </div>
      
      {/* Related Products */}
      <div style={{ marginTop: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 className="modern-hero-title" style={{ fontSize: '1.8rem', margin: 0 }}>Related <em>Products</em></h2>
        </div>
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
            <div key={p.id} className="product-card">
              <a href={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="product-card-img-wrap">
                  <img src={p.thumbnail} alt={p.name} className="product-card-img" loading="lazy" />
                  {p.stock <= 0 && <span className="product-card-badge out-of-stock">Habis</span>}
                </div>
                <div className="product-card-body">
                  <div className="product-card-category">{p.category}</div>
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-footer">
                    <span className="product-card-price">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .pdp-layout {
            flex-direction: row !important;
          }
        }
        .zoom-container:hover .zoom-image {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

import React, { useEffect, useState, useMemo } from 'react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'

export default function Store() {
  const products = useProductStore(s => s.products)
  const loading = useProductStore(s => s.loading)
  const init = useProductStore(s => s.init)
  const getCategories = useProductStore(s => s.getCategories)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')

  useEffect(() => { init() }, [])

  const categories = useMemo(() => getCategories(), [products])

  const filtered = useMemo(() => {
    let list = [...products]
    
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    
    if (category !== 'all') {
      list = list.filter(p => p.category === category)
    }
    
    switch (sort) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break
      case 'price-high': list.sort((a, b) => b.price - a.price); break
      case 'newest': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'bestseller': list.sort((a, b) => b.sold - a.sold); break
      default: break
    }
    
    return list
  }, [products, search, category, sort])

  return (
    <div className="page-enter">
      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="modern-hero-bg"></div>
        <div className="modern-hero-content">
          <div className="modern-hero-badge">✦ New Collection</div>
          <h1 className="modern-hero-title">Elevate Your<br/><em>Lifestyle</em></h1>
          <p className="modern-hero-sub">
            Temukan kurasi produk premium terbaik dengan kualitas original dan harga yang tidak tertandingi.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        
        {/* Modern Filter Toolbar */}
        <div className="modern-toolbar">
          <div className="modern-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari produk impianmu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="modern-sort">
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Urutkan: Relevansi</option>
              <option value="newest">Paling Baru</option>
              <option value="bestseller">Paling Laris</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          <button className={`cat-pill ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>Semua Kategori</button>
          {categories.map(c => (
            <button key={c} className={`cat-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12, opacity: .5 }}>🔍</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>Produk tidak ditemukan</div>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

import React, { useEffect, useState, useMemo } from 'react'
import { useOrderStore } from '../store/orderStore'
import { useProductStore } from '../store/productStore'
import { useAuthStore } from '../store/authStore'
import { useNotifStore } from '../store/notifStore'
import { useToastStore } from '../store/toastStore'
import Modal from '../components/Modal'

function formatPrice(n) {
  return 'Rp ' + (n || 0).toLocaleString('id-ID')
}

export default function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discount: '',
    category: '',
    stock: '',
    images: '',
    badges: '',
    specs: '',
    faq: ''
  })
  
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  const [notifForm, setNotifForm] = useState({ title: '', message: '' })

  const products = useProductStore(s => s.products)
  const initProducts = useProductStore(s => s.init)
  const addProduct = useProductStore(s => s.addProduct)
  const updateProduct = useProductStore(s => s.updateProduct)
  const deleteProduct = useProductStore(s => s.deleteProduct)
  
  const orders = useOrderStore(s => s.orders)
  const initOrders = useOrderStore(s => s.init)
  const getTodayOrders = useOrderStore(s => s.getTodayOrders)
  const getWeekOrders = useOrderStore(s => s.getWeekOrders)
  const getMonthOrders = useOrderStore(s => s.getMonthOrders)
  const getPendingOrders = useOrderStore(s => s.getPendingOrders)
  const getDoneOrders = useOrderStore(s => s.getDoneOrders)
  const getTotalRevenue = useOrderStore(s => s.getTotalRevenue)
  const updateStatus = useOrderStore(s => s.updateStatus)
  
  const getUserCount = useAuthStore(s => s.getUserCount)
  const getBestSellers = useProductStore(s => s.getBestSellers)
  const initNotifs = useNotifStore(s => s.init)
  const addNotification = useNotifStore(s => s.addNotification)
  const addToast = useToastStore(s => s.addToast)

  useEffect(() => {
    initProducts()
    initOrders()
    initNotifs()
  }, [])

  const todayOrders = getTodayOrders()
  const weekOrders = getWeekOrders()
  const monthOrders = getMonthOrders()
  const pendingOrders = getPendingOrders()
  const doneOrders = getDoneOrders()
  const totalRevenue = getTotalRevenue()
  const userCount = getUserCount()
  const bestSellers = getBestSellers()

  const todayPending = todayOrders.filter(o => o.status === 'pending')
  const weekPending = weekOrders.filter(o => o.status === 'pending')
  const monthPending = monthOrders.filter(o => o.status === 'pending')

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderFilter !== 'all' && o.status !== orderFilter) return false
      if (orderSearch) {
        const q = orderSearch.toLowerCase()
        return o.nama?.toLowerCase().includes(q) || String(o.id).toLowerCase().includes(q) || o.whatsapp?.includes(q)
      }
      return true
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, orderFilter, orderSearch])

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '', description: '', shortDescription: '', price: '', discount: '', category: '', stock: '', images: '', badges: '', specs: '', faq: ''
    })
    setShowProductModal(true)
  }

  const openEditProduct = (p) => {
    setEditingProduct(p)
    setProductForm({
      name: p.name || '',
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      price: String(p.price || ''),
      discount: String(p.discount || ''),
      category: p.category || '',
      stock: String(p.stock || ''),
      images: p.images ? p.images.join(', ') : (p.thumbnail || ''),
      badges: p.badges ? p.badges.join(', ') : '',
      specs: p.specs ? Object.entries(p.specs).map(([k, v]) => `${k}:${v}`).join('\n') : '',
      faq: p.faq ? p.faq.map(f => `${f.q}:${f.a}`).join('\n') : ''
    })
    setShowProductModal(true)
  }

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock) {
      addToast('Lengkapi semua field wajib!', 'error')
      return
    }

    const parsedImages = productForm.images ? productForm.images.split(',').map(s => s.trim()).filter(Boolean) : []
    if (parsedImages.length === 0) {
      parsedImages.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop')
    }

    const parsedBadges = productForm.badges ? productForm.badges.split(',').map(s => s.trim()).filter(Boolean) : []
    
    const parsedSpecs = {}
    if (productForm.specs) {
      productForm.specs.split('\n').forEach(line => {
        const [k, ...v] = line.split(':')
        if (k && v.length) parsedSpecs[k.trim()] = v.join(':').trim()
      })
    }

    const parsedFaq = []
    if (productForm.faq) {
      productForm.faq.split('\n').forEach(line => {
        const [q, ...a] = line.split(':')
        if (q && a.length) parsedFaq.push({ q: q.trim(), a: a.join(':').trim() })
      })
    }

    const data = {
      name: productForm.name,
      description: productForm.description,
      shortDescription: productForm.shortDescription,
      price: parseInt(productForm.price) || 0,
      discount: parseInt(productForm.discount) || 0,
      category: productForm.category,
      stock: parseInt(productForm.stock) || 0,
      images: parsedImages,
      thumbnail: parsedImages[0],
      badges: parsedBadges,
      specs: parsedSpecs,
      faq: parsedFaq
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, data)
      addToast('Produk berhasil diupdate!', 'success')
    } else {
      addProduct(data)
      addToast('Produk berhasil ditambahkan!', 'success')
    }
    setShowProductModal(false)
  }

  const handleDeleteProduct = (id, name) => {
    if (confirm(`Hapus produk "${name}"?`)) {
      deleteProduct(id)
      addToast('Produk dihapus', 'info')
    }
  }

  const handleOrderStatus = (orderId, newStatus) => {
    updateStatus(orderId, newStatus)
    addToast(`Status pesanan diubah ke ${newStatus}`, 'success')
  }

  return (
    <div className="admin-page page-enter">
      <div className="section-header">
        <h2 className="section-title">Admin Dashboard</h2>
        <div className="section-line" />
      </div>

      <div className="admin-tabs">
        {['dashboard', 'products', 'orders', 'notifs'].map(t => (
          <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'dashboard' ? '📊 Dashboard' : t === 'products' ? '📦 Produk' : t === 'orders' ? '📋 Orders' : '📢 Notifikasi'}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Order Hari Ini</div>
              <div className="stat-value">{todayOrders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Order Minggu Ini</div>
              <div className="stat-value">{weekOrders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Order Bulan Ini</div>
              <div className="stat-value">{monthOrders.length}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">Pending Hari Ini</div>
              <div className="stat-value" style={{ color: '#c8960c' }}>{todayPending.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending Minggu Ini</div>
              <div className="stat-value" style={{ color: '#c8960c' }}>{weekPending.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending Bulan Ini</div>
              <div className="stat-value" style={{ color: '#c8960c' }}>{monthPending.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Selesai</div>
              <div className="stat-value" style={{ color: '#3da85e' }}>{doneOrders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Omzet Total</div>
              <div className="stat-value" style={{ fontSize: 20, color: 'var(--accent)' }}>{formatPrice(totalRevenue)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total User</div>
              <div className="stat-value">{userCount}</div>
            </div>
          </div>

          <div className="admin-section" style={{ marginTop: 24 }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>📊 Grafik Pendapatan Mingguan (Simulasi)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 12, marginTop: 20, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              {[30, 50, 40, 70, 90, 60, 100].map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                   <div style={{ width: '100%', maxWidth: '40px', backgroundColor: 'var(--accent)', height: `${val}%`, borderRadius: '4px 4px 0 0', opacity: 0.8, transition: 'height 0.3s' }}></div>
                   <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>H-{6-i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section" style={{ marginTop: 24 }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>📊 Grafik Pendapatan Bulanan (Simulasi)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 8, marginTop: 20, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              {[40, 60, 45, 80, 55, 95, 75, 85, 65, 100, 90, 110].map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                   <div style={{ width: '100%', maxWidth: '30px', backgroundColor: 'var(--text)', height: `${Math.min(100, (val/110)*100)}%`, borderRadius: '4px 4px 0 0', opacity: 0.6, transition: 'height 0.3s' }}></div>
                   <span style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>B-{12-i}</span>
                </div>
              ))}
            </div>
          </div>

          {bestSellers.length > 0 && (
            <div className="admin-section" style={{ marginTop: 24 }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>🔥 Produk Terlaris</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bestSellers.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border2)' }}>
                    <img src={p.thumbnail} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.category}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontFamily: "'DM Mono', monospace", color: 'var(--accent)', fontWeight: 500, marginBottom: '2px' }}>{formatPrice(p.price)}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.sold} Terjual</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'products' && (
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)' }}>{products.length} produk</span>
            <button className="admin-btn-add" onClick={openAddProduct}>+ Tambah Produk</button>
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <img src={p.thumbnail} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      {p.badges?.length > 0 && <span style={{fontSize:'10px', background:'var(--accent)', color:'#fff', padding:'2px 6px', borderRadius:'10px', marginLeft:'6px', flexShrink: 0}}>{p.badges[0]}</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span>{p.category}</span>
                      <span>•</span>
                      <span>📦 Stok: {p.stock}</span>
                      <span>•</span>
                      <span>🔥 {p.sold} Terjual</span>
                    </div>
                    <div style={{ fontSize: '13px', fontFamily: "'DM Mono', monospace", color: 'var(--accent)', fontWeight: 600 }}>
                      {formatPrice(p.price)} {p.discount > 0 && <span style={{fontSize:'10px', color:'var(--muted)', fontWeight: 400, marginLeft:'4px'}}>{p.discount}% OFF</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <button className="admin-btn admin-btn-edit" onClick={() => openEditProduct(p)} style={{ padding: '6px 12px' }}>Edit</button>
                    <button className="admin-btn admin-btn-delete" onClick={() => handleDeleteProduct(p.id, p.name)} style={{ padding: '6px 12px' }}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-section">
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input className="form-input" placeholder="Cari ID, Nama, atau WhatsApp..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} style={{ flex: 1 }} />
            <select className="form-input" value={orderFilter} onChange={e => setOrderFilter(e.target.value)} style={{ width: '150px' }}>
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="done">Selesai</option>
              <option value="cancelled">Batal</option>
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontFamily: "'DM Sans', sans-serif" }}>Belum ada pesanan yang sesuai.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredOrders.map(o => (
                <div key={o.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>#{o.id} • {new Date(o.createdAt).toLocaleString('id-ID')}</div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>{o.nama}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{o.whatsapp}</div>
                    </div>
                    <span className={`status-badge status-${o.status}`}>{o.status}</span>
                  </div>
                  
                  <div style={{ padding: '12px 0', borderTop: '1px dashed var(--border2)', borderBottom: '1px dashed var(--border2)', marginBottom: '12px', fontSize: '12px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {o.products.map(p => `${p.name} × ${p.qty}`).join(', ')}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", color: 'var(--accent)', fontWeight: 600, fontSize: '15px' }}>
                      {formatPrice(o.total)}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="admin-btn" onClick={() => setSelectedOrder(o)}>Detail</button>
                      {o.status === 'pending' && (
                        <button className="admin-btn admin-btn-edit" onClick={() => handleOrderStatus(o.id, 'done')}>✓</button>
                      )}
                      {o.status !== 'cancelled' && (
                        <button className="admin-btn admin-btn-delete" onClick={() => handleOrderStatus(o.id, 'cancelled')}>✕</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'notifs' && (
        <div className="admin-section">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Kirim Notifikasi Global</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>Notifikasi ini akan diterima oleh seluruh user di Lumi Store.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Judul Notifikasi</label>
            <input className="form-input" placeholder="Promo Spesial / Info Penting..." value={notifForm.title} onChange={e => setNotifForm(f => ({...f, title: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Isi Pesan</label>
            <textarea className="form-input form-textarea" placeholder="Isi pesan notifikasi..." value={notifForm.message} onChange={e => setNotifForm(f => ({...f, message: e.target.value}))}></textarea>
          </div>
          <button className="checkout-btn" onClick={() => {
            if (!notifForm.title || !notifForm.message) return addToast('Judul dan pesan harus diisi!', 'error')
            addNotification({ title: notifForm.title, message: notifForm.message })
            addToast('Notifikasi berhasil dikirim ke semua user!', 'success')
            setNotifForm({ title: '', message: '' })
          }}>
            Kirim Notifikasi
          </button>
        </div>
      )}

      {showProductModal && (
        <Modal title={editingProduct ? 'Edit Produk' : 'Tambah Produk'} onClose={() => setShowProductModal(false)}>
          <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
            <div className="form-group">
              <label className="form-label">Nama Produk*</label>
              <input className="form-input" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama produk" />
            </div>
            <div className="form-group">
              <label className="form-label">Short Deskripsi</label>
              <textarea className="form-input form-textarea" style={{ height: 60 }} value={productForm.shortDescription} onChange={e => setProductForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Singkat, padat..." />
            </div>
            <div className="form-group">
              <label className="form-label">Long Deskripsi</label>
              <textarea className="form-input form-textarea" style={{ height: 100 }} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi lengkap produk" />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Harga (Rp)*</label>
                <input className="form-input" type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="299000" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Diskon (%)</label>
                <input className="form-input" type="number" value={productForm.discount} onChange={e => setProductForm(f => ({ ...f, discount: e.target.value }))} placeholder="10" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Kategori*</label>
                <input className="form-input" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} placeholder="Electronics..." />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Stock*</label>
                <input className="form-input" type="number" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} placeholder="50" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Images URL (Pisahkan dengan koma)</label>
              <textarea className="form-input form-textarea" style={{ height: 60 }} value={productForm.images} onChange={e => setProductForm(f => ({ ...f, images: e.target.value }))} placeholder="https://img1.jpg, https://img2.jpg" />
            </div>
            <div className="form-group">
              <label className="form-label">Badges (Pisahkan dengan koma)</label>
              <input className="form-input" value={productForm.badges} onChange={e => setProductForm(f => ({ ...f, badges: e.target.value }))} placeholder="New, Promo, Best Seller" />
            </div>
            <div className="form-group">
              <label className="form-label">Spesifikasi (Format: Kunci:Nilai per baris)</label>
              <textarea className="form-input form-textarea" style={{ height: 80 }} value={productForm.specs} onChange={e => setProductForm(f => ({ ...f, specs: e.target.value }))} placeholder="Warna: Hitam&#10;Berat: 1kg" />
            </div>
            <div className="form-group">
              <label className="form-label">FAQ (Format: Tanya:Jawab per baris)</label>
              <textarea className="form-input form-textarea" style={{ height: 80 }} value={productForm.faq} onChange={e => setProductForm(f => ({ ...f, faq: e.target.value }))} placeholder="Garansi?: 1 Tahun&#10;Original?: Ya" />
            </div>
          </div>
          <button className="checkout-btn" style={{ marginTop: 16 }} onClick={handleSaveProduct}>
            {editingProduct ? 'Update Produk' : 'Tambah Produk'}
          </button>
        </Modal>
      )}

      {selectedOrder && (
        <Modal title={`Invoice #${selectedOrder.id}`} onClose={() => setSelectedOrder(null)}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--text)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>Nama Pemesan</p>
                <p style={{ margin: 0, fontWeight: 500 }}>{selectedOrder.nama}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>WhatsApp</p>
                <p style={{ margin: 0, fontWeight: 500 }}>{selectedOrder.whatsapp}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>Alamat</p>
                <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{selectedOrder.alamat}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>Kurir</p>
                <p style={{ margin: 0, fontWeight: 500, textTransform: 'uppercase' }}>{selectedOrder.kurir}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>Status</p>
                <span className={`status-badge status-${selectedOrder.status}`}>{selectedOrder.status}</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>Tanggal Pesanan</p>
                <p style={{ margin: 0, fontWeight: 500 }}>{new Date(selectedOrder.createdAt).toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>Daftar Produk</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {selectedOrder.products.map(p => (
                  <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                      <span>{p.name} <span style={{ color: 'var(--muted)', fontSize: 12 }}>× {p.qty}</span></span>
                    </div>
                    <span style={{ color: 'var(--accent)', fontFamily: "'DM Mono', monospace" }}>{formatPrice(p.price * p.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: 12, marginBottom: 24, fontSize: 16, fontWeight: 'bold' }}>
              <span>Total Harga</span>
              <span style={{ color: 'var(--accent)', fontFamily: "'DM Mono', monospace" }}>{formatPrice(selectedOrder.total)}</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
               <button 
                 className="checkout-btn" 
                 style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }} 
                 onClick={() => {
                   const waNum = selectedOrder.whatsapp.replace(/\D/g, '');
                   const msg = `Halo ${selectedOrder.nama}, terkait pesanan #${selectedOrder.id} Anda...`;
                   window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
                 }}
               >
                 <span>💬</span> Hubungi via WA
               </button>
               {selectedOrder.status === 'pending' && (
                 <button 
                   className="admin-btn admin-btn-edit" 
                   style={{ flex: 1, padding: '12px' }} 
                   onClick={() => { 
                     handleOrderStatus(selectedOrder.id, 'done'); 
                     setSelectedOrder(null); 
                   }}
                 >
                   ✓ Tandai Selesai
                 </button>
               )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

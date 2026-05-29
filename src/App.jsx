import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useCartStore } from './store/cartStore'
import { useNotifStore } from './store/notifStore'
import { useProductStore } from './store/productStore'
import { useWishlistStore } from './store/wishlistStore'
import Splash from './components/Splash'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import GridBg from './components/GridBg'
import ToastContainer from './components/ToastContainer'
import Login from './pages/Login'
import Register from './pages/Register'
import Store from './pages/Store'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Wishlist from './pages/Wishlist'

function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const user = useAuthStore(s => s.user)
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  return children
}

function AuthRoute({ children }) {
  const user = useAuthStore(s => s.user)
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const initAuth = useAuthStore(s => s.init)
  const initCart = useCartStore(s => s.init)
  const initProducts = useProductStore(s => s.init)
  const initWishlist = useWishlistStore(s => s.init)

  useEffect(() => {
    initAuth()
    initCart()
    initProducts()
    initWishlist()
  }, [])

  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  const isNoFooterPage = ['/cart', '/wishlist'].includes(location.pathname)
  
  // Hide BottomNav on desktop or auth pages, but standard says just render it and we can hide on desktop using CSS, or just leave it. I'll add a wrapper.
  const isMobile = window.innerWidth <= 768

  return (
    <>
      {loading && <Splash onDone={() => setLoading(false)} />}
      <GridBg />
      <ToastContainer />
      {!isAuthPage && <Navbar />}
      <main style={{ position: 'relative', zIndex: 2, minHeight: '80vh', paddingBottom: isMobile && !isAuthPage && !isNoFooterPage ? '70px' : '0' }}>
        <Routes>
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/" element={<ProtectedRoute><Store /></ProtectedRoute>} />
          <Route path="/product/:slug" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && (
        <>
          <div className="bottom-nav-wrapper">
            <BottomNav />
          </div>
          {!isNoFooterPage && <Footer />}
        </>
      )}
      <style>{`
        @media (min-width: 769px) {
          .bottom-nav-wrapper { display: none; }
        }
      `}</style>
    </>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found page-enter">
      <div className="not-found-code">404</div>
      <div className="not-found-text">Oops, halaman tidak ditemukan</div>
      <Link to="/" className="not-found-btn">← Kembali ke Home</Link>
    </div>
  )
}

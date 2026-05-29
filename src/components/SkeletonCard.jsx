import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-text" style={{ marginTop: 12 }} />
      <div className="skeleton skeleton-text-short" />
      <div className="skeleton skeleton-text" style={{ marginBottom: 16 }} />
    </div>
  )
}

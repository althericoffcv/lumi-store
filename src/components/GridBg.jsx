import React from 'react'

export default function GridBg() {
  return (
    <>
      <div className="grid-bg" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--gl) 1px, transparent 1px), linear-gradient(90deg, var(--gl) 1px, transparent 1px)',
        backgroundSize: '44px 44px'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--gl2) 1px, transparent 1px), linear-gradient(90deg, var(--gl2) 1px, transparent 1px)',
          backgroundSize: '11px 11px'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 45% at 50% -5%, var(--glow) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 85% 110%, var(--glow2) 0%, transparent 50%)'
        }} />
      </div>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.012) 3px, rgba(0,0,0,.012) 4px)'
      }} />
    </>
  )
}

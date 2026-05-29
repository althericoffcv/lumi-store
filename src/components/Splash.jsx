import React, { useEffect, useState } from 'react'

export default function Splash({ onDone }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 5;
      setProgress(Math.min(t, 100))
      if (t >= 100) {
        clearInterval(interval)
        setTimeout(onDone, 800) // Wait for sp-out transition
      }
    }, 40) // total ~800ms
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div id="lumi-splash" className={progress === 100 ? 'sp-out' : ''}>
      <div className="sp-bg-glow" />
      <div className="sp-glass-panel">
        <div className="sp-logo-container">
          <div className="sp-ring sp-ring-1" />
          <div className="sp-ring sp-ring-2" />
          <div className="sp-logo-aesthetic">
            Lumi<br/><em>Store</em>
          </div>
        </div>
        <div className="sp-loading-text">
          <div className="sp-dot-pulse" style={{ opacity: progress === 100 ? 0 : 1 }} />
          <span>{progress === 100 ? 'Welcome to Lumi Store' : 'Curating aesthetic...'}</span>
        </div>
      </div>
    </div>
  )
}

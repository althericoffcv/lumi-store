import React, { useState, useEffect } from 'react'

const themes = [
  { key: 'pink', className: 'tdot-pink' },
  { key: 'dark', className: 'tdot-dark' },
]

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState('pink')

  useEffect(() => {
    const saved = localStorage.getItem('lumi-theme')
    if (saved) {
      document.documentElement.dataset.theme = saved
      setCurrent(saved)
    }
  }, [])

  const switchTheme = (theme) => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('lumi-theme', theme)
    setCurrent(theme)
  }

  return (
    <div className="theme-row" style={{ marginLeft: 8 }}>
      <span className="theme-label">Theme</span>
      <div className="theme-dots">
        {themes.map(t => (
          <div
            key={t.key}
            className={`tdot ${t.className}${current === t.key ? ' active' : ''}`}
            onClick={() => switchTheme(t.key)}
            title={t.key}
          />
        ))}
      </div>
    </div>
  )
}

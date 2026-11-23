import * as THREE from 'three'

// Generates procedural realistic lunar surface texture with maria, craters, and ray systems
export function createMoonTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = size
  bumpCanvas.height = size
  const bumpCtx = bumpCanvas.getContext('2d')!

  // Base lunar surface color: creamy pearl silver with warm undertone
  const baseGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size / 2)
  baseGrad.addColorStop(0, '#f7efe2')
  baseGrad.addColorStop(0.7, '#e8ded0')
  baseGrad.addColorStop(1, '#d5c8b5')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, size, size)

  bumpCtx.fillStyle = '#808080'
  bumpCtx.fillRect(0, 0, size, size)

  // Draw lunar maria (dark basaltic plains: Oceanus Procellarum, Mare Tranquillitatis, Mare Serenitatis, etc.)
  const maria = [
    { x: 380, y: 360, rx: 160, ry: 190, rot: 0.2, color: 'rgba(110, 95, 82, 0.45)' },
    { x: 580, y: 340, rx: 110, ry: 110, rot: -0.1, color: 'rgba(95, 80, 70, 0.42)' },
    { x: 680, y: 440, rx: 90, ry: 80, rot: 0.4, color: 'rgba(100, 85, 75, 0.4)' },
    { x: 420, y: 560, rx: 140, ry: 90, rot: -0.3, color: 'rgba(105, 90, 80, 0.38)' },
    { x: 280, y: 480, rx: 90, ry: 120, rot: 0.5, color: 'rgba(90, 78, 68, 0.45)' },
    { x: 500, y: 220, rx: 80, ry: 70, rot: 0.1, color: 'rgba(115, 100, 88, 0.35)' },
  ]

  maria.forEach((m) => {
    ctx.save()
    ctx.translate(m.x, m.y)
    ctx.rotate(m.rot)
    ctx.beginPath()
    ctx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2)
    ctx.fillStyle = m.color
    ctx.filter = 'blur(16px)'
    ctx.fill()
    ctx.restore()

    bumpCtx.save()
    bumpCtx.translate(m.x, m.y)
    bumpCtx.rotate(m.rot)
    bumpCtx.beginPath()
    bumpCtx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2)
    bumpCtx.fillStyle = 'rgba(60, 60, 60, 0.5)'
    bumpCtx.filter = 'blur(12px)'
    bumpCtx.fill()
    bumpCtx.restore()
  })

  // Draw prominent craters with bright rims, dark floor, and radiating rays (Tycho, Copernicus, Kepler)
  const craters = [
    { x: 500, y: 750, r: 24, rays: 16, rayLen: 220 }, // Tycho with extensive rays
    { x: 380, y: 420, r: 20, rays: 12, rayLen: 120 }, // Copernicus
    { x: 300, y: 400, r: 14, rays: 8, rayLen: 70 },   // Kepler
    { x: 620, y: 350, r: 16, rays: 0, rayLen: 0 },
    { x: 450, y: 300, r: 12, rays: 0, rayLen: 0 },
    { x: 560, y: 600, r: 18, rays: 6, rayLen: 60 },
    { x: 240, y: 320, r: 15, rays: 0, rayLen: 0 },
    { x: 680, y: 550, r: 13, rays: 0, rayLen: 0 },
    { x: 340, y: 680, r: 17, rays: 5, rayLen: 50 },
  ]

  craters.forEach((c) => {
    // Draw ejecta rays
    if (c.rays > 0 && c.rayLen > 0) {
      ctx.save()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.lineWidth = 1.5
      for (let i = 0; i < c.rays; i++) {
        const angle = (i / c.rays) * Math.PI * 2 + Math.random() * 0.2
        const len = c.rayLen * (0.7 + Math.random() * 0.6)
        ctx.beginPath()
        ctx.moveTo(c.x, c.y)
        ctx.lineTo(c.x + Math.cos(angle) * len, c.y + Math.sin(angle) * len)
        ctx.stroke()
      }
      ctx.restore()
    }

    // Crater rim (bright highlighted crest)
    ctx.beginPath()
    ctx.arc(c.x, c.y, c.r + 2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.fill()

    // Crater floor (dark depression)
    ctx.beginPath()
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(70, 60, 50, 0.45)'
    ctx.fill()

    // Central peak
    ctx.beginPath()
    ctx.arc(c.x, c.y, c.r * 0.25, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fill()

    // Bump map for craters
    bumpCtx.beginPath()
    bumpCtx.arc(c.x, c.y, c.r + 3, 0, Math.PI * 2)
    bumpCtx.fillStyle = '#ffffff'
    bumpCtx.fill()

    bumpCtx.beginPath()
    bumpCtx.arc(c.x, c.y, c.r - 1, 0, Math.PI * 2)
    bumpCtx.fillStyle = '#202020'
    bumpCtx.fill()
  })

  // Subtle noise / fine micro-craters
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * size
    const ry = Math.random() * size
    const rr = Math.random() * 3 + 1
    ctx.beginPath()
    ctx.arc(rx, ry, rr, 0, Math.PI * 2)
    ctx.fill()
  }

  const map = new THREE.CanvasTexture(canvas)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.ClampToEdgeWrapping
  map.needsUpdate = true

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = THREE.RepeatWrapping
  bumpMap.wrapT = THREE.ClampToEdgeWrapping
  bumpMap.needsUpdate = true

  return { map, bumpMap }
}

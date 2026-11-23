import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// High-res Dreamy Romantic Sky Dome with pastel gradient (Sky Blue -> Lavender -> Pastel Pink -> Peach -> Cream)
function createSkyGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Vertical sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1024)
  grad.addColorStop(0.0, '#B8DDF5') // Zenith: Sky Blue
  grad.addColorStop(0.28, '#C8B6F0') // Upper: Dreamy Lavender
  grad.addColorStop(0.55, '#F8B8CC') // Mid: Soft Pastel Pink
  grad.addColorStop(0.80, '#FFC9A8') // Lower: Sunset Peach
  grad.addColorStop(0.95, '#FFF4E8') // Horizon: Warm Cream
  grad.addColorStop(1.0, '#E989AC') // Ground blend: Rose

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 1024)

  // Add subtle horizontal atmospheric mist bands
  const mistBands = [
    { y: 620, h: 90, color: 'rgba(255, 244, 232, 0.35)' },
    { y: 780, h: 110, color: 'rgba(248, 184, 204, 0.4)' },
    { y: 900, h: 80, color: 'rgba(255, 201, 168, 0.45)' },
  ]

  mistBands.forEach((b) => {
    const mistGrad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
    mistGrad.addColorStop(0, 'rgba(255,255,255,0)')
    mistGrad.addColorStop(0.5, b.color)
    mistGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = mistGrad
    ctx.fillRect(0, b.y, 512, b.h)
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}

export default function DreamySkyDome() {
  const skyRef = useRef<THREE.Mesh>(null!)
  const skyTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createSkyGradientTexture()
    }
    return null
  }, [])

  useFrame((_state, delta) => {
    if (skyRef.current) {
      // Extremely gentle sky rotation to bring dynamic ambient life
      skyRef.current.rotation.y += delta * 0.003
    }
  })

  return (
    <mesh ref={skyRef} position={[0, 0, -130]}>
      {/* Large inverted sphere encapsulating the entire 3D world */}
      <sphereGeometry args={[360, 32, 32]} />
      <meshBasicMaterial
        map={skyTexture ?? undefined}
        color={skyTexture ? '#ffffff' : '#F8B8CC'}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

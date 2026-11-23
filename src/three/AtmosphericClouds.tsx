import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Generates a soft, billowy procedural cloud puff alpha texture
function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  grad.addColorStop(0.35, 'rgba(255, 244, 232, 0.75)') // Cream
  grad.addColorStop(0.65, 'rgba(255, 201, 168, 0.35)') // Peach
  grad.addColorStop(1, 'rgba(200, 182, 240, 0)') // Lavender falloff

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)

  // Add soft volumetric puff sub-circles
  const puffs = [
    { x: 90, y: 110, r: 60, a: 0.55 },
    { x: 160, y: 120, r: 65, a: 0.55 },
    { x: 130, y: 80, r: 55, a: 0.45 },
    { x: 115, y: 155, r: 50, a: 0.45 },
  ]

  puffs.forEach((p) => {
    const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
    pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.a})`)
    pGrad.addColorStop(0.5, 'rgba(248, 184, 204, 0.25)')
    pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = pGrad
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function AtmosphericClouds() {
  const groupRef = useRef<THREE.Group>(null!)
  const cloudTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createCloudTexture()
    }
    return null
  }, [])

  // Volumetric-looking cloud clusters in pastel fantasy sky
  const clouds = useMemo(() => {
    return [
      { pos: [-12, 7, -26] as const, scale: [16, 8, 1] as const, speed: 0.08, color: '#FFF4E8', opacity: 0.55 },
      { pos: [10, 10, -29] as const, scale: [18, 9, 1] as const, speed: 0.06, color: '#FFC9A8', opacity: 0.5 },
      { pos: [-5, 4, -22] as const, scale: [14, 7, 1] as const, speed: 0.11, color: '#F8B8CC', opacity: 0.45 },
      { pos: [14, 5, -25] as const, scale: [15, 8, 1] as const, speed: 0.09, color: '#C8B6F0', opacity: 0.42 },
      { pos: [-16, 12, -35] as const, scale: [22, 10, 1] as const, speed: 0.05, color: '#FFF4E8', opacity: 0.6 },
      { pos: [3, 8, -32] as const, scale: [16, 7.5, 1] as const, speed: 0.07, color: '#FFC9A8', opacity: 0.48 },
      { pos: [-8, 14, -40] as const, scale: [24, 11, 1] as const, speed: 0.04, color: '#B8DDF5', opacity: 0.4 },
      { pos: [15, 13, -38] as const, scale: [20, 9.5, 1] as const, speed: 0.05, color: '#C8B6F0', opacity: 0.5 },
      { pos: [-10, 8, -65] as const, scale: [22, 10, 1] as const, speed: 0.06, color: '#FFF4E8', opacity: 0.48 },
      { pos: [12, 9, -85] as const, scale: [20, 9, 1] as const, speed: 0.07, color: '#FFC9A8', opacity: 0.45 },
      { pos: [-14, 10, -115] as const, scale: [25, 11, 1] as const, speed: 0.05, color: '#F8B8CC', opacity: 0.52 },
      { pos: [10, 11, -165] as const, scale: [24, 10, 1] as const, speed: 0.06, color: '#FFF4E8', opacity: 0.5 },
      { pos: [-12, 12, -210] as const, scale: [26, 11, 1] as const, speed: 0.05, color: '#C8B6F0', opacity: 0.55 },
      { pos: [8, 14, -255] as const, scale: [28, 12, 1] as const, speed: 0.04, color: '#FFC9A8', opacity: 0.52 },
    ]
  }, [])

  const initialX = useMemo(() => clouds.map((c) => c.pos[0]), [clouds])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    // Smooth horizontal drift with periodic wrap-around
    groupRef.current.children.forEach((child, i) => {
      const c = clouds[i]
      if (c) {
        const offset = Math.sin(t * c.speed + i) * 3.5
        child.position.x = initialX[i] + offset
        // Subtle vertical breathing
        child.position.y = c.pos[1] + Math.cos(t * c.speed * 0.7 + i) * 0.4
      }
    })
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={cloudTexture ?? undefined}
            color={c.color}
            transparent
            opacity={c.opacity}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Helper to create a soft circular glow texture so particles are ethereal round orbs, not square pixels
export function createCircularParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  grad.addColorStop(0.3, 'rgba(255, 245, 235, 0.85)')
  grad.addColorStop(0.65, 'rgba(255, 220, 200, 0.35)')
  grad.addColorStop(1, 'rgba(255, 200, 220, 0.0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

interface ParticleSystemProps {
  count?: number
  color?: string
  size?: number
  area?: [number, number, number]
  speed?: number
  opacity?: number
}

export default function ParticleSystem({
  count = 200,
  color = '#F8B8CC',
  size = 0.12,
  area = [30, 30, 30],
  speed = 0.3,
  opacity = 0.65
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null!)

  const particleTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createCircularParticleTexture()
    }
    return null
  }, [])

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area[0]
      positions[i * 3 + 1] = (Math.random() - 0.5) * area[1]
      positions[i * 3 + 2] = (Math.random() - 0.5) * area[2]
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01 + 0.006
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    return { positions, velocities }
  }, [count, area])

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!pointsRef.current) return
    timeRef.current += delta * speed
    const t = timeRef.current
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += Math.sin(t + i) * 0.002
      posArr[i * 3 + 1] += velocities[i * 3 + 1] * 0.1
      posArr[i * 3 + 2] += Math.cos(t + i * 0.5) * 0.002
      // Reset particles that go too high
      if (posArr[i * 3 + 1] > area[1] / 2) {
        posArr[i * 3 + 1] = -area[1] / 2
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={particleTexture ?? undefined}
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

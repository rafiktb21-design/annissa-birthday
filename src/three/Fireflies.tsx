import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createCircularParticleTexture } from './ParticleSystem'

export default function Fireflies({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const circleTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createCircularParticleTexture()
    }
    return null
  }, [])

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36
      positions[i * 3 + 1] = Math.random() * 8 + 0.3
      positions[i * 3 + 2] = -(Math.random() * 200 + 10)
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, phases }
  }, [count])

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!pointsRef.current) return
    timeRef.current += delta
    const t = timeRef.current
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += Math.sin(t * 0.4 + phases[i]) * 0.006
      posArr[i * 3 + 1] += Math.cos(t * 0.3 + phases[i] * 1.5) * 0.004
      posArr[i * 3 + 2] += Math.sin(t * 0.35 + phases[i] * 0.7) * 0.005
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Pulse opacity smoothly
    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = 0.6 + Math.sin(t * 2.2) * 0.25
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={circleTexture ?? undefined}
        size={0.4}
        color="#F5D58A"
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

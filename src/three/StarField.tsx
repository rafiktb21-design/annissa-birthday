import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createCircularParticleTexture } from './ParticleSystem'

export default function StarField({ count = 800 }: { count?: number }) {
  const layer1Ref = useRef<THREE.Points>(null!)
  const layer2Ref = useRef<THREE.Points>(null!)
  const layer3Ref = useRef<THREE.Points>(null!)

  const circleTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createCircularParticleTexture()
    }
    return null
  }, [])

  // Layer 1: Bright close stardust
  const layer1 = useMemo(() => {
    const n = Math.floor(count * 0.4)
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90
      pos[i * 3 + 1] = Math.random() * 50 + 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90
    }
    return pos
  }, [count])

  // Layer 2: Medium distant fairy sparkles
  const layer2 = useMemo(() => {
    const n = Math.floor(count * 0.35)
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160
      pos[i * 3 + 1] = Math.random() * 70 + 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 160
    }
    return pos
  }, [count])

  // Layer 3: Faint celestial dust
  const layer3 = useMemo(() => {
    const n = Math.floor(count * 0.25)
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 220
      pos[i * 3 + 1] = Math.random() * 90 + 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 220
    }
    return pos
  }, [count])

  useFrame((_state, delta) => {
    if (layer1Ref.current) {
      layer1Ref.current.rotation.y += delta * 0.003
      layer1Ref.current.rotation.x += delta * 0.001
    }
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y += delta * 0.002
    }
    if (layer3Ref.current) {
      layer3Ref.current.rotation.y += delta * 0.001
    }
  })

  return (
    <group>
      {/* Layer 1: Warm golden stardust */}
      <points ref={layer1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layer1, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture ?? undefined}
          size={0.35}
          color="#F5D58A"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer 2: Pastel rose sparkles */}
      <points ref={layer2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layer2, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture ?? undefined}
          size={0.28}
          color="#F8B8CC"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer 3: Deep cream celestial dust */}
      <points ref={layer3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layer3, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture ?? undefined}
          size={0.22}
          color="#FFF4E8"
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createCircularParticleTexture } from './ParticleSystem'

interface ConstellationHeartProps {
  position?: [number, number, number]
  scale?: number
}

// 3D Parametric Heart Constellation with glowing nodes, connecting laser starlight lines, and orbiting stardust
export default function ConstellationHeart({
  position = [0, 5, -270],
  scale = 1.6,
}: ConstellationHeartProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const ringRef = useRef<THREE.Group>(null!)
  const pulseRef = useRef(0)

  // Parametric Heart 3D Points:
  // x = 16 * sin^3(t)
  // y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
  const { heartPoints, lineObj } = useMemo(() => {
    const total = 48
    const points: Array<[number, number, number]> = []
    const flatPoints: number[] = []

    for (let i = 0; i <= total; i++) {
      const t = (i / total) * Math.PI * 2
      const x = (16 * Math.pow(Math.sin(t), 3)) * 0.16
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.16
      const z = Math.sin(t * 3) * 0.35 // gentle 3D curve
      points.push([x, y, z])
      flatPoints.push(x, y, z)
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(flatPoints, 3))

    const lineMat = new THREE.LineBasicMaterial({
      color: '#E989AC',
      transparent: true,
      opacity: 0.8,
    })
    const lineObj = new THREE.Line(lineGeo, lineMat)

    return { heartPoints: points, lineObj }
  }, [])

  // Floating ambient stardust
  const stardust = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 2.5 + Math.random() * 3.5
      pos[i * 3] = Math.cos(angle) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4
      pos[i * 3 + 2] = Math.sin(angle) * r
    }
    return pos
  }, [])

  useFrame((_state, delta) => {
    pulseRef.current += delta
    const t = pulseRef.current

    if (groupRef.current) {
      // Heartbeat pulse: thump-thump rhythm
      const beat = Math.pow(Math.sin(t * 2.2), 63) * 0.08 + Math.pow(Math.sin(t * 2.2 + 0.35), 63) * 0.04
      const currentScale = scale * (1 + beat)
      groupRef.current.scale.set(currentScale, currentScale, currentScale)
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2
    }
  })

  const ringTexture = useMemo(() => {
    if (typeof document !== 'undefined') return createCircularParticleTexture()
    return null
  }, [])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 1. Luminous Constellation Lines connecting heart stars */}
      <primitive object={lineObj} />

      {/* 2. Constellation Star Nodes */}
      {heartPoints.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#F5D58A' : '#E989AC'}
          />
        </mesh>
      ))}

      {/* 3. Central Heart Core Glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshBasicMaterial
          color="#F8B8CC"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshBasicMaterial
          color="#FFC9A8"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Orbiting Stardust Celestial Ring */}
      <group ref={ringRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stardust, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={ringTexture ?? undefined}
            size={0.25}
            color="#FFF4E8"
            transparent
            opacity={0.85}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* 5. Heart light source */}
      <pointLight intensity={2.8} color="#E989AC" distance={30} decay={2} />
      <pointLight intensity={2.0} color="#F5D58A" distance={22} decay={2} />
    </group>
  )
}

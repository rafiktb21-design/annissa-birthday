import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LanternProps {
  position: [number, number, number]
  scale?: number
}

// Ornate fairytale garden lantern with warm candlelight in soft gold
export function StoneLantern({ position, scale = 1 }: LanternProps) {
  const lightRef = useRef<THREE.PointLight>(null!)
  const fireRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(Math.random() * 10)

  useFrame((_state, delta) => {
    timeRef.current += delta
    const flicker = Math.sin(timeRef.current * 8) * 0.12 + Math.sin(timeRef.current * 19) * 0.08
    if (lightRef.current) {
      lightRef.current.intensity = 1.1 + flicker
    }
    if (fireRef.current) {
      fireRef.current.scale.set(1 + flicker * 0.2, 1 + flicker * 0.35, 1 + flicker * 0.2)
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Lantern Base pedestal (Warm Cream / Soft Stone #FFF4E8 / #E8D4B6) */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.3, 0.55]} />
        <meshStandardMaterial color="#E8D4B6" roughness={0.75} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.65, 8]} />
        <meshStandardMaterial color="#FFF4E8" roughness={0.8} />
      </mesh>
      {/* Light Chamber Floor */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.12, 0.6]} />
        <meshStandardMaterial color="#E8D4B6" roughness={0.7} />
      </mesh>

      {/* Brass Lattice Pillars */}
      {[-0.22, 0.22].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.25, z]}>
            <cylinderGeometry args={[0.025, 0.025, 0.52, 6]} />
            <meshStandardMaterial color="#F5D58A" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Candle flame core */}
      <mesh ref={fireRef} position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#F5D58A" />
      </mesh>

      {/* Warm Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, 1.3, 0]}
        intensity={1.2}
        color="#F5D58A"
        distance={8.5}
        decay={2}
      />

      {/* Lantern Pagoda Roof with gentle upturned flair (Antique Rose Gold) */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[0.55, 0.25, 4]} rotation-y={Math.PI / 4} />
        <meshStandardMaterial color="#E989AC" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Top ornamental finial */}
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#F5D58A" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// Fairytale romantic garden pathway with warm stone lanterns
export function LuminescentPath() {
  const lanterns = [
    // Flanking the path naturally
    { pos: [-2.4, 0, -18] as const },
    { pos: [2.4, 0, -28] as const },
    { pos: [-2.5, 0, -42] as const },
    { pos: [2.5, 0, -56] as const },
    { pos: [-2.4, 0, -70] as const },
    { pos: [2.5, 0, -84] as const },
    { pos: [-2.4, 0, -98] as const },
    { pos: [2.5, 0, -112] as const },
  ]

  return (
    <group>
      {/* Stone Lanterns naturally guiding the path without any jarring rectangular planes */}
      {lanterns.map((l, i) => (
        <StoneLantern key={i} position={[l.pos[0], l.pos[1], l.pos[2]]} scale={0.85} />
      ))}
    </group>
  )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MoonProps {
  position?: [number, number, number]
  radius?: number
}

export default function RealisticMoon({
  position = [6, 9, -32],
  radius = 4.2,
}: MoonProps) {
  const moonRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Mesh>(null!)

  useFrame((_state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.015
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z += delta * 0.008
    }
  })

  return (
    <group position={position}>
      {/* 1. Fairytale Moon Core with Warm Cream & Soft Gold tones */}
      <mesh ref={moonRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color="#FFF4E8"
          roughness={0.65}
          metalness={0.05}
          emissive="#F5D58A"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 2. Soft Golden Corona Glow Layer */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#F5D58A"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Outer Pastel Rose / Lavender Atmosphere Halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.38, 32, 32]} />
        <meshBasicMaterial
          color="#F8B8CC"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Moon Light Source casting soft warm ambient on the scene */}
      <pointLight
        color="#FFF4E8"
        intensity={1.8}
        distance={70}
        decay={2}
      />
    </group>
  )
}

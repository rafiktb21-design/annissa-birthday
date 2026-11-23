import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ButterflyProps {
  initialPos: [number, number, number]
  radius: number
  speed: number
  height: number
  color: string
  phase: number
}

function SingleButterfly({ initialPos, radius, speed, height, color, phase }: ButterflyProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const leftWingRef = useRef<THREE.Mesh>(null!)
  const rightWingRef = useRef<THREE.Mesh>(null!)

  // Wing geometry: elegant teardrop butterfly wing
  const wingGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.18, 0.35, 0.32, 0.5)
    shape.quadraticCurveTo(0.45, 0.6, 0.52, 0.42)
    shape.quadraticCurveTo(0.55, 0.22, 0.38, 0.05)
    shape.quadraticCurveTo(0.2, -0.12, 0, 0)
    return new THREE.ShapeGeometry(shape, 8)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase

    if (groupRef.current) {
      // Smooth 3D figure-8 / elliptical flight path
      const x = initialPos[0] + Math.sin(t) * radius
      const y = initialPos[1] + Math.sin(t * 2) * (height * 0.4) + Math.cos(t * 0.8) * 0.2
      const z = initialPos[2] + Math.cos(t) * (radius * 0.7)
      groupRef.current.position.set(x, y, z)

      // Heading orientation towards flight direction
      const dx = Math.cos(t) * radius
      const dz = -Math.sin(t) * (radius * 0.7)
      const angle = Math.atan2(dx, dz)
      groupRef.current.rotation.y = angle + Math.PI / 2
      groupRef.current.rotation.z = Math.sin(t * 3) * 0.12 // natural banking tilt
    }

    // High frequency wing flap (18 Hz)
    const flap = Math.sin(clock.getElapsedTime() * 18 + phase) * 0.75 + 0.1
    if (leftWingRef.current) leftWingRef.current.rotation.y = flap
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flap
  })

  return (
    <group ref={groupRef} position={initialPos} scale={0.38}>
      {/* Butterfly body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
        <meshStandardMaterial color="#49352F" roughness={0.5} />
      </mesh>

      {/* Left Wing */}
      <mesh ref={leftWingRef} geometry={wingGeo} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Right Wing (Mirrored) */}
      <mesh ref={rightWingRef} geometry={wingGeo} position={[0, 0, 0]} scale={[-1, 1, 1]}>
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Gentle magical light aura */}
      <pointLight intensity={0.4} distance={2.0} color={color} />
    </group>
  )
}

export default function Butterflies({ local = true }: { local?: boolean }) {
  const butterflyData: ButterflyProps[] = useMemo(() => {
    const colors = ['#F8B8CC', '#FFD1BA', '#E8B6C1', '#F5D5A8', '#FFB7C5']

    if (local) {
      // Localized flight paths near the camera in Section 2
      return [
        { initialPos: [-1.4, 0.6, 0.5], radius: 1.2, speed: 0.85, height: 0.7, color: colors[0], phase: 0 },
        { initialPos: [1.6, 0.8, -0.4], radius: 1.4, speed: 0.72, height: 0.8, color: colors[1], phase: 1.8 },
        { initialPos: [-0.6, 1.2, -1.0], radius: 1.1, speed: 0.9, height: 0.6, color: colors[2], phase: 3.2 },
        { initialPos: [0.8, -0.2, 0.8], radius: 1.0, speed: 0.78, height: 0.5, color: colors[3], phase: 4.5 },
      ]
    }

    return [
      { initialPos: [-2.5, 2.8, -12], radius: 2.2, speed: 0.85, height: 1.2, color: colors[0], phase: 0 },
      { initialPos: [2.8, 3.2, -18], radius: 2.6, speed: 0.72, height: 1.4, color: colors[1], phase: 1.5 },
      { initialPos: [-3.5, 2.5, -45], radius: 3.0, speed: 0.9, height: 1.5, color: colors[2], phase: 0.8 },
      { initialPos: [3.2, 2.7, -60], radius: 2.8, speed: 0.8, height: 1.3, color: colors[3], phase: 2.2 },
    ]
  }, [local])

  return (
    <group>
      {butterflyData.map((b, i) => (
        <SingleButterfly key={i} {...b} />
      ))}
    </group>
  )
}

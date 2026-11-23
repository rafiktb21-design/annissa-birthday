import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SakuraTreeProps {
  position: [number, number, number]
  scale?: number
  rotationY?: number
  windPhase?: number
}

// Procedural high-detail botanical cherry blossom tree with gnarled trunk, branching boughs, and dense petal clusters
export default function BotanicalSakuraTree({
  position,
  scale = 1,
  rotationY = 0,
  windPhase = 0,
}: SakuraTreeProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const foliageRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  // Generate realistic blossom cluster positions around branches
  const blossomClusters = useMemo(() => {
    const clusters: Array<{
      pos: [number, number, number]
      size: [number, number, number]
      color: string
      emissive: string
      rot: [number, number, number]
    }> = []

    const palettes = [
      { color: '#F8B8CC', emissive: '#E989AC' }, // Pastel Pink
      { color: '#FFC9A8', emissive: '#F5D58A' }, // Peach
      { color: '#E989AC', emissive: '#F8B8CC' }, // Rose
      { color: '#FFF4E8', emissive: '#FFC9A8' }, // Cream
      { color: '#C8B6F0', emissive: '#A77BAA' }, // Lavender
    ]

    // Main canopy crown (multiple overlapping organic volumes)
    const crownCenters = [
      [0, 5.8, 0],
      [-1.6, 5.4, 0.8],
      [1.8, 5.2, -0.6],
      [0.6, 6.2, 1.2],
      [-1.2, 6.0, -1.2],
      [1.4, 5.6, 1.4],
      [-0.5, 4.6, 1.8],
      [1.9, 4.7, 0.4],
      [-2.1, 4.5, -0.7],
      [0.2, 4.2, -1.8],
      [-1.0, 3.8, 1.4],
      [1.2, 3.9, -1.2],
    ]

    crownCenters.forEach(([cx, cy, cz], idx) => {
      // Create a main blossom cloud
      const pal = palettes[idx % palettes.length]
      clusters.push({
        pos: [cx, cy, cz],
        size: [1.3 + Math.sin(idx) * 0.3, 1.1 + Math.cos(idx) * 0.25, 1.3 + Math.cos(idx * 2) * 0.3],
        color: pal.color,
        emissive: pal.emissive,
        rot: [Math.sin(idx) * 0.4, Math.cos(idx) * 0.8, Math.sin(idx * 3) * 0.3],
      })

      // Add 2-3 satellite petal tufts for organic fluffiness
      for (let s = 0; s < 3; s++) {
        const angle = (s / 3) * Math.PI * 2 + idx
        const dist = 0.85
        const spal = palettes[(idx + s + 1) % palettes.length]
        clusters.push({
          pos: [
            cx + Math.cos(angle) * dist,
            cy + (Math.sin(angle * 2) * 0.4 - 0.2),
            cz + Math.sin(angle) * dist,
          ],
          size: [0.75, 0.65, 0.75],
          color: spal.color,
          emissive: spal.emissive,
          rot: [Math.random() * 0.5, Math.random() * Math.PI, 0],
        })
      }
    })

    return clusters
  }, [])

  useFrame((_state, delta) => {
    timeRef.current += delta
    const t = timeRef.current + windPhase
    if (groupRef.current) {
      // Gentle trunk sway
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.015
    }
    if (foliageRef.current) {
      // Gentle canopy breathing in the breeze
      foliageRef.current.rotation.y = Math.sin(t * 0.3) * 0.02
      foliageRef.current.rotation.x = Math.cos(t * 0.35) * 0.015
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale} rotation-y={rotationY}>
      {/* 1. Gnarled organic tree trunk with root flare */}
      {/* Root base */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.38, 0.75, 0.6, 10]} />
        <meshStandardMaterial color="#352014" roughness={0.92} />
      </mesh>
      {/* Lower trunk */}
      <mesh position={[0, 1.2, 0]} rotation-z={0.06}>
        <cylinderGeometry args={[0.28, 0.38, 1.4, 9]} />
        <meshStandardMaterial color="#3d2517" roughness={0.92} />
      </mesh>
      {/* Mid trunk curving slightly */}
      <mesh position={[0.1, 2.3, 0.05]} rotation-z={-0.12} rotation-x={0.06}>
        <cylinderGeometry args={[0.22, 0.28, 1.2, 9]} />
        <meshStandardMaterial color="#42291a" roughness={0.92} />
      </mesh>
      {/* Trunk fork */}
      <mesh position={[0.05, 3.2, 0.02]} rotation-z={0.05}>
        <cylinderGeometry args={[0.2, 0.22, 0.9, 8]} />
        <meshStandardMaterial color="#42291a" roughness={0.92} />
      </mesh>

      {/* 2. Main structural branches */}
      {/* Branch 1 - Main Left */}
      <group position={[-0.1, 3.4, 0]}>
        <mesh position={[-0.9, 0.6, 0.4]} rotation-z={0.7} rotation-y={0.3}>
          <cylinderGeometry args={[0.1, 0.16, 2.2, 7]} />
          <meshStandardMaterial color="#3d2517" roughness={0.92} />
        </mesh>
        {/* Left sub-branch */}
        <mesh position={[-1.7, 1.4, 0.7]} rotation-z={0.4} rotation-x={-0.3}>
          <cylinderGeometry args={[0.05, 0.1, 1.6, 6]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.92} />
        </mesh>
      </group>

      {/* Branch 2 - Main Right */}
      <group position={[0.15, 3.3, 0]}>
        <mesh position={[1.0, 0.7, -0.3]} rotation-z={-0.65} rotation-y={-0.4}>
          <cylinderGeometry args={[0.09, 0.15, 2.4, 7]} />
          <meshStandardMaterial color="#3d2517" roughness={0.92} />
        </mesh>
        {/* Right sub-branch */}
        <mesh position={[1.8, 1.5, -0.5]} rotation-z={-0.35} rotation-x={0.2}>
          <cylinderGeometry args={[0.05, 0.09, 1.5, 6]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.92} />
        </mesh>
      </group>

      {/* Branch 3 - Front Reaching */}
      <mesh position={[0.2, 3.8, 0.9]} rotation-x={-0.65} rotation-z={0.2}>
        <cylinderGeometry args={[0.07, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#3d2517" roughness={0.92} />
      </mesh>

      {/* Branch 4 - Back Upward */}
      <mesh position={[-0.2, 4.0, -0.8]} rotation-x={0.55} rotation-z={-0.15}>
        <cylinderGeometry args={[0.06, 0.11, 2.0, 6]} />
        <meshStandardMaterial color="#3d2517" roughness={0.92} />
      </mesh>

      {/* 3. Dense, Lush Blossom Clusters */}
      <group ref={foliageRef}>
        {blossomClusters.map((cluster, i) => (
          <mesh
            key={i}
            position={cluster.pos}
            rotation={cluster.rot}
            scale={cluster.size}
            castShadow
          >
            {/* 16-sided faceted sphere creates natural floral petal clumping */}
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color={cluster.color}
              emissive={cluster.emissive}
              emissiveIntensity={0.22}
              roughness={0.65}
              metalness={0.02}
              transparent
              opacity={0.94}
            />
          </mesh>
        ))}
      </group>

      {/* Soft inner ambient lantern glow on the blossoms */}
      <pointLight position={[0, 4.8, 0]} intensity={0.65} color="#ff85a2" distance={9} />
    </group>
  )
}

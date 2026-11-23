import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

interface GardenArchesProps {
  positions?: Array<[number, number, number]>
}

// Classical romantic floral garden archways draped in ivy and blooming roses
export default function GardenArches({
  positions = [
    [0, 0, -22],   // Entrance to Walk
    [0, 0, -48],   // Entrance to Birthday Celebration
    [0, 0, -98],   // Entrance to Memories
    [0, 0, -158],  // Entrance to Love Letter
    [0, 0, -218],  // Entrance to Final Surprise
  ],
}: GardenArchesProps) {
  // CC0 Wood Texture
  const [woodDiff, woodNor, woodRough] = useTexture([
    '/assets/textures/wood/diffuse.jpg',
    '/assets/textures/wood/normal.jpg',
    '/assets/textures/wood/roughness.jpg',
  ])

  useEffect(() => {
    if (woodDiff && woodNor && woodRough) {
      ;[woodDiff, woodNor, woodRough].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(1, 4)
        t.needsUpdate = true
      })
    }
  }, [woodDiff, woodNor, woodRough])

  // Arch frame geometry (curved half-torus + vertical posts)
  const roseColors = ['#F8B8CC', '#E989AC', '#FFF4E8', '#FFC9A8', '#F5D58A']

  // Procedural rose cluster coordinates along the arch perimeter
  const rosesOnArch = useMemo(() => {
    const list: Array<{
      pos: [number, number, number]
      color: string
      scale: number
    }> = []

    // Along left pillar
    for (let y = 0.8; y <= 3.2; y += 0.55) {
      list.push({
        pos: [-2.15 + (Math.random() - 0.5) * 0.15, y, (Math.random() - 0.5) * 0.2],
        color: roseColors[Math.floor(Math.random() * roseColors.length)],
        scale: 0.16 + Math.random() * 0.08,
      })
    }
    // Along right pillar
    for (let y = 0.8; y <= 3.2; y += 0.55) {
      list.push({
        pos: [2.15 + (Math.random() - 0.5) * 0.15, y, (Math.random() - 0.5) * 0.2],
        color: roseColors[Math.floor(Math.random() * roseColors.length)],
        scale: 0.16 + Math.random() * 0.08,
      })
    }
    // Over the arch curve
    for (let a = 0; a <= Math.PI; a += Math.PI / 10) {
      const r = 2.15
      const x = -Math.cos(a) * r
      const y = 3.2 + Math.sin(a) * 1.5
      list.push({
        pos: [x + (Math.random() - 0.5) * 0.15, y, (Math.random() - 0.5) * 0.2],
        color: roseColors[Math.floor(Math.random() * roseColors.length)],
        scale: 0.18 + Math.random() * 0.08,
      })
    }

    return list
  }, [])

  return (
    <group>
      {positions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Left Vertical Pillar */}
          <mesh position={[-2.15, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.075, 3.2, 8]} />
            <meshStandardMaterial
              map={woodDiff}
              normalMap={woodNor}
              roughnessMap={woodRough}
              color="#E8D4B6"
              roughness={0.7}
              metalness={0.15}
            />
          </mesh>

          {/* Right Vertical Pillar */}
          <mesh position={[2.15, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.075, 3.2, 8]} />
            <meshStandardMaterial
              map={woodDiff}
              normalMap={woodNor}
              roughnessMap={woodRough}
              color="#E8D4B6"
              roughness={0.7}
              metalness={0.15}
            />
          </mesh>

          {/* Curved Semi-Circle Arch Top */}
          <mesh position={[0, 3.2, 0]} rotation-z={Math.PI / 2} castShadow>
            <torusGeometry args={[2.15, 0.06, 12, 32, Math.PI]} />
            <meshStandardMaterial
              map={woodDiff}
              normalMap={woodNor}
              roughnessMap={woodRough}
              color="#E8D4B6"
              roughness={0.7}
              metalness={0.15}
            />
          </mesh>

          {/* Secondary Filigree Decorative Ring */}
          <mesh position={[0, 3.35, 0]} rotation-z={Math.PI / 2}>
            <torusGeometry args={[1.95, 0.035, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#F5D58A" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Climbing Ivy Foliage Puffs */}
          {rosesOnArch.map((rose, rIdx) => (
            <group key={rIdx} position={rose.pos}>
              {/* Green leaf cluster behind rose */}
              <mesh scale={[rose.scale * 1.4, rose.scale * 1.4, rose.scale * 1.4]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#5B7E58" roughness={0.8} />
              </mesh>
              {/* Blooming Rose Blossom */}
              <mesh position={[0, 0, 0.05]} scale={[rose.scale, rose.scale, rose.scale]}>
                <dodecahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                  color={rose.color}
                  roughness={0.45}
                  emissive={rose.color}
                  emissiveIntensity={0.15}
                />
              </mesh>
            </group>
          ))}

          {/* Soft Lantern Glow under Arch Keystone */}
          <pointLight position={[0, 4.4, 0]} intensity={0.9} color="#FFF4E8" distance={7} />
        </group>
      ))}
    </group>
  )
}

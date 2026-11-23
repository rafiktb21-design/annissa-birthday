import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { websiteConfig } from '../data/websiteConfig'
import type { MemoryItem } from '../data/websiteConfig'
import { audio } from '../utils/audio'

interface SinglePolaroidProps {
  memory: MemoryItem
  index: number
  onSelect: (item: MemoryItem) => void
  selected: boolean
}

function SinglePolaroid({ memory, index, onSelect, selected }: SinglePolaroidProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const timeRef = useRef(0)

  // Floating phase & natural tilt
  const { basePos, baseRot, floatSpeed, swayPhase } = useMemo(() => {
    // Semi-circle curved gallery layout around z = -125
    const total = websiteConfig.memories.length
    const angle = ((index - (total - 1) / 2) / (total - 1)) * 1.5 // -0.75 to +0.75 rad
    const radius = 9.5
    const x = Math.sin(angle) * radius
    const z = -125 - Math.cos(angle) * (radius - 5.5) + (index % 2 === 0 ? 0.6 : -0.6)
    const y = 1.6 + (index % 2 === 0 ? 0.35 : -0.35)

    const rotY = -angle * 0.75
    const rotZ = (Math.sin(index * 2.3) * 0.08)

    return {
      basePos: [x, y, z] as [number, number, number],
      baseRot: [0, rotY, rotZ] as [number, number, number],
      floatSpeed: 0.6 + (index % 3) * 0.15,
      swayPhase: index * 1.2,
    }
  }, [index])

  // Load the SVG texture for this memory card
  const texture = useTexture(memory.image)
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
    }
  }, [texture])

  useFrame((_state, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta

    const t = timeRef.current * floatSpeed + swayPhase

    if (!selected) {
      // Gentle floating bob
      const targetY = basePos[1] + Math.sin(t) * 0.12
      const targetRotZ = baseRot[2] + Math.cos(t * 0.8) * 0.02
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08)
    }
  })

  return (
    <group
      ref={groupRef}
      position={basePos}
      rotation={baseRot}
      onClick={(e) => {
        e.stopPropagation()
        audio.playPhotoClick()
        onSelect(memory)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Golden hanging clip at the top */}
      <mesh position={[0, 1.7, 0.02]}>
        <boxGeometry args={[0.35, 0.18, 0.08]} />
        <meshStandardMaterial color="#F5D58A" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Golden pin ring */}
      <mesh position={[0, 1.82, 0.02]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#F5D58A" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Main Polaroid Frame (realistic Warm Cream cardstock #FFF4E8) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.2, 0.04]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : '#FFF4E8'}
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>

      {/* Natural paper drop shadow behind Polaroid */}
      <mesh position={[0.05, -0.05, -0.025]}>
        <boxGeometry args={[2.52, 3.22, 0.01]} />
        <meshBasicMaterial color="#E8D4B6" transparent opacity={0.4} />
      </mesh>

      {/* Photo area with texture */}
      <mesh position={[0, 0.28, 0.025]}>
        <planeGeometry args={[2.2, 2.3]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.38}
          metalness={0.04}
        />
      </mesh>

      {/* Polaroid bottom caption area */}
      <mesh position={[0, -1.2, 0.025]}>
        <planeGeometry args={[2.1, 0.45]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.0} />
      </mesh>

      {/* Hover Pastel Pink Halo Glow */}
      {hovered && (
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[2.8, 3.5, 0.01]} />
          <meshBasicMaterial
            color="#F8B8CC"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

interface PolaroidGalleryProps {
  onSelectMemory: (item: MemoryItem | null) => void
  selectedMemory: MemoryItem | null
}

export default function PolaroidGallery({ onSelectMemory, selectedMemory }: PolaroidGalleryProps) {
  return (
    <group>
      {websiteConfig.memories.map((memory, i) => (
        <SinglePolaroid
          key={memory.id}
          memory={memory}
          index={i}
          onSelect={onSelectMemory}
          selected={selectedMemory?.id === memory.id}
        />
      ))}

      {/* Floating gallery stardust particles */}
      <pointLight position={[0, 4, -125]} intensity={1.2} color="#ffeedd" distance={15} />
      <pointLight position={[-4, 2, -120]} intensity={0.6} color="#ffb7c5" distance={12} />
      <pointLight position={[4, 2, -120]} intensity={0.6} color="#c8b6ff" distance={12} />
    </group>
  )
}

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleSystem from '../three/ParticleSystem'
import { websiteConfig } from '../data/websiteConfig'

function PolaroidFrame({ index, onSelect, selected }: {
  index: number
  onSelect: (i: number | null) => void
  selected: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  const basePosition = useMemo((): [number, number, number] => {
    const col = index % 3
    const row = Math.floor(index / 3)
    return [(col - 1) * 4.5, -row * 4.5 + 2, 0]
  }, [index])

  const gradients = ['#ff69b4', '#d4a574', '#b76e79', '#c77dff', '#f4c2c2']

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta
    const t = timeRef.current
    if (selected) {
      groupRef.current.position.lerp(new THREE.Vector3(0, 0, 6), 0.05)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05)
      groupRef.current.scale.lerp(new THREE.Vector3(1.8, 1.8, 1.8), 0.05)
    } else {
      const target = new THREE.Vector3(...basePosition)
      target.y += Math.sin(t * 0.4 + phase) * 0.3
      groupRef.current.position.lerp(target, 0.05)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(t * 0.2 + phase) * 0.08,
        0.05
      )
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05)
    }
  })

  return (
    <Float speed={selected ? 0 : 0.8} rotationIntensity={selected ? 0 : 0.1} floatIntensity={selected ? 0 : 0.2}>
      <group
        ref={groupRef}
        position={basePosition}
        onClick={(e) => { e.stopPropagation(); onSelect(selected ? null : index) }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        {/* Polaroid white frame */}
        <mesh>
          <boxGeometry args={[3, 3.8, 0.06]} />
          <meshStandardMaterial color="#fefefe" roughness={0.3} />
        </mesh>

        {/* Photo area - gradient placeholder */}
        <mesh position={[0, 0.3, 0.035]}>
          <planeGeometry args={[2.6, 2.4]} />
          <meshStandardMaterial 
            color={gradients[index % gradients.length]} 
            emissive={gradients[index % gradients.length]} 
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Heart icon in center of photo */}
        <mesh position={[0, 0.5, 0.04]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>

        {/* Hover glow */}
        {(hovered || selected) && (
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[3.3, 4.1, 0.01]} />
            <meshBasicMaterial color="#ff69b4" transparent opacity={0.2} />
          </mesh>
        )}
      </group>
    </Float>
  )
}

export function SceneContent({ visible }: { visible: boolean }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!visible) return null

  return (
    <group>
      {websiteConfig.memories.map((_, i) => (
        <PolaroidFrame
          key={i}
          index={i}
          onSelect={setSelectedIndex}
          selected={selectedIndex === i}
        />
      ))}

      <ParticleSystem count={120} color="#ff69b4" size={0.05} area={[25, 20, 15]} speed={0.15} opacity={0.35} />
      <ParticleSystem count={60} color="#d4a574" size={0.03} area={[20, 15, 10]} speed={0.1} opacity={0.25} />

      {selectedIndex !== null && (
        <mesh position={[0, 0, -5]} onClick={() => setSelectedIndex(null)}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 8, 8]} intensity={1.2} color="#ffecd2" distance={30} />
      <pointLight position={[-5, 3, 3]} intensity={0.5} color="#ff69b4" distance={20} />
      <pointLight position={[5, 3, 3]} intensity={0.5} color="#d4a574" distance={20} />
    </group>
  )
}

export function Overlay({ visible, progress }: { visible: boolean; progress: number }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!visible) return null

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Title */}
      <div className={`absolute top-12 left-0 right-0 text-center transition-all duration-1000 ${progress > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="font-vibes text-3xl md:text-4xl text-magic-pink mb-2">Our Little</p>
        <h2 className="font-playfair text-4xl md:text-6xl text-white font-bold">Memories</h2>
        <p className="font-poppins text-white/40 text-sm mt-3">Click a photo to see the memory</p>
      </div>

      {/* Caption overlay when photo selected */}
      {selectedIndex !== null && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4 mx-4 max-w-md text-center">
            <p className="font-cormorant text-xl text-white italic">
              {websiteConfig.memories[selectedIndex]?.caption}
            </p>
            <button
              onClick={() => setSelectedIndex(null)}
              className="mt-3 text-white/50 text-sm hover:text-white transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleSystem from '../three/ParticleSystem'
import { websiteConfig } from '../data/websiteConfig'

function ProceduralEnvelope({ onOpen, isOpen }: { onOpen: () => void; isOpen: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const flapRef = useRef<THREE.Mesh>(null!)
  const letterRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (flapRef.current) {
      const targetRotation = isOpen ? -Math.PI * 0.8 : 0
      flapRef.current.rotation.x = THREE.MathUtils.lerp(flapRef.current.rotation.x, targetRotation, 0.03)
    }
    if (letterRef.current) {
      const targetY = isOpen ? 1.5 : 0
      letterRef.current.position.y = THREE.MathUtils.lerp(letterRef.current.position.y, targetY, 0.03)
    }
  })

  // Envelope flap shape (triangle)
  const flapShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1.5, 0)
    shape.lineTo(0, -1)
    shape.lineTo(1.5, 0)
    shape.lineTo(-1.5, 0)
    return new THREE.ShapeGeometry(shape)
  }, [])

  return (
    <Float speed={1} rotationIntensity={isOpen ? 0 : 0.15} floatIntensity={isOpen ? 0.1 : 0.4}>
      <group
        ref={groupRef}
        onClick={(e) => { e.stopPropagation(); if (!isOpen) onOpen() }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        {/* Envelope body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#f5e6d3" roughness={0.6} />
        </mesh>

        {/* Envelope front decoration - a heart seal */}
        <mesh position={[0, 0, 0.06]}>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial color="#b76e79" emissive="#b76e79" emissiveIntensity={hovered ? 0.5 : 0.2} />
        </mesh>

        {/* Envelope flap - hinges at top edge */}
        <group position={[0, 1, 0]}>
          <mesh ref={flapRef} geometry={flapShape} rotation-x={0}>
            <meshStandardMaterial color="#eddcc7" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Letter paper that slides out */}
        <mesh ref={letterRef} position={[0, 0, 0.05]}>
          <boxGeometry args={[2.6, 1.8, 0.02]} />
          <meshStandardMaterial color="#fffef5" roughness={0.4} />
        </mesh>

        {/* Glow effect when hovered */}
        {hovered && !isOpen && (
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[3.4, 2.4, 0.01]} />
            <meshBasicMaterial color="#ff69b4" transparent opacity={0.15} />
          </mesh>
        )}
      </group>
    </Float>
  )
}

// Rose petals floating around
function RosePetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 100

  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        Math.random() * 20,
        (Math.random() - 0.5) * 25
      ),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      speed: Math.random() * 0.3 + 0.1,
      rotSpeed: (Math.random() - 0.5) * 2,
      phase: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.4 + 0.2
    }))
  }, [])

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta
    const t = timeRef.current
    petals.forEach((p, i) => {
      p.pos.y -= p.speed * 0.015
      p.pos.x += Math.sin(t * 0.3 + p.phase) * 0.008
      p.rot.x += p.rotSpeed * 0.004
      p.rot.z += p.rotSpeed * 0.003
      if (p.pos.y < -5) { p.pos.y = 15; p.pos.x = (Math.random() - 0.5) * 25 }
      dummy.position.copy(p.pos)
      dummy.rotation.copy(p.rot)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const geo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.15, 0.15, 0.2, 0.4, 0, 0.6)
    shape.bezierCurveTo(-0.2, 0.4, -0.15, 0.15, 0, 0)
    const g = new THREE.ShapeGeometry(shape)
    g.scale(0.5, 0.5, 0.5)
    return g
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, count]}>
      <meshStandardMaterial color="#e8475f" transparent opacity={0.8} side={THREE.DoubleSide} emissive="#ff2244" emissiveIntensity={0.1} />
    </instancedMesh>
  )
}

export function SceneContent({ visible }: { visible: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!visible) return null

  return (
    <group>
      <ProceduralEnvelope onOpen={() => setIsOpen(true)} isOpen={isOpen} />
      <RosePetals />
      <ParticleSystem count={80} color="#d4a574" size={0.06} area={[20, 15, 20]} speed={0.2} opacity={0.4} />

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1.2} color="#ffecd2" distance={25} />
      <pointLight position={[-3, 3, 2]} intensity={0.6} color="#ff69b4" distance={15} />
      <pointLight position={[3, 3, -2]} intensity={0.5} color="#d4a574" distance={15} />
    </group>
  )
}

export function Overlay({ visible, progress }: { visible: boolean; progress: number }) {
  const [letterOpen, setLetterOpen] = useState(false)

  if (!visible) return null

  const { loveLetter } = websiteConfig

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Title */}
      <div className={`absolute top-16 left-0 right-0 text-center transition-all duration-1000 ${progress > 0.1 && !letterOpen ? 'opacity-100' : 'opacity-0'}`}>
        <p className="font-vibes text-3xl md:text-4xl text-magic-pink mb-2">A Letter</p>
        <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold">From My Heart</h2>
        <p className="font-poppins text-white/50 text-sm mt-4">Click the envelope to read</p>
      </div>

      {/* Open letter button for overlay */}
      {!letterOpen && progress > 0.3 && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-auto">
          <button
            onClick={() => setLetterOpen(true)}
            className="px-6 py-3 font-poppins text-sm tracking-wider uppercase text-white border border-rose-gold/50 rounded-full hover:bg-rose-gold/20 transition-all duration-300"
          >
            Read My Letter
          </button>
        </div>
      )}

      {/* Letter overlay */}
      {letterOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setLetterOpen(false)}>
          <div
            className="max-w-lg mx-4 p-8 md:p-12 rounded-2xl relative max-h-[80vh] overflow-y-auto"
            style={{ background: 'linear-gradient(135deg, #fffef5, #f5e6d3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-vibes text-3xl md:text-4xl text-rose-gold mb-6">{loveLetter.greeting},</h3>
            {loveLetter.paragraphs.map((p, i) => (
              <p key={i} className="font-cormorant text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
                {p}
              </p>
            ))}
            <p className="font-cormorant text-xl text-gray-700 mt-8 italic">{loveLetter.closing}</p>
            <p className="font-vibes text-3xl text-rose-gold mt-2">{loveLetter.signature}</p>

            <button
              onClick={() => setLetterOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-gray-500 hover:bg-black/20 transition-colors"
              aria-label="Close letter"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

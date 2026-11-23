import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleSystem from '../three/ParticleSystem'
import { websiteConfig } from '../data/websiteConfig'

function Balloon({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!ref.current) return
    timeRef.current += delta
    const t = timeRef.current
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.5
    ref.current.rotation.z = Math.sin(t * 0.3 + phase) * 0.1
  })

  return (
    <group ref={ref} position={position}>
      {/* Balloon body */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Balloon knot */}
      <mesh position={[0, -0.65, 0]}>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* String */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.5, 4]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function ProceduralCake() {
  const ref = useRef<THREE.Group>(null!)

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta
    if (ref.current) {
      ref.current.rotation.y = timeRef.current * 0.1
    }
  })

  return (
    <group ref={ref} position={[0, -1, 0]}>
      {/* Bottom tier */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 1, 32]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.4} />
      </mesh>
      {/* Bottom tier decoration */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[1.8, 0.05, 8, 32]} />
        <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.3} />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
        <meshStandardMaterial color="#ffe4e9" roughness={0.4} />
      </mesh>
      {/* Top tier decoration */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[1.2, 0.05, 8, 32]} />
        <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.3} />
      </mesh>
      {/* Top decoration - small sphere */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.4} />
      </mesh>
      {/* Candles */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * 0.7
        const z = Math.sin(angle) * 0.7
        return (
          <group key={i} position={[x, 2.3, z]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshStandardMaterial color="#ffecd2" />
            </mesh>
            {/* Flame */}
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#ff9500" emissive="#ff6600" emissiveIntensity={2} />
            </mesh>
            <pointLight position={[0, 0.4, 0]} intensity={0.3} color="#ff9500" distance={2} />
          </group>
        )
      })}
    </group>
  )
}

function CakeModel() {
  // ponytail: use procedural cake directly for reliability; upgrade to GLB when KTX2 loader is configured
  return <ProceduralCake />
}

function GiftBox({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} scale={scale}>
        {/* Box */}
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
        {/* Ribbon horizontal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.1, 0.85]} />
          <meshStandardMaterial color="#d4a574" metalness={0.3} />
        </mesh>
        {/* Ribbon vertical */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.85, 0.85]} />
          <meshStandardMaterial color="#d4a574" metalness={0.3} />
        </mesh>
        {/* Bow */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#d4a574" metalness={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

function ConfettiBurst({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 200

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.4 + 0.1,
        (Math.random() - 0.5) * 0.3
      ),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      rotSpeed: (Math.random() - 0.5) * 5,
      scale: Math.random() * 0.3 + 0.1,
      active: false
    }))
  }, [])

  const startedRef = useRef(false)

  useFrame(() => {
    if (!meshRef.current) return
    if (active && !startedRef.current) {
      startedRef.current = true
      particles.forEach(p => {
        p.active = true
        p.pos.set(0, 3, 0)
        p.vel.set(
          (Math.random() - 0.5) * 0.3,
          Math.random() * 0.4 + 0.1,
          (Math.random() - 0.5) * 0.3
        )
      })
    }

    particles.forEach((p, i) => {
      if (!p.active) {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        return
      }
      p.pos.add(p.vel)
      p.vel.y -= 0.003 // gravity
      p.rot.x += p.rotSpeed * 0.02
      p.rot.z += p.rotSpeed * 0.015

      dummy.position.copy(p.pos)
      dummy.rotation.copy(p.rot)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.15, 0.15]} />
      <meshStandardMaterial color="#ff69b4" transparent opacity={0.9} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

export function SceneContent({ visible }: { visible: boolean }) {
  const [wished, setWished] = useState(false)

  if (!visible) return null

  const balloonColors = ['#ff69b4', '#ff91b4', '#b76e79', '#d4a574', '#f4c2c2', '#c77dff', '#ff6b9d']
  const balloonPositions: [number, number, number][] = [
    [-5, 6, -3], [5, 7, -4], [-3, 8, -6], [4, 5, -2],
    [-6, 9, -5], [6, 6, -7], [0, 10, -8], [-4, 7, -1], [3, 8, -5]
  ]

  return (
    <group>
      <CakeModel />

      {/* Gift boxes */}
      <GiftBox position={[-3, -0.5, 1]} color="#ff69b4" scale={1} />
      <GiftBox position={[3, -0.5, 0.5]} color="#c77dff" scale={0.8} />
      <GiftBox position={[-2, -0.5, 2.5]} color="#f4c2c2" scale={0.7} />
      <GiftBox position={[2.5, -0.5, 2]} color="#d4a574" scale={0.9} />

      {/* Balloons */}
      {balloonPositions.map((pos, i) => (
        <Balloon key={i} position={pos} color={balloonColors[i % balloonColors.length]} />
      ))}

      {/* Confetti */}
      <ConfettiBurst active={wished} />

      <ParticleSystem count={120} color="#d4a574" size={0.05} area={[25, 20, 25]} speed={0.2} opacity={0.4} />
      <ParticleSystem count={80} color="#ff69b4" size={0.04} area={[20, 15, 20]} speed={0.15} opacity={0.3} />

      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#1a0a2e" />
      </mesh>

      {/* Star decorations on the ground perimeter */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 8, -1, Math.sin(angle) * 8]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.8} />
          </mesh>
        )
      })}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffecd2" distance={30} />
      <pointLight position={[-5, 5, 3]} intensity={0.8} color="#ff69b4" distance={20} />
      <pointLight position={[5, 5, -3]} intensity={0.6} color="#c77dff" distance={20} />
      <spotLight position={[0, 12, 0]} angle={0.5} intensity={1} color="#fff5ee" penumbra={0.5} />
    </group>
  )
}

export function Overlay({ visible, progress }: { visible: boolean; progress: number }) {
  const [wished, setWished] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const handleWish = () => {
    setWished(true)
    setTimeout(() => setShowMessage(true), 1500)
  }

  if (!visible) return null

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Title */}
      <div className={`absolute top-12 left-0 right-0 text-center transition-all duration-1000 ${progress > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,105,180,0.4)]">
          {websiteConfig.birthdayMessage}
        </h2>
        <p className="font-poppins text-magic-pink text-lg md:text-xl mt-3">{websiteConfig.birthdayDate}</p>
        <p className="font-cormorant text-white/70 text-lg md:text-xl mt-2 max-w-xl mx-auto px-4 italic">
          {websiteConfig.birthdaySubtitle}
        </p>
      </div>

      {/* Make a Wish button */}
      {!wished && progress > 0.3 && (
        <div className="absolute bottom-28 left-0 right-0 flex justify-center pointer-events-auto">
          <button
            onClick={handleWish}
            className="group px-10 py-4 font-poppins text-sm tracking-widest uppercase text-white rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,105,180,0.5)]"
            style={{ background: 'linear-gradient(135deg, #ff69b4, #b76e79, #d4a574)' }}
          >
            ✨ Make a Wish ✨
          </button>
        </div>
      )}

      {/* After wish message */}
      {showMessage && (
        <div className="absolute bottom-24 left-0 right-0 text-center pointer-events-none">
          <p className="font-vibes text-3xl md:text-4xl text-magic-pink animate-pulse">
            May all your wishes come true! 🎂✨
          </p>
        </div>
      )}
    </div>
  )
}

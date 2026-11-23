import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import StarField from '../three/StarField'
import ParticleSystem from '../three/ParticleSystem'
import { websiteConfig } from '../data/websiteConfig'

// Realistic moon with craters, rim light, and atmospheric glow
function Moon() {
  const moonRef = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.01
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.06 + Math.sin(timeRef.current * 0.5) * 0.02
    }
  })

  return (
    <Float speed={0.2} rotationIntensity={0.02} floatIntensity={0.15}>
      <group position={[8, 6, -35]}>
        <group ref={moonRef}>
          {/* Moon surface */}
          <mesh>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial
              color="#f5e6c8"
              roughness={0.8}
              metalness={0}
              emissive="#f5e6c8"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Crater details — subtle darker spots */}
          {[
            [0.8, 1.2, 2.5, 0.4],
            [-1.5, 0.5, 2.3, 0.35],
            [0.3, -0.8, 2.8, 0.25],
            [-0.6, 1.8, 2.1, 0.3],
            [1.2, -0.3, 2.6, 0.2],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r as number, 12, 12]} />
              <meshStandardMaterial color="#e8d5b0" roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Inner glow — warm */}
        <mesh>
          <sphereGeometry args={[3.6, 32, 32]} />
          <meshBasicMaterial color="#ffecd2" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* Middle atmospheric glow */}
        <mesh>
          <sphereGeometry args={[4.5, 32, 32]} />
          <meshBasicMaterial color="#ffe4c9" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>

        {/* Outer soft pink haze */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[6, 32, 32]} />
          <meshBasicMaterial color="#ffb7c5" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>

        {/* Large ambient glow sphere */}
        <mesh>
          <sphereGeometry args={[9, 24, 24]} />
          <meshBasicMaterial color="#2d1b4e" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>

        {/* Moonlight */}
        <pointLight intensity={1.8} color="#ffecd2" distance={70} decay={2} />
        <pointLight intensity={0.6} color="#ffb7c5" distance={40} decay={2} />
      </group>
    </Float>
  )
}

// Nebula clouds at various depths
function NebulaClouds() {
  const timeRef = useRef(0)
  const groupRef = useRef<THREE.Group>(null!)

  const clouds = useMemo(() => [
    { pos: [-15, 5, -40] as const, scale: 10, color: '#2d1b4e', opacity: 0.08 },
    { pos: [20, 8, -50] as const, scale: 14, color: '#4a1942', opacity: 0.06 },
    { pos: [-8, -3, -35] as const, scale: 8, color: '#1a0533', opacity: 0.1 },
    { pos: [12, 12, -55] as const, scale: 16, color: '#3d1f5c', opacity: 0.05 },
    { pos: [-20, 0, -45] as const, scale: 12, color: '#2d1b4e', opacity: 0.07 },
    { pos: [5, -8, -38] as const, scale: 9, color: '#4a1942', opacity: 0.06 },
    { pos: [-5, 15, -60] as const, scale: 18, color: '#1a0a2e', opacity: 0.04 },
    { pos: [25, 3, -48] as const, scale: 11, color: '#3d1f5c', opacity: 0.06 },
  ], [])

  useFrame((_s, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.03) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <Float key={i} speed={0.08 + i * 0.01} floatIntensity={0.3 + i * 0.05}>
          <mesh position={[c.pos[0], c.pos[1], c.pos[2]]}>
            <sphereGeometry args={[c.scale, 16, 16]} />
            <meshBasicMaterial color={c.color} transparent opacity={c.opacity} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function SceneContent({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (groupRef.current) {
      timeRef.current += delta
      groupRef.current.rotation.y = timeRef.current * 0.012
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      <StarField count={1200} />

      {/* Warm floating particles */}
      <ParticleSystem count={250} color="#ff69b4" size={0.06} area={[60, 40, 60]} speed={0.12} opacity={0.45} />
      <ParticleSystem count={150} color="#d4a574" size={0.04} area={[70, 50, 70]} speed={0.08} opacity={0.3} />
      <ParticleSystem count={80} color="#c8b6ff" size={0.03} area={[80, 60, 80]} speed={0.06} opacity={0.2} />

      <Moon />
      <NebulaClouds />

      {/* Cinematic lighting */}
      <ambientLight intensity={0.12} />
      {/* Rim light from behind — cool purple */}
      <directionalLight position={[-10, 5, -20]} intensity={0.3} color="#7c3aed" />
      {/* Fill light — warm pink */}
      <pointLight position={[-10, 3, 8]} intensity={0.5} color="#ff69b4" distance={40} decay={2} />
      {/* Low ground glow */}
      <pointLight position={[0, -8, 5]} intensity={0.2} color="#2d1b4e" distance={25} decay={2} />
    </group>
  )
}

export function Overlay({ visible, onStart }: { visible: boolean; onStart: () => void }) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
      {/* Subtle radial gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(13,2,33,0.4) 70%, rgba(13,2,33,0.7) 100%)',
        }}
      />

      <div className="text-center pointer-events-auto px-6 relative z-10">
        {/* Decorative line */}
        <div className="w-16 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-magic-pink/60 to-transparent" />

        <p className="font-vibes text-3xl md:text-4xl lg:text-5xl text-magic-pink/80 mb-5 animate-pulse">
          {websiteConfig.introTitle}
        </p>

        <h1
          className="font-playfair text-[2.8rem] leading-tight md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-4 tracking-tight"
          style={{
            textShadow: '0 0 60px rgba(255,105,180,0.25), 0 0 120px rgba(255,105,180,0.1)',
          }}
        >
          {websiteConfig.recipientName}
        </h1>

        {/* Decorative line */}
        <div className="w-24 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <p className="font-poppins text-white/50 text-base md:text-lg lg:text-xl mb-14 max-w-lg mx-auto leading-relaxed">
          {websiteConfig.introSubtitle}
        </p>

        <button
          onClick={onStart}
          className="group relative px-12 py-5 md:px-16 md:py-6 font-poppins text-xs md:text-sm tracking-[0.25em] uppercase text-white rounded-full transition-all duration-700 hover:scale-110 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(255,105,180,0.15), rgba(183,110,121,0.15))',
            border: '1px solid rgba(255,105,180,0.4)',
            boxShadow: '0 0 30px rgba(255,105,180,0.1), inset 0 0 30px rgba(255,105,180,0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 50px rgba(255,105,180,0.3), inset 0 0 40px rgba(255,105,180,0.1)'
            e.currentTarget.style.borderColor = 'rgba(255,105,180,0.7)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,105,180,0.1), inset 0 0 30px rgba(255,105,180,0.05)'
            e.currentTarget.style.borderColor = 'rgba(255,105,180,0.4)'
          }}
        >
          <span className="relative z-10">✦&nbsp;&nbsp;Start Our Journey&nbsp;&nbsp;✦</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-magic-pink/0 via-magic-pink/10 to-magic-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </button>

        {/* Scroll hint */}
        <p className="mt-10 text-white/20 text-xs font-poppins tracking-widest uppercase animate-bounce">
          ↓
        </p>
      </div>
    </div>
  )
}

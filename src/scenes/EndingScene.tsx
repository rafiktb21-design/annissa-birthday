import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleSystem from '../three/ParticleSystem'
import StarField from '../three/StarField'
import SakuraPetals from '../three/SakuraPetals'
import { websiteConfig } from '../data/websiteConfig'

function SunsetSky() {
  return (
    <group>
      {/* Sky gradient spheres */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#1a0533" side={THREE.BackSide} />
      </mesh>
      {/* Sunset glow */}
      <mesh position={[0, -10, -40]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial color="#ff7e5f" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, -5, -35]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#ff69b4" transparent opacity={0.1} />
      </mesh>

      {/* Sun */}
      <Float speed={0.3} floatIntensity={0.5}>
        <mesh position={[0, 2, -35]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#ff9966" />
        </mesh>
        <mesh position={[0, 2, -35.1]}>
          <sphereGeometry args={[6, 32, 32]} />
          <meshBasicMaterial color="#ff7e5f" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, 2, -35.2]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.1} />
        </mesh>
      </Float>

      {/* Clouds */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={0.2 + i * 0.05} floatIntensity={0.3}>
          <mesh position={[(i - 3) * 10, 8 + i, -25 - i * 3]}>
            <sphereGeometry args={[3 + i * 0.5, 12, 12]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff7e5f' : '#ff91b4'} transparent opacity={0.08} />
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
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = timeRef.current * 0.01
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      <SunsetSky />
      <StarField count={300} />
      <SakuraPetals count={100} area={30} />
      <ParticleSystem count={100} color="#ff7e5f" size={0.06} area={[30, 20, 30]} speed={0.1} opacity={0.3} />
      <ParticleSystem count={60} color="#d4a574" size={0.04} area={[25, 15, 25]} speed={0.08} opacity={0.25} />

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, -30]} intensity={1.5} color="#ff9966" distance={50} />
      <pointLight position={[-5, 3, 0]} intensity={0.5} color="#ff69b4" distance={20} />
    </group>
  )
}

export function Overlay({ visible, progress, onReplay }: { visible: boolean; progress: number; onReplay: () => void }) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
      <div className="text-center px-4">
        <p className={`font-cormorant text-xl md:text-2xl text-white/70 italic mb-8 transition-all duration-1000 ${progress > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {websiteConfig.finalSubtitle}
        </p>
        <h2 className={`font-playfair text-6xl md:text-8xl lg:text-9xl font-bold mb-8 transition-all duration-[2000ms] ${progress > 0.3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{
            background: 'linear-gradient(135deg, #ff69b4, #d4a574, #ff7e5f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(255,105,180,0.4))'
          }}
        >
          {websiteConfig.finalMessage}
        </h2>
        <p className={`font-vibes text-2xl md:text-3xl text-white/60 mb-12 transition-all duration-1000 delay-1000 ${progress > 0.5 ? 'opacity-100' : 'opacity-0'}`}>
          {websiteConfig.signatureText}
        </p>

        <div className={`transition-all duration-1000 delay-[1500ms] ${progress > 0.6 ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={onReplay}
            className="pointer-events-auto px-8 py-3 font-poppins text-sm tracking-widest uppercase text-white/80 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-500"
          >
            Replay Our Journey
          </button>
        </div>
      </div>
    </div>
  )
}

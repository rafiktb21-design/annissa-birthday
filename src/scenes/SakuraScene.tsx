import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import SakuraPetals from '../three/SakuraPetals'
import Fireflies from '../three/Fireflies'
import ParticleSystem from '../three/ParticleSystem'
import { websiteConfig } from '../data/websiteConfig'

// ponytail: procedural trees only; upgrade to GLB when KTX2Loader configured
function SakuraTree({ position, scale = 1, rotation = 0 }: { position: [number, number, number]; scale?: number; rotation?: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(timeRef.current * 0.3 + rotation) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale} rotation-y={rotation}>
      {/* Main trunk */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.12, 0.35, 4, 8]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.9} />
      </mesh>
      {/* Branch left */}
      <mesh position={[-0.8, 3.5, 0]} rotation-z={0.5}>
        <cylinderGeometry args={[0.05, 0.1, 2, 6]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.9} />
      </mesh>
      {/* Branch right */}
      <mesh position={[0.6, 3.2, 0.3]} rotation-z={-0.4}>
        <cylinderGeometry args={[0.05, 0.08, 1.8, 6]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.9} />
      </mesh>
      {/* Main canopy */}
      <Float speed={0.5} floatIntensity={0.05} rotationIntensity={0.02}>
        <mesh position={[0, 5.2, 0]}>
          <sphereGeometry args={[2.8, 16, 16]} />
          <meshStandardMaterial color="#ffb7c5" transparent opacity={0.9} emissive="#ff69b4" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[1.5, 5, 0.8]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color="#ffc0cb" transparent opacity={0.85} emissive="#ff69b4" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[-1.3, 5.3, -0.6]}>
          <sphereGeometry args={[2.2, 16, 16]} />
          <meshStandardMaterial color="#ffb7c5" transparent opacity={0.85} emissive="#ff69b4" emissiveIntensity={0.18} />
        </mesh>
        <mesh position={[0.3, 4.2, 1.2]}>
          <sphereGeometry args={[1.5, 12, 12]} />
          <meshStandardMaterial color="#ffd1dc" transparent opacity={0.8} emissive="#ff69b4" emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[-0.5, 4.5, -1]}>
          <sphereGeometry args={[1.6, 12, 12]} />
          <meshStandardMaterial color="#ffb7c5" transparent opacity={0.8} emissive="#ff69b4" emissiveIntensity={0.14} />
        </mesh>
      </Float>
      {/* Tree glow */}
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#ff69b4" distance={8} />
    </group>
  )
}

function GlowingPath() {
  const pathRef = useRef<THREE.Mesh>(null!)

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta
    if (pathRef.current) {
      const mat = pathRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.3 + Math.sin(timeRef.current) * 0.15
    }
  })

  return (
    <group>
      <mesh ref={pathRef} rotation-x={-Math.PI / 2} position={[0, 0.02, -15]}>
        <planeGeometry args={[3.5, 60]} />
        <meshStandardMaterial color="#f4c2c2" emissive="#ff69b4" emissiveIntensity={0.3} transparent opacity={0.35} />
      </mesh>
      {/* Path edge glow */}
      <mesh rotation-x={-Math.PI / 2} position={[-1.8, 0.01, -15]}>
        <planeGeometry args={[0.3, 60]} />
        <meshBasicMaterial color="#ff69b4" transparent opacity={0.15} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[1.8, 0.01, -15]}>
        <planeGeometry args={[0.3, 60]} />
        <meshBasicMaterial color="#ff69b4" transparent opacity={0.15} />
      </mesh>
      {/* Path lanterns */}
      {[...Array(8)].map((_, i) => (
        <group key={i}>
          <mesh position={[2.5, 0.3, -i * 6]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#ffecd2" emissive="#ffecd2" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[2.5, 0.5, -i * 6]} intensity={0.3} color="#ffecd2" distance={4} />
          <mesh position={[-2.5, 0.3, -i * 6 - 3]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#ffecd2" emissive="#ffecd2" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[-2.5, 0.5, -i * 6 - 3]} intensity={0.3} color="#ffecd2" distance={4} />
        </group>
      ))}
    </group>
  )
}

export function SceneContent({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <group position={[0, -2, 0]}>
      <SakuraTree position={[-5, 0, 2]} scale={1.2} rotation={0.3} />
      <SakuraTree position={[6, 0, -3]} scale={1} rotation={-0.5} />
      <SakuraTree position={[-7, 0, -10]} scale={1.4} rotation={0.8} />
      <SakuraTree position={[5, 0, -15]} scale={0.9} rotation={-0.2} />
      <SakuraTree position={[-6, 0, -22]} scale={1.3} rotation={1.2} />
      <SakuraTree position={[7, 0, -28]} scale={1.1} rotation={-0.8} />
      <SakuraTree position={[-4, 0, -35]} scale={0.8} rotation={0.6} />
      <SakuraTree position={[8, 0, -40]} scale={1.0} rotation={-1.0} />

      <GlowingPath />
      <SakuraPetals count={300} area={40} />
      <Fireflies count={60} />
      <ParticleSystem count={100} color="#ffb7c5" size={0.05} area={[35, 25, 50]} speed={0.1} opacity={0.4} />
      <ParticleSystem count={60} color="#d4a574" size={0.03} area={[30, 20, 40]} speed={0.08} opacity={0.3} />

      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, -15]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#120826" />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 15, -10]} intensity={1.2} color="#ff69b4" distance={50} />
      <pointLight position={[0, 8, -25]} intensity={1} color="#ffc0cb" distance={40} />
      <pointLight position={[0, 5, 5]} intensity={0.6} color="#ff69b4" distance={25} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#ffecd2" />
    </group>
  )
}

export function Overlay({ visible, progress }: { visible: boolean; progress: number }) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
      <div className="text-center px-4">
        <p
          className={`font-playfair text-3xl md:text-5xl text-white/90 mb-6 transition-all duration-1000 ${
            progress > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {websiteConfig.sakuraMessages[0]}
        </p>
        <p
          className={`font-vibes text-2xl md:text-4xl text-magic-pink transition-all duration-1000 delay-500 ${
            progress > 0.4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {websiteConfig.sakuraMessages[1]}
        </p>
      </div>
    </div>
  )
}

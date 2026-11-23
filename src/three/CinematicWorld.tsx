import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'
import RomanticGardenGround from './RomanticGardenGround'
import GardenArches from './GardenArches'
import Butterflies from './Butterflies'
import FlowerFields from './FlowerFields'
import StarField from './StarField'
import AtmosphericClouds from './AtmosphericClouds'
import BotanicalSakuraTree from './BotanicalSakuraTree'
import { LuminescentPath } from './PathwayLights'
import SakuraPetals from './SakuraPetals'
import Fireflies from './Fireflies'
import ParticleSystem from './ParticleSystem'
import PolaroidGallery from './PolaroidGallery'
import LoveLetter3D from './LoveLetter3D'
import CelebrationCake3D from './CelebrationCake3D'
import ConstellationHeart from './ConstellationHeart'
import type { MemoryItem } from '../data/websiteConfig'

interface CinematicWorldProps {
  scrollProgress: number
  selectedMemory: MemoryItem | null
  onSelectMemory: (item: MemoryItem | null) => void
  isLetterOpen: boolean
  onToggleLetter: () => void
  candlesLit: boolean
  onBlowCandles: () => void
  isBlowing?: boolean
}

export default function CinematicWorld({
  scrollProgress,
  selectedMemory,
  onSelectMemory,
  isLetterOpen,
  onToggleLetter,
  candlesLit,
  onBlowCandles,
  isBlowing = false,
}: CinematicWorldProps) {
  const fogRef = useRef<THREE.FogExp2>(null!)

  // Botanical sakura trees flanking both sides of the path
  const sakuraTrees = [
    // Left side of path
    { pos: [-4.6, 0, -36] as const, scale: 1.15, rotY: 0.4, phase: 0 },
    { pos: [-5.2, 0, -50] as const, scale: 1.35, rotY: 1.1, phase: 1.2 },
    { pos: [-4.5, 0, -64] as const, scale: 1.25, rotY: -0.5, phase: 2.1 },
    { pos: [-5.4, 0, -78] as const, scale: 1.4, rotY: 0.8, phase: 0.7 },
    { pos: [-4.2, 0, -92] as const, scale: 1.1, rotY: -1.2, phase: 1.8 },
    { pos: [-5.0, 0, -104] as const, scale: 1.3, rotY: 0.3, phase: 2.9 },
    // Right side of path
    { pos: [4.8, 0, -40] as const, scale: 1.2, rotY: -0.6, phase: 0.5 },
    { pos: [5.4, 0, -54] as const, scale: 1.4, rotY: 0.9, phase: 1.7 },
    { pos: [4.5, 0, -68] as const, scale: 1.15, rotY: -0.8, phase: 2.4 },
    { pos: [5.6, 0, -82] as const, scale: 1.35, rotY: 1.4, phase: 0.9 },
    { pos: [4.6, 0, -96] as const, scale: 1.25, rotY: -0.4, phase: 1.5 },
  ]

  useFrame((_state, delta) => {
    // Dynamic soft romantic fog density tuning
    if (fogRef.current) {
      const targetDensity = scrollProgress > 0.88 ? 0.0022 : 0.0032
      fogRef.current.density = THREE.MathUtils.lerp(fogRef.current.density, targetDensity, delta * 2)
    }
  })

  return (
    <group>
      {/* 0. Environmental Realistic HDRI Lighting (Poly Haven Sunny Rose Garden CC0) */}
      <Environment files="/assets/hdri/sunny_rose_garden_1k.hdr" environmentIntensity={0.7} />

      {/* 1. Soft Fairytale Atmospheric Fog (#FCEAE5) seamlessly blending scene into distant sky */}
      <fogExp2 ref={fogRef} attach="fog" args={['#FCEAE5', 0.0032]} />

      {/* 2. Shimmering Golden & Rose Stardust in the Sky */}
      <StarField count={900} />

      {/* 3. Multi-point Warm Cinematic Lighting */}
      {/* Lavender Soft Ambient Fill Light */}
      <ambientLight intensity={1.35} color="#E4D8F8" />
      {/* Warm Golden Sunlight */}
      <directionalLight
        position={[16, 28, 16]}
        intensity={1.9}
        color="#FFF2D6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      {/* Sunset Peach Horizon Fill Light */}
      <directionalLight position={[-14, 14, -45]} intensity={1.15} color="#FFD8C4" />
      {/* Rose Pink Rim Light */}
      <pointLight position={[-10, 10, -70]} intensity={1.5} color="#F8B8CC" distance={80} />
      {/* Golden Horizon Glow */}
      <pointLight position={[10, 8, -120]} intensity={1.4} color="#F5D58A" distance={80} />

      {/* 4. Complete Natural Garden Ground & Cobblestones (Seamless, no floating planes) */}
      <RomanticGardenGround />

      {/* 5. Classical Floral Rose Arches */}
      <GardenArches />

      {/* 6. Animated Fluttering Butterflies */}
      <Butterflies />

      {/* ================= SCENE 1: THE MAGICAL ENTRANCE ================= */}
      <group>
        {/* Soft volumetric pastel clouds */}
        <AtmosphericClouds />
        {/* Floating warm fairy sparkles (Rose & Soft Gold) */}
        <ParticleSystem count={220} color="#F8B8CC" size={0.16} area={[50, 30, 45]} speed={0.12} opacity={0.65} />
        <ParticleSystem count={150} color="#F5D58A" size={0.14} area={[60, 35, 55]} speed={0.08} opacity={0.55} />
        {/* Stone lanterns along the pathway */}
        <LuminescentPath />
        {/* Botanical multi-tiered flower meadows */}
        <FlowerFields />
        {/* Botanical Sakura Trees */}
        {sakuraTrees.map((tree, idx) => (
          <BotanicalSakuraTree
            key={idx}
            position={[tree.pos[0], tree.pos[1], tree.pos[2]]}
            scale={tree.scale}
            rotationY={tree.rotY}
            windPhase={tree.phase}
          />
        ))}
        {/* Falling Petals & Fireflies */}
        <SakuraPetals count={400} area={50} />
        <Fireflies count={75} />
      </group>

      {/* ================= SCENE 2: THE BIRTHDAY CELEBRATION ================= */}
      <group>
        <CelebrationCake3D
          position={[0, 0, -65]}
          candlesLit={candlesLit}
          onBlowCandles={onBlowCandles}
          isBlowing={isBlowing}
          scrollProgress={scrollProgress}
        />
        {/* Warm celebration glow accent */}
        <pointLight position={[0, 4.2, -65]} intensity={1.8} color="#FFE6B8" distance={24} />
      </group>

      {/* ================= SCENE 3: OUR LITTLE MEMORIES ================= */}
      <group>
        <PolaroidGallery
          selectedMemory={selectedMemory}
          onSelectMemory={onSelectMemory}
        />
        {/* Warm Golden & Peach accents around memories */}
        <pointLight position={[0, 3.5, -125]} intensity={1.8} color="#F5D58A" distance={25} />
        <pointLight position={[0, 4.2, -125]} intensity={1.4} color="#F8B8CC" distance={20} />
      </group>

      {/* ================= SCENE 4: THE LOVE LETTER ================= */}
      <group>
        <LoveLetter3D
          position={[0, 0, -185]}
          isOpen={isLetterOpen}
          onToggleOpen={onToggleLetter}
        />
      </group>

      {/* ================= SCENE 5: FINAL BIRTHDAY SURPRISE ================= */}
      <group>
        <ConstellationHeart position={[0, 5.2, -245]} scale={1.8} />
      </group>
    </group>
  )
}

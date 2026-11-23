import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Sparkles, ArrowDown } from 'lucide-react'
import { audio } from '../../utils/audio'

function CoverBackground3D() {
  const petalsRef = useRef<THREE.Group>(null!)

  useFrame((_state, delta) => {
    if (petalsRef.current) {
      petalsRef.current.rotation.y += delta * 0.05
      petalsRef.current.children.forEach((child, i) => {
        child.position.y -= delta * (0.2 + (i % 3) * 0.1)
        if (child.position.y < -4) {
          child.position.y = 5
        }
      })
    }
  })

  return (
    <>
      <Environment files="/assets/hdri/sunny_rose_garden_1k.hdr" environmentIntensity={0.65} />
      <ambientLight intensity={1.2} color="#FFF4E8" />
      <directionalLight position={[10, 15, 8]} intensity={1.8} color="#FFF2D6" />

      {/* Floating Rose & Peach Petals */}
      <group ref={petalsRef}>
        {Array.from({ length: 32 }).map((_, i) => (
          <Float key={i} speed={1.2} rotationIntensity={0.8} floatIntensity={1.2}>
            <mesh
              position={[
                (Math.sin(i * 1.7) * 9),
                (Math.cos(i * 2.3) * 4),
                (Math.sin(i * 0.9) * 4) - 2,
              ]}
              rotation={[Math.sin(i), Math.cos(i), 0]}
              scale={0.18 + (i % 3) * 0.06}
            >
              <planeGeometry args={[1, 1.3]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#F4D9DE' : '#D99AA8'}
                roughness={0.6}
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
              />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  )
}

interface CoverSectionProps {
  onOpenGift: () => void
}

export default function CoverSection({ onOpenGift }: CoverSectionProps) {
  const handleOpen = () => {
    audio.playSparkle()
    audio.startBGM()
    onOpenGift()
  }

  return (
    <section id="top" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF9F2] via-[#F4D9DE]/30 to-[#FFF9F2]">
      {/* 3D Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <CoverBackground3D />
        </Canvas>
      </div>

      {/* Warm Golden Sunlight Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#FFF9F2]/40 to-[#FFF9F2]/90 pointer-events-none z-10" />

      {/* Editorial Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Subtle Ornamental Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white/80 border border-[#E8D4B8] shadow-sm backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D99AA8]" />
          <span className="font-poppins text-xs uppercase tracking-[0.25em] text-[#49372F] font-semibold">
            Special Birthday Edition
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#D99AA8]" />
        </motion.div>

        {/* Refined Editorial Title: A Little World Made for You */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#49372F] font-normal tracking-tight leading-[1.08] mb-6 drop-shadow-sm"
        >
          A Little World <br />
          <span className="italic font-normal text-[#D99AA8]">Made for You</span>
        </motion.h1>

        {/* Delicate Champagne Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          className="w-28 h-px bg-gradient-to-r from-transparent via-[#E8D4B8] to-transparent mb-6"
        />

        {/* Subtitle: A birthday journey, made with love. */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.65, ease: 'easeOut' }}
          className="font-cormorant text-xl sm:text-2xl md:text-3xl text-[#49372F]/85 italic mb-8 max-w-xl mx-auto"
        >
          A birthday journey, made with love.
        </motion.p>

        {/* Tasteful Handwritten Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
          className="font-vibes text-2xl sm:text-3xl text-[#D99AA8] mb-12 tracking-wide"
        >
          For Annissa, with love — Rafi
        </motion.p>

        {/* One Clear CTA: OPEN YOUR GIFT */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 1.1, ease: 'easeOut' }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpen}
          className="group relative inline-flex items-center gap-3 px-10 py-4 sm:px-12 sm:py-4.5 rounded-full bg-[#49372F] text-[#FFF9F2] font-poppins text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold shadow-xl shadow-[#49372F]/15 border border-[#E8D4B8]/50 transition-all duration-300 hover:bg-[#3D2C25] cursor-pointer"
        >
          <span>OPEN YOUR GIFT</span>
          <ArrowDown className="w-4 h-4 text-[#E8D4B8] group-hover:translate-y-1 transition-transform" />
        </motion.button>
      </div>

      {/* Floating Bottom Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#49372F]/60 text-xs font-poppins tracking-wider"
      >
        <span>scroll down</span>
        <span className="animate-bounce">↓</span>
      </motion.div>
    </section>
  )
}

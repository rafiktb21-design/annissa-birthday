import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { RotateCcw, Heart, Sparkles } from 'lucide-react'
import { websiteConfig } from '../../data/websiteConfig'
import { audio } from '../../utils/audio'

function GoldenHourSunset3D() {
  const petalsRef = useRef<THREE.Group>(null!)

  useFrame((_state, delta) => {
    if (petalsRef.current) {
      petalsRef.current.rotation.y += delta * 0.04
      petalsRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(delta * 2 + i) * 0.015
      })
    }
  })

  return (
    <>
      <Environment files="/assets/hdri/pink_sunrise_1k.hdr" environmentIntensity={0.8} />
      <ambientLight intensity={1.4} color="#FFE6D6" />
      <directionalLight position={[0, 10, -5]} intensity={2.5} color="#FFD1BA" />

      {/* Floating Golden & Blush Rose Petals */}
      <group ref={petalsRef}>
        {Array.from({ length: 40 }).map((_, i) => (
          <Float key={i} speed={1.1} rotationIntensity={0.9} floatIntensity={1.3}>
            <mesh
              position={[
                Math.sin(i * 1.5) * 8,
                Math.cos(i * 2.1) * 3.5,
                Math.sin(i * 0.8) * 3 - 2,
              ]}
              rotation={[Math.sin(i), Math.cos(i), 0]}
              scale={0.16 + (i % 3) * 0.06}
            >
              <planeGeometry args={[1, 1.2]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#F5C6AE' : '#D99AA8'}
                roughness={0.5}
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

interface FinaleSectionProps {
  onReplay: () => void
}

export default function FinaleSection({ onReplay }: FinaleSectionProps) {
  const handleReplayClick = () => {
    audio.playSparkle()
    onReplay()
  }

  return (
    <section id="finale" className="relative w-full min-h-screen py-24 sm:py-28 md:py-32 bg-gradient-to-b from-[#FFF9F2] via-[#F5C6AE]/30 to-[#FFF9F2] flex items-center justify-center overflow-hidden scroll-mt-20">
      {/* 3D Atmospheric Sunset & Drifting Twilight Petals */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <GoldenHourSunset3D />
        </Canvas>
      </div>

      {/* Warm Golden Glow Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#FFF9F2]/30 to-[#FFF9F2]/80 pointer-events-none z-10" />

      {/* Emotional Finale Content */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Decorative Heart Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-14 h-14 rounded-full bg-white/80 border border-[#E8D4B8] shadow-sm flex items-center justify-center text-[#D99AA8] mb-8"
        >
          <Heart className="w-6 h-6 fill-[#D99AA8]" />
        </motion.div>

        {/* Small Intro Chapter Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-poppins text-xs uppercase tracking-[0.3em] text-[#D99AA8] font-semibold mb-4"
        >
          THE PROMISE
        </motion.p>

        {/* Main Text: "I LOVE YOU" */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#49372F] font-normal tracking-tight mb-6"
        >
          {websiteConfig.finalMessage}
        </motion.h2>

        {/* Delicate Golden Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.55 }}
          className="w-24 h-px bg-[#E8D4B8] mb-6"
        />

        {/* Supporting text: "Every beautiful journey is better with you in it." */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.7 }}
          className="font-cormorant text-2xl sm:text-3xl text-[#49372F]/85 italic mb-8 max-w-xl mx-auto leading-relaxed"
        >
          &ldquo;Every beautiful journey is better with you in it.&rdquo;
        </motion.p>

        {/* Signature: "Made with love, Rafi." */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="font-vibes text-3xl sm:text-4xl text-[#D99AA8] mb-12 tracking-wide"
        >
          Made with love, Rafi.
        </motion.p>

        {/* Refined Replay Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 1.1 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReplayClick}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white/90 text-[#49372F] border border-[#E8D4B8] font-poppins text-xs uppercase tracking-widest font-semibold shadow-sm hover:shadow-md hover:bg-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#D99AA8]" />
          <span>Replay Journey</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E8D4B8]" />
        </motion.button>
      </div>
    </section>
  )
}

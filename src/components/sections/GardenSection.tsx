import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import SakuraPetals from '../../three/SakuraPetals'
import Butterflies from '../../three/Butterflies'

// Floating fairy dust / golden light motes in the warm afternoon sun
function SunbeamParticles() {
  return (
    <group>
      {Array.from({ length: 36 }).map((_, i) => {
        const x = Math.sin(i * 1.7) * 5.5
        const y = Math.cos(i * 2.3) * 2.8
        const z = Math.sin(i * 3.1) * 2.5 + 0.5
        return (
          <mesh key={i} position={[x, y, z]} scale={0.03 + (i % 3) * 0.015}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#FFE8D6' : '#FFD5DE'}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function GardenSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [revealedSecret, setRevealedSecret] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  return (
    <section
      id="garden"
      className="relative w-full pt-12 pb-24 sm:pt-16 sm:pb-32 bg-[#FFF9F2] overflow-hidden flex flex-col items-center select-none scroll-mt-24"
    >
      {/* Navbar breathing spacer */}
      <div className="w-full h-14 sm:h-20 shrink-0 pointer-events-none" />

      {/* Editorial Chapter Header */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center mb-8 sm:mb-12">
        <p className="font-poppins text-xs uppercase tracking-[0.35em] text-[#D99AA8] font-semibold mb-3">
          CHAPTER I &bull; THE GARDEN
        </p>

        <h2 className="font-playfair text-4xl sm:text-6xl md:text-7xl text-[#49372F] font-normal tracking-tight leading-[1.1] mb-4">
          A Walk Through <br />
          <span className="italic font-normal text-[#D99AA8]">Cherry Blossoms</span>
        </h2>

        <p className="font-cormorant text-xl sm:text-2xl text-[#49372F]/80 italic max-w-lg mx-auto">
          A quiet spring morning under weeping sakura canopies, where every petal tells a story.
        </p>
      </div>

      {/* Cinematic Hybrid Garden Window — Standard Master Container */}
      <div className="relative max-w-[1200px] w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] mx-auto h-[68vh] min-h-[520px] max-h-[720px] z-10">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative w-full h-full rounded-3xl overflow-hidden border border-[#E8D4B8]/80 shadow-[0_25px_70px_-15px_rgba(73,55,47,0.18)] bg-[#F5ECE1] group cursor-pointer"
        >
          {/* Layer 1: Photographic Authentic Japanese Garden Background with Smooth Parallax */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out scale-105 pointer-events-none"
            style={{
              backgroundImage: `url('/assets/backgrounds/bench_27.jpg')`,
              transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -12}px, 0) scale(1.06)`,
            }}
          />

          {/* Layer 2: Warm Golden-Hour Editorial Atmosphere & Light Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#49372F]/25 via-transparent to-[#FFF9F2]/15 pointer-events-none" />
          <div className="absolute inset-0 bg-[#FFEAD6]/10 mix-blend-soft-light pointer-events-none" />

          {/* Layer 3: Interactive 3D Canvas (Falling Petals, Butterflies, Sunbeam Dust) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[-4, 8, 4]} intensity={1.8} color="#FFE6CC" />

              {/* Drifting Petals swirling across the frame */}
              <SakuraPetals count={85} area={12} />

              {/* Animated Fluttering Butterflies */}
              <Butterflies local={true} />

              {/* Golden Sunbeam Fairy Dust */}
              <SunbeamParticles />
            </Canvas>
          </div>

          {/* Layer 4: Interactive Poetic Discovery Card nestled near the Garden Bench */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 max-w-sm pointer-events-auto">
            <motion.div
              onClick={() => setRevealedSecret(!revealedSecret)}
              className="bg-white/85 backdrop-blur-md border border-[#E8D4B8] p-4 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 hover:bg-white/95 hover:shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#D99AA8] animate-pulse" />
                <span className="font-poppins text-[10px] uppercase tracking-widest text-[#D99AA8] font-semibold">
                  {revealedSecret ? 'A Whisper for Annisa' : 'Click to discover a memory'}
                </span>
              </div>
              <p className="font-cormorant text-base sm:text-lg text-[#49372F] italic leading-snug">
                {revealedSecret
                  ? '“Walking this path with you makes every ordinary blossom feel like a celebration of twenty-one wonderful years.”'
                  : 'A quiet morning along the stone path under weeping sakura branches...'}
              </p>
            </motion.div>
          </div>

          {/* Subtle Instruction Badge */}
          <div className="absolute top-5 right-5 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-[#E8D4B8]/60 shadow-xs">
            <span className="font-poppins text-[10px] text-[#49372F]/80 tracking-wider">
              Move cursor to drift petals
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Quote Card Below Scene */}
      <div className="relative z-20 max-w-2xl mx-auto px-6 text-center mt-12 sm:mt-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/80 border border-[#E8D4B8]/70 shadow-sm backdrop-blur-md">
          <div className="w-10 h-px bg-[#E8D4B8] mx-auto mb-4" />
          <p className="font-cormorant text-2xl sm:text-3xl text-[#49372F] italic leading-relaxed mb-3">
            &ldquo;Some people make ordinary days feel extraordinary.&rdquo;
          </p>
          <p className="font-poppins text-[11px] uppercase tracking-widest text-[#D99AA8] font-semibold">
            Walking down the sunlit pathway
          </p>
        </div>
      </div>
    </section>
  )
}

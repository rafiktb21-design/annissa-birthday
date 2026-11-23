import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function FloatingDecorations() {
  // Generate random petals for soft drifting motion
  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 19) % 96}%`,
      delay: (i * 1.3) % 7,
      duration: 12 + (i % 5) * 2.5,
      scale: 0.6 + (i % 4) * 0.2,
      opacity: 0.35 + (i % 3) * 0.2,
      color: i % 2 === 0 ? '#EFAEBF' : '#F6C6B3',
      rotateDir: i % 2 === 0 ? 360 : -360,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Side Floral Vines (framing left and right edges softly) */}
      <div className="absolute top-20 left-0 w-10 sm:w-16 h-[80vh] opacity-35 -scale-x-100 hidden sm:block">
        <img
          src="/assets/flowers/floral-side-vine.svg"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <div className="absolute top-20 right-0 w-10 sm:w-16 h-[80vh] opacity-35 hidden sm:block">
        <img
          src="/assets/flowers/floral-side-vine.svg"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      {/* 2. Floating Romantic Butterfly 1 (Fluttering from bottom-left to top-right) */}
      <motion.div
        initial={{ x: '-10vw', y: '80vh', rotate: 15, scale: 0.7, opacity: 0 }}
        animate={{
          x: ['0vw', '35vw', '70vw', '105vw'],
          y: ['80vh', '50vh', '30vh', '10vh'],
          rotate: [15, 35, 10, 25],
          opacity: [0, 0.85, 0.85, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute w-10 h-10 sm:w-12 sm:h-12 filter drop-shadow-sm"
      >
        <img
          src="/assets/decorations/butterfly.svg"
          alt=""
          className="w-full h-full object-contain animate-pulse"
        />
      </motion.div>

      {/* 3. Floating Romantic Butterfly 2 (Fluttering from right to top-left) */}
      <motion.div
        initial={{ x: '105vw', y: '60vh', rotate: -20, scale: 0.6, opacity: 0 }}
        animate={{
          x: ['105vw', '65vw', '30vw', '-10vw'],
          y: ['60vh', '40vh', '55vh', '25vh'],
          rotate: [-20, -5, -30, -15],
          opacity: [0, 0.75, 0.75, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 11,
        }}
        className="absolute w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-sm scale-x-[-1]"
      >
        <img
          src="/assets/decorations/butterfly.svg"
          alt=""
          className="w-full h-full object-contain animate-pulse"
        />
      </motion.div>

      {/* 4. Drifting Sakura & Rose Petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            y: '-8vh',
            x: 0,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            y: '108vh',
            x: [0, 25, -20, 15, 0],
            rotate: petal.rotateDir,
            opacity: [0, petal.opacity, petal.opacity, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'linear',
          }}
          style={{
            left: petal.left,
            position: 'absolute',
            width: `${14 * petal.scale}px`,
            height: `${18 * petal.scale}px`,
          }}
        >
          {/* Petal Oval Shape */}
          <div
            className="w-full h-full rounded-[60%_40%_70%_30%/50%_60%_40%_50%] filter blur-[0.3px]"
            style={{
              background: `radial-gradient(circle at 35% 35%, #FFFDF9, ${petal.color})`,
              boxShadow: '0 2px 6px rgba(201, 130, 153, 0.2)',
            }}
          />
        </motion.div>
      ))}

      {/* 5. Golden Twinkle Fairy Dust / Sparkles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.2, 0.75, 0.2],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: `${(i * 19 + 7) % 90}%`,
            left: `${(i * 23 + 11) % 92}%`,
            width: '6px',
            height: '6px',
          }}
          className="rounded-full bg-[#D8B77E] blur-[0.6px] shadow-[0_0_8px_#D8B77E]"
        />
      ))}
    </div>
  )
}

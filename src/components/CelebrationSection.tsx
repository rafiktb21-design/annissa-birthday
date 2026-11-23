import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, Heart, Wand2 } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { audio } from '../utils/audio'

export default function CelebrationSection() {
  const [candlesLit, setCandlesLit] = useState(true)
  const [hasWished, setHasWished] = useState(false)
  const cfg = websiteConfig.celebration

  const handleMakeAWish = () => {
    audio.playCandleBlow()
    setCandlesLit(false)
    setHasWished(true)

    // Elegant Pastel Confetti Explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#F7DCE5', '#EFAEBF', '#D8B77E', '#FFF6F0', '#F6C6B3'],
        disableForReducedMotion: true,
      })

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C98299', '#D8B77E', '#FFF9F5'],
          disableForReducedMotion: true,
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C98299', '#D8B77E', '#FFF9F5'],
          disableForReducedMotion: true,
        })
      }, 250)
    } catch {
      // safe fallback
    }
  }

  const handleRelight = () => {
    audio.playSparkle()
    setCandlesLit(true)
    setHasWished(false)
  }

  return (
    <section id="birthday" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden flex flex-col items-center text-center">
      {/* Decorative Pastel Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-radial from-[#F7DCE5]/50 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      {/* Decorative Corner Florals */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none opacity-40">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none opacity-40 scale-x-[-1]">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="site-container relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Hanging Floral Garland */}
        <div className="w-full max-w-xs mb-3 pointer-events-none">
          <img src="/assets/decorations/garland.svg" alt="" className="w-full h-8 object-contain opacity-80" />
        </div>

        {/* Cute Bow Ribbon */}
        <div className="w-12 h-9 mb-2 pointer-events-none">
          <img src="/assets/decorations/bow-ribbon.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Section Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/50 text-[#674A49] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
          <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
            Celebration
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl text-[#674A49] font-normal mb-2">
          {cfg.heading}
        </h2>

        <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] mb-8">
          "{cfg.subtitle}"
        </p>

        {/* Central Birthday Cake Stage */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          {/* Cake Stand & Visual */}
          <div className="relative w-[260px] h-[300px] sm:w-[320px] sm:h-[360px] flex items-center justify-center">
            {/* SVG Illustration of Cake */}
            <div className={`w-full h-full transition-all duration-700 ${candlesLit ? 'filter drop-shadow-md' : 'filter drop-shadow-sm'}`}>
              <svg viewBox="0 0 320 380" className="w-full h-full">
                <defs>
                  <linearGradient id="cakeCream" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFF2E8" />
                    <stop offset="50%" stopColor="#FFFDF9" />
                    <stop offset="100%" stopColor="#FFE8DB" />
                  </linearGradient>
                  <linearGradient id="cakePink" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F4C7D5" />
                    <stop offset="50%" stopColor="#FCEEF2" />
                    <stop offset="100%" stopColor="#EAA6BC" />
                  </linearGradient>
                  <linearGradient id="standGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5A063" />
                    <stop offset="50%" stopColor="#E7CD9B" />
                    <stop offset="100%" stopColor="#BA9558" />
                  </linearGradient>
                  <radialGradient id="flameGlow" cx="50%" cy="60%" r="50%">
                    <stop offset="0%" stopColor="#FFF8D6" />
                    <stop offset="40%" stopColor="#FFC857" />
                    <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Cake Stand */}
                <g>
                  <path d="M 60 320 Q 160 338 260 320 L 265 328 Q 160 348 55 328 Z" fill="url(#standGold)" />
                  <path d="M 145 325 L 140 355 L 125 365 L 195 365 L 180 355 L 175 325 Z" fill="url(#standGold)" />
                  <ellipse cx="160" cy="320" rx="105" ry="12" fill="#E2C58E" />
                </g>

                {/* Bottom Cake Tier */}
                <g>
                  <path d="M 75 250 L 75 310 C 75 328 245 328 245 310 L 245 250 Z" fill="url(#cakePink)" />
                  <ellipse cx="160" cy="250" rx="85" ry="15" fill="#FFE8DB" />
                  <path d="M 75 250 C 85 270 95 270 105 256 C 115 275 125 275 135 258 C 145 278 155 278 165 256 C 175 276 185 276 195 258 C 205 274 215 274 225 256 C 235 270 245 265 245 250 Z" fill="#FFFDF9" opacity="0.95" />
                  <g fill="#D8B77E" opacity="0.8">
                    <circle cx="90" cy="314" r="3" /><circle cx="110" cy="318" r="3" />
                    <circle cx="130" cy="321" r="3" /><circle cx="150" cy="322" r="3" />
                    <circle cx="170" cy="322" r="3" /><circle cx="190" cy="321" r="3" />
                    <circle cx="210" cy="318" r="3" /><circle cx="230" cy="314" r="3" />
                  </g>
                </g>

                {/* Top Cake Tier */}
                <g>
                  <path d="M 105 185 L 105 245 C 105 260 215 260 215 245 L 215 185 Z" fill="url(#cakeCream)" />
                  <ellipse cx="160" cy="185" rx="55" ry="11" fill="#FCEEF2" />
                  <path d="M 105 185 C 115 200 123 200 130 190 C 140 205 148 205 155 188 C 165 204 173 204 180 189 C 190 203 198 201 205 188 C 210 195 215 192 215 185 Z" fill="#EFAEBF" opacity="0.9" />
                </g>

                {/* Cream Rosettes */}
                <g>
                  <circle cx="120" cy="184" r="6" fill="#FFFDF9" stroke="#EFAEBF" strokeWidth="1"/>
                  <circle cx="140" cy="187" r="6" fill="#FFFDF9" stroke="#EFAEBF" strokeWidth="1"/>
                  <circle cx="160" cy="188" r="6" fill="#FFFDF9" stroke="#EFAEBF" strokeWidth="1"/>
                  <circle cx="180" cy="187" r="6" fill="#FFFDF9" stroke="#EFAEBF" strokeWidth="1"/>
                  <circle cx="200" cy="184" r="6" fill="#FFFDF9" stroke="#EFAEBF" strokeWidth="1"/>
                </g>

                {/* Candles Stems */}
                <g>
                  <rect x="157" y="140" width="6" height="42" rx="2" fill="#EFAEBF" stroke="#C98299" strokeWidth="0.8" />
                  <line x1="160" y1="140" x2="160" y2="134" stroke="#674A49" strokeWidth="1.5" strokeLinecap="round" />

                  <rect x="135" y="147" width="5" height="36" rx="2" fill="#F6C6B3" stroke="#D8B77E" strokeWidth="0.8" />
                  <line x1="137.5" y1="147" x2="137.5" y2="142" stroke="#674A49" strokeWidth="1.2" strokeLinecap="round" />

                  <rect x="180" y="147" width="5" height="36" rx="2" fill="#F6C6B3" stroke="#D8B77E" strokeWidth="0.8" />
                  <line x1="182.5" y1="147" x2="182.5" y2="142" stroke="#674A49" strokeWidth="1.2" strokeLinecap="round" />
                </g>

                {/* Dynamic Flames (Rendered only when lit) */}
                {candlesLit && (
                  <g className="animate-pulse">
                    <circle cx="160" cy="125" r="14" fill="url(#flameGlow)" />
                    <path d="M 160 118 Q 165 127 160 134 Q 155 127 160 118 Z" fill="#FFB703" />
                    <path d="M 160 123 Q 163 128 160 133 Q 157 128 160 123 Z" fill="#FFF8E7" />

                    <circle cx="137.5" cy="133" r="11" fill="url(#flameGlow)" />
                    <path d="M 137.5 127 Q 141.5 134 137.5 141 Q 133.5 134 137.5 127 Z" fill="#FFB703" />
                    <path d="M 137.5 131 Q 140 135 137.5 140 Q 135 135 137.5 131 Z" fill="#FFF8E7" />

                    <circle cx="182.5" cy="133" r="11" fill="url(#flameGlow)" />
                    <path d="M 182.5 127 Q 186.5 134 182.5 141 Q 178.5 134 182.5 127 Z" fill="#FFB703" />
                    <path d="M 182.5 131 Q 185 135 182.5 140 Q 180 135 182.5 131 Z" fill="#FFF8E7" />
                  </g>
                )}

                {/* 21 Topper */}
                <g transform="translate(160, 95) scale(0.85)">
                  <circle cx="0" cy="0" r="18" fill="#FFFDFB" stroke="#D8B77E" strokeWidth="1.5" />
                  <text x="0" y="6" fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="16" fill="#C98299" textAnchor="middle">21</text>
                </g>
              </svg>
            </div>

            {/* Extinguished subtle smoke when blown */}
            <AnimatePresence>
              {!candlesLit && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.8, 0], y: -30 }}
                  transition={{ duration: 1.5 }}
                  className="absolute top-[28%] left-1/2 -translate-x-1/2 text-sm font-quicksand text-[#674A49]/70 pointer-events-none"
                >
                  💨✨
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Make a Wish Button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            {candlesLit ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleMakeAWish}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C98299] to-[#A25B72] text-[#FFF9F5] font-quicksand text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-lg shadow-[#C98299]/30 border border-[#D8B77E]/60 flex items-center gap-2.5 cursor-pointer hover:brightness-105"
              >
                <Wand2 className="w-4 h-4 text-[#D8B77E]" />
                <span>{cfg.wishButtonText}</span>
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRelight}
                className="px-6 py-2.5 rounded-full bg-[#FFFDFB] text-[#674A49] font-quicksand text-xs font-bold tracking-widest uppercase border border-[#D8B77E] shadow-sm cursor-pointer"
              >
                Nyalakan Lilin Kembali ✨
              </motion.button>
            )}
          </div>
        </div>

        {/* Wish Revealed Card */}
        <AnimatePresence>
          {hasWished && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 w-full p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#D8B77E]/50 shadow-xl shadow-[#674A49]/8 text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F7DCE5] text-[#C98299] mb-3">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl text-[#674A49] font-medium mb-2">
                {cfg.wishedTitle}
              </h3>
              <p className="font-dmsans text-sm sm:text-base text-[#594745] leading-relaxed max-w-md mx-auto">
                {cfg.wishedMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

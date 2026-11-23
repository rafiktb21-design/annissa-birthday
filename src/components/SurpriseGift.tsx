import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Heart } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { audio } from '../utils/audio'

export default function SurpriseGift() {
  const [isOpen, setIsOpen] = useState(false)
  const cfg = websiteConfig.surpriseGift

  const handleOpenGift = () => {
    if (!isOpen) {
      audio.playSealBreak()
      audio.playSparkle()
      setIsOpen(true)
    }
  }

  return (
    <section id="gift" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden flex flex-col items-center text-center">
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

        {/* Section Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/50 text-[#674A49] mb-4">
          <Gift className="w-3.5 h-3.5 text-[#C98299]" />
          <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
            {cfg.heading}
          </span>
          <Gift className="w-3.5 h-3.5 text-[#C98299]" />
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl text-[#674A49] font-normal mb-2">
          Kado Kecil Untukmu
        </h2>

        <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] mb-8">
          "{cfg.subtitle}"
        </p>

        {/* Gift Box Container */}
        <div className="relative w-full max-w-md flex flex-col items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* CLOSED GIFT BOX */
              <motion.div
                key="closed-gift"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                onClick={handleOpenGift}
                className="group relative cursor-pointer flex flex-col items-center"
              >
                {/* 3D-styled SVG Gift Box */}
                <motion.div
                  whileHover={{ scale: 1.06, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-44 h-44 sm:w-52 sm:h-52 filter drop-shadow-xl"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFF0F5" />
                        <stop offset="60%" stop-color="#F7DCE5" />
                        <stop offset="100%" stop-color="#EFAEBF" />
                      </linearGradient>
                      <linearGradient id="ribbonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#D8B77E" />
                        <stop offset="50%" stop-color="#FCE1A8" />
                        <stop offset="100%" stop-color="#C5A063" />
                      </linearGradient>
                    </defs>

                    {/* Box Base */}
                    <rect x="40" y="80" width="120" height="95" rx="14" fill="url(#boxGrad)" stroke="#D8B77E" stroke-width="1.5" />
                    {/* Vertical Ribbon */}
                    <rect x="90" y="80" width="20" height="95" fill="url(#ribbonGrad2)" />

                    {/* Box Lid */}
                    <rect x="32" y="60" width="136" height="26" rx="8" fill="#FFFDFB" stroke="#D8B77E" stroke-width="1.5" />
                    <rect x="90" y="60" width="20" height="26" fill="url(#ribbonGrad2)" />

                    {/* Satin Bow on Top */}
                    <path d="M 100 60 C 80 40 65 35 70 52 C 75 62 95 60 100 60 Z" fill="url(#ribbonGrad2)" />
                    <path d="M 100 60 C 120 40 135 35 130 52 C 125 62 105 60 100 60 Z" fill="url(#ribbonGrad2)" />
                    {/* Center Knot Heart */}
                    <circle cx="100" cy="60" r="8" fill="#C98299" />
                  </svg>

                  {/* Sparkle badge */}
                  <div className="absolute -top-2 -right-2 p-2 rounded-full bg-[#FFFDFB] shadow-md border border-[#D8B77E]/50 animate-bounce">
                    <Sparkles className="w-4 h-4 text-[#D8B77E]" />
                  </div>
                </motion.div>

                <p className="mt-6 font-quicksand text-xs sm:text-sm font-bold tracking-widest text-[#674A49] uppercase bg-[#FFFDFB] px-5 py-1.5 rounded-full border border-[#D8B77E]/40 shadow-xs">
                  {cfg.boxHint}
                </p>
              </motion.div>
            ) : (
              /* OPENED GIFT MESSAGE */
              <motion.div
                key="opened-gift-message"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-3xl bg-[#FFFDFB] p-6 sm:p-8 border border-[#D8B77E]/50 shadow-xl text-center relative"
              >
                <div className="w-12 h-12 rounded-full bg-[#F7DCE5] text-[#C98299] flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 fill-current" />
                </div>

                <p className="font-playfair text-xl sm:text-2xl text-[#674A49] font-medium leading-relaxed mb-3">
                  "{cfg.message}"
                </p>

                <p className="font-dmsans text-xs sm:text-sm text-[#594745]/85 leading-relaxed max-w-sm mx-auto mb-6">
                  {cfg.indonesianMessage}
                </p>

                <div className="pt-4 border-t border-[#D8B77E]/30">
                  <p className="font-cormorant italic text-sm text-[#C98299]">
                    {cfg.fromNote}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

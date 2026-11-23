import React from 'react'
import { motion } from 'framer-motion'
import { Heart, RotateCcw } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { audio } from '../utils/audio'

interface FinalMessageProps {
  onReplay: () => void
}

export default function FinalMessage({ onReplay }: FinalMessageProps) {
  const cfg = websiteConfig.closingSection

  const handleReplayClick = () => {
    audio.playSparkle()
    onReplay()
  }

  return (
    <section id="closing" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden flex flex-col items-center text-center">
      {/* Background Floral Accents */}
      <div className="absolute top-0 left-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none opacity-40">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none opacity-40 scale-x-[-1]">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -bottom-10 -left-10 w-44 h-44 sm:w-60 sm:h-60 pointer-events-none opacity-40">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -bottom-10 -right-10 w-44 h-44 sm:w-60 sm:h-60 pointer-events-none opacity-40 scale-x-[-1]">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="site-container relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Top Watercolor Floral Crown */}
        <div className="w-44 h-16 pointer-events-none -mb-2 animate-float">
          <img src="/assets/flowers/watercolor-bouquet.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Heart Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="w-14 h-14 rounded-full bg-[#F7DCE5] border border-[#D8B77E]/60 flex items-center justify-center text-[#C98299] shadow-md mb-6"
        >
          <Heart className="w-7 h-7 fill-current animate-pulse" />
        </motion.div>

        {/* Heading: To More Beautiful Moments */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-playfair text-3xl sm:text-5xl text-[#674A49] font-normal mb-6"
        >
          {cfg.heading}
        </motion.h2>

        {/* Message body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg mx-auto space-y-4 mb-8"
        >
          <p className="font-cormorant text-xl sm:text-2xl text-[#674A49] leading-relaxed italic">
            "{cfg.message}"
          </p>

          <p className="font-dmsans text-xs sm:text-sm text-[#594745]/75 leading-relaxed">
            {cfg.englishQuote}
          </p>
        </motion.div>

        {/* Signature */}
        <div className="mb-12">
          <p className="font-cormorant italic text-lg sm:text-xl text-[#674A49] mb-1 font-medium">
            {cfg.closing}
          </p>
          <p className="font-vibes text-4xl sm:text-5xl text-[#C98299] tracking-wider">
            {cfg.signature}
          </p>
        </div>

        {/* Replay Invitation Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleReplayClick}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FFFDFB] text-[#674A49] font-quicksand text-xs sm:text-sm font-bold tracking-[0.2em] uppercase border border-[#D8B77E] shadow-md hover:bg-[#F7DCE5]/40 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#C98299]" />
          <span>{cfg.replayButtonText}</span>
        </motion.button>

        {/* Footer tiny text with safe bottom margin */}
        <div className="mt-14 pb-12 text-center text-xs font-dmsans text-[#594745]/60">
          <p>A Birthday Journey for Annissa Nur Fadilah • 21st Birthday</p>
          <p className="mt-1 font-quicksand text-[11px] text-[#C98299] font-semibold">Made with all my heart by Rafi</p>
        </div>
      </div>
    </section>
  )
}

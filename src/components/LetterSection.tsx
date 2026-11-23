import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { audio } from '../utils/audio'

export default function LetterSection() {
  const [isOpen, setIsOpen] = useState(false)
  const letter = websiteConfig.loveLetter

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      audio.playSealBreak()
      audio.playSparkle()
      setIsOpen(true)
    }
  }

  return (
    <section id="letter" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden flex flex-col items-center">
      {/* Soft Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#F7DCE5]/40 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="site-container relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Section Header */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/60 border border-[#D8B77E]/50 text-[#674A49] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
          <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
            Special Letter
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl text-[#674A49] font-normal mb-2">
          {letter.heading}
        </h2>

        <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] mb-8 sm:mb-12">
          "{letter.subtitle}"
        </p>

        {/* Envelope Container */}
        <div className="relative w-full max-w-[480px] min-h-[420px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* CLOSED ENVELOPE WITH WAX SEAL */
              <motion.div
                key="closed-envelope"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.5 }}
                onClick={handleOpenEnvelope}
                className="group relative w-full h-[290px] sm:h-[320px] rounded-3xl bg-[#FFF6F0] border-2 border-[#D8B77E]/50 shadow-xl shadow-[#674A49]/10 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Envelope Flap Triangles */}
                <div
                  className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#F7DCE5] to-[#FFF6F0] border-b border-[#D8B77E]/40"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />

                {/* Wax Seal Button in Center */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-md cursor-pointer animate-float"
                  >
                    <img
                      src="/assets/decorations/wax-seal.svg"
                      alt="Open Letter Wax Seal"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  <div className="mt-2 text-center">
                    <p className="font-quicksand text-xs sm:text-sm font-bold tracking-widest text-[#674A49] uppercase">
                      Ketuk Segel Lilin
                    </p>
                    <p className="font-cormorant italic text-sm text-[#C98299]">
                      Tap the wax seal to open
                    </p>
                  </div>
                </div>

                {/* Decorative Bottom Stamps */}
                <div className="absolute bottom-4 left-6 flex items-center gap-1.5 opacity-60">
                  <Heart className="w-4 h-4 text-[#C98299] fill-[#C98299]/30" />
                  <span className="font-quicksand text-[11px] font-bold text-[#674A49] tracking-widest">
                    FOR ANNISSA
                  </span>
                </div>

                <div className="absolute bottom-4 right-6 text-[11px] font-quicksand font-bold text-[#D8B77E] tracking-widest">
                  11.12.2026
                </div>
              </motion.div>
            ) : (
              /* OPENED LETTER PAPER SLIDING OUT */
              <motion.div
                key="opened-letter"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full rounded-3xl bg-[#FFFDFB] p-6 sm:p-10 border border-[#D8B77E]/50 shadow-2xl shadow-[#674A49]/12 text-left"
                style={{
                  backgroundImage: 'radial-gradient(#F7DCE5 0.75px, transparent 0.75px)',
                  backgroundSize: '16px 16px',
                }}
              >
                {/* Corner Floral Ornaments */}
                <img
                  src="/assets/flowers/floral-corner.svg"
                  alt=""
                  className="absolute top-2 left-2 w-16 h-16 pointer-events-none opacity-60"
                />
                <img
                  src="/assets/flowers/floral-corner.svg"
                  alt=""
                  className="absolute top-2 right-2 w-16 h-16 pointer-events-none opacity-60 scale-x-[-1]"
                />

                {/* Greeting */}
                <p className="font-playfair text-2xl sm:text-3xl font-medium text-[#674A49] mb-4">
                  {letter.greeting}
                </p>

                {/* Letter Body Paragraphs */}
                <div className="space-y-4 text-[#594745] font-dmsans text-sm sm:text-base leading-relaxed">
                  {letter.paragraphs.map((p, idx) => (
                    <p key={idx} className="font-normal text-[#594745]">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Closing and Handwritten Signature */}
                <div className="mt-8 pt-4 border-t border-[#D8B77E]/30 flex flex-col items-end">
                  <p className="font-cormorant italic text-base sm:text-lg text-[#674A49] mb-1 font-medium">
                    {letter.closing}
                  </p>
                  <p className="font-vibes text-3xl sm:text-4xl text-[#C98299] tracking-wider">
                    {letter.signature}
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

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, MailOpen } from 'lucide-react'
import { websiteConfig } from '../../data/websiteConfig'
import { audio } from '../../utils/audio'

export default function LetterSection() {
  const [isOpen, setIsOpen] = useState(false)
  const letter = websiteConfig.loveLetter

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      try {
        audio.playSealBreak()
        audio.playLetterOpen()
        audio.playSparkle()
      } catch {}
      setIsOpen(true)
    }
  }

  return (
    <section id="letter" className="relative w-full py-20 sm:py-24 md:py-28 bg-gradient-to-b from-[#FFF9F2] via-[#F4D9DE]/25 to-[#FFF9F2] overflow-hidden scroll-mt-20">
      <div className="max-w-[1200px] w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] mx-auto flex flex-col items-center">
        {/* Editorial Chapter Header — Centered */}
        <div className="max-w-3xl mx-auto px-6 text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="font-poppins text-xs uppercase tracking-[0.3em] text-[#D99AA8] font-semibold mb-3"
          >
            CHAPTER III &bull; WORDS FROM THE HEART
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, delay: 0.15 }}
            className="font-playfair text-3xl sm:text-5xl md:text-6xl text-[#49372F] font-normal tracking-tight mb-4"
          >
            A Letter <span className="italic font-normal text-[#D99AA8]">for You</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="font-cormorant text-lg sm:text-2xl text-[#49372F]/75 italic max-w-xl mx-auto"
          >
            Folded with heartfelt thoughts, sealed with care.
          </motion.p>
        </div>

        {/* Centered Main Stage */}
        <div className="w-full flex flex-col items-center justify-center">
          {!isOpen ? (
            /* STEP 1: LARGE CENTERED CLOSED ENVELOPE (520px - 600px width on desktop) */
            <div className="w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={handleOpenEnvelope}
                className="group relative cursor-pointer w-full max-w-[560px] aspect-[1.55/1] rounded-2xl bg-gradient-to-br from-[#FFF9F2] to-[#E8D4B8]/60 p-1 shadow-[0_25px_60px_-15px_rgba(73,55,47,0.18)] border border-[#E8D4B8] flex items-center justify-center transition-all duration-300"
              >
                {/* Envelope Triangular Fold Lines */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 500 322" preserveAspectRatio="none">
                    <path d="M0,0 L250,165 L500,0" fill="#FFF4E8" stroke="#E8D4B8" strokeWidth="1.5" />
                    <path d="M0,322 L205,145" stroke="#E8D4B8" strokeWidth="1" opacity="0.65" />
                    <path d="M500,322 L295,145" stroke="#E8D4B8" strokeWidth="1" opacity="0.65" />
                  </svg>
                </div>

                {/* Central Wax Seal */}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#D99AA8] via-[#C8788C] to-[#8E445B] shadow-[0_8px_20px_rgba(200,120,140,0.4)] border-2 border-[#FFF9F2]/70 flex items-center justify-center text-[#FFF9F2] group-hover:shadow-[0_12px_28px_rgba(200,120,140,0.6)] transition-shadow"
                  >
                    <Heart className="w-8 h-8 fill-[#FFF9F2] text-[#FFF9F2] animate-pulse" />
                  </motion.div>
                </div>

                {/* Corner Decorative Stamp */}
                <div className="absolute top-4 right-4 border border-dashed border-[#D99AA8]/70 px-2.5 py-1 rounded text-[10px] font-poppins uppercase tracking-widest text-[#D99AA8]">
                  Dec 11 &bull; 2026
                </div>
              </motion.div>

              {/* Centered Interaction Action Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 border border-[#E8D4B8] shadow-sm backdrop-blur-sm cursor-pointer hover:bg-white hover:shadow transition-all"
                onClick={handleOpenEnvelope}
              >
                <MailOpen className="w-4 h-4 text-[#D99AA8]" />
                <span className="font-poppins text-xs uppercase tracking-widest text-[#49372F] font-semibold">
                  Click to Open Letter
                </span>
              </motion.div>
            </div>
          ) : (
            /* STEP 2: OPENED UNFOLDED REALISTIC CREAM PARCHMENT LETTER — CENTERED */
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[640px] bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 md:p-14 border border-[#E8D4B8] shadow-[0_30px_90px_-20px_rgba(73,55,47,0.18)] mx-auto"
            >
              {/* Paper Grain & Edge Glow */}
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(#E8D4B8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

              {/* Header inside Letter */}
              <div className="flex items-center justify-between border-b border-[#E8D4B8]/70 pb-5 mb-8">
                <span className="font-vibes text-2xl sm:text-3xl text-[#D99AA8]">
                  For Annissa
                </span>
                <div className="flex items-center gap-1.5 text-[#E8D4B8]">
                  <Sparkles className="w-4 h-4 text-[#D99AA8]" />
                  <span className="font-poppins text-xs uppercase tracking-widest text-[#49372F]/60">
                    December 11, 2026
                  </span>
                </div>
              </div>

              {/* Greeting */}
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="font-playfair text-2xl sm:text-3xl text-[#49372F] font-normal mb-6"
              >
                {letter.greeting}
              </motion.h3>

              {/* Paragraphs */}
              <div className="space-y-5 mb-10">
                {letter.paragraphs.map((p, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08, duration: 0.5 }}
                    className="font-cormorant text-xl sm:text-2xl text-[#49372F]/90 leading-relaxed italic"
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* Closing & Handwritten Signature */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + letter.paragraphs.length * 0.08, duration: 0.6 }}
                className="pt-6 border-t border-[#E8D4B8]/60 flex flex-col items-end"
              >
                <p className="font-cormorant text-xl text-[#49372F]/80 italic mb-1.5">
                  {letter.closing}
                </p>
                <p className="font-vibes text-4xl sm:text-5xl text-[#D99AA8] tracking-wider">
                  {letter.signature}
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

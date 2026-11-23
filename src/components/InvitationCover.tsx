import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, MailOpen } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { audio } from '../utils/audio'

interface InvitationCoverProps {
  isOpen: boolean
  onOpen: () => void
}

export default function InvitationCover({ isOpen, onOpen }: InvitationCoverProps) {
  const [isOpening, setIsOpening] = useState(false)
  const cfg = websiteConfig.cover

  const handleOpenClick = () => {
    if (isOpening) return
    setIsOpening(true)
    audio.playSealBreak()
    audio.startBGM()

    setTimeout(() => {
      onOpen()
    }, 900)
  }

  if (isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="invitation-cover"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -40, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#FFF9F5] overflow-hidden select-none"
      >
        {/* Soft Background Gradient & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7DCE5]/70 via-[#FFF6F0] to-[#F7DCE5]/60 pointer-events-none" />

        {/* Floating Pastel Bokeh / Petals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${(i * 17) % 100}vw`,
                y: '105vh',
                scale: 0.6 + (i % 4) * 0.25,
                opacity: 0.35 + (i % 3) * 0.2,
              }}
              animate={{
                y: '-10vh',
                x: `${((i * 17) % 100) + Math.sin(i) * 12}vw`,
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 12 + (i % 5) * 3,
                repeat: Infinity,
                delay: (i * 0.7) % 5,
                ease: 'linear',
              }}
              className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-[#EFAEBF]/50 to-[#F6C6B3]/40 blur-[1px]"
            />
          ))}
        </div>

        {/* Envelope & Stationery Card Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] rounded-3xl bg-[#FFFDFB] shadow-2xl shadow-[#674A49]/15 border border-[#D8B77E]/40 overflow-hidden p-6 sm:p-8 text-center flex flex-col items-center justify-between min-h-[580px] sm:min-h-[640px]"
          style={{
            backgroundImage: 'radial-gradient(#F7DCE5 0.75px, transparent 0.75px)',
            backgroundSize: '16px 16px',
          }}
        >
          {/* Top Decorative Watercolor Bouquet */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none z-10">
            <img
              src="/assets/flowers/watercolor-bouquet.svg"
              alt=""
              className="w-full h-full object-contain filter drop-shadow-sm animate-float"
            />
          </div>

          {/* Decorative Corner Flowers */}
          <img
            src="/assets/flowers/floral-corner.svg"
            alt=""
            className="absolute -top-3 -left-3 w-20 h-20 pointer-events-none opacity-80"
          />
          <img
            src="/assets/flowers/floral-corner.svg"
            alt=""
            className="absolute -top-3 -right-3 w-20 h-20 pointer-events-none opacity-80 scale-x-[-1]"
          />
          <img
            src="/assets/flowers/floral-corner.svg"
            alt=""
            className="absolute -bottom-3 -left-3 w-16 h-16 pointer-events-none opacity-70 scale-y-[-1]"
          />
          <img
            src="/assets/flowers/floral-corner.svg"
            alt=""
            className="absolute -bottom-3 -right-3 w-16 h-16 pointer-events-none opacity-70 scale-[-1]"
          />

          {/* Top Badge: A LITTLE CELEBRATION */}
          <div className="relative pt-8 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/60 border border-[#D8B77E]/50 text-[#674A49] shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
              <span className="font-quicksand text-[11px] font-bold tracking-[0.25em] uppercase">
                {cfg.badge}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
            </motion.div>
          </div>

          {/* Central Recipient Card */}
          <div className="relative my-auto py-4 flex flex-col items-center justify-center">
            {/* Small decorative heart */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-8 h-px bg-[#D8B77E]/60" />
              <Heart className="w-3.5 h-3.5 text-[#C98299] fill-[#C98299]/30" />
              <span className="w-8 h-px bg-[#D8B77E]/60" />
            </div>

            <p className="font-cormorant text-base sm:text-lg tracking-[0.2em] text-[#674A49]/80 uppercase mb-1">
              {cfg.forText}
            </p>

            <h1 className="font-playfair text-4xl sm:text-5xl font-medium tracking-wide text-[#674A49] mb-1">
              {cfg.name}
            </h1>

            <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] tracking-wider mb-3">
              {cfg.fullName}
            </p>

            <div className="inline-block px-5 py-1.5 rounded-full bg-[#FFF6F0] border border-[#D8B77E]/40 mb-3 shadow-xs">
              <span className="font-quicksand text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#674A49]">
                {cfg.date}
              </span>
            </div>

            {/* Cute Cake Icon/Illustration */}
            <div className="w-20 h-20 my-1 animate-float">
              <img
                src="/assets/cake/cake-illustration.svg"
                alt="Birthday Cake"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>

            <p className="font-dmsans text-xs sm:text-sm text-[#594745]/80 max-w-[260px] mx-auto leading-relaxed mt-1">
              {cfg.subtitle}
            </p>
          </div>

          {/* Bottom Action: OPEN INVITATION BUTTON */}
          <div className="relative pb-2 w-full flex flex-col items-center">
            {/* Wax Seal / Envelope Accent */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative -mb-3 z-10 w-12 h-12 cursor-pointer filter drop-shadow-md"
              onClick={handleOpenClick}
            >
              <img
                src="/assets/decorations/wax-seal.svg"
                alt="Wax Seal"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenClick}
              disabled={isOpening}
              className="w-full max-w-[280px] pt-4 pb-3 px-6 rounded-2xl bg-gradient-to-r from-[#C98299] to-[#A25B72] text-[#FFF9F5] font-quicksand text-sm font-bold tracking-[0.18em] uppercase shadow-lg shadow-[#C98299]/30 border border-[#D8B77E]/60 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all hover:brightness-105"
            >
              <div className="flex items-center gap-2">
                <MailOpen className="w-4 h-4 text-[#FFF6F0]" />
                <span>{cfg.openButtonText}</span>
              </div>
              <span className="text-[10px] lowercase tracking-normal text-[#FFF6F0]/80 font-normal">
                {cfg.openButtonSubtext}
              </span>
            </motion.button>

            <p className="font-dmsans text-[11px] text-[#594745]/60 mt-3">
              {cfg.envelopeHint}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

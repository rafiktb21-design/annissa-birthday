import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X, RotateCcw, ArrowRight, Heart, Sparkles, Feather } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { audio } from '../utils/audio'

interface RomanticHandwrittenLetterProps {
  onClose: () => void
  onReadAgain: () => void
  onContinue: () => void
}

export default function RomanticHandwrittenLetter({
  onClose,
  onReadAgain,
  onContinue,
}: RomanticHandwrittenLetterProps) {
  const prefersReducedMotion = useReducedMotion()

  const fullText = useMemo(() => {
    return [
      websiteConfig.loveLetter.greeting,
      '',
      ...websiteConfig.loveLetter.paragraphs,
      '',
      websiteConfig.loveLetter.closing,
      websiteConfig.loveLetter.signature,
    ].join('\n')
  }, [])

  const [displayedLength, setDisplayedLength] = useState(prefersReducedMotion ? fullText.length : 0)
  const [isTypingComplete, setIsTypingComplete] = useState(Boolean(prefersReducedMotion))
  const typingTimerRef = useRef<number | null>(null)

  // Progressive handwriting reveal (skip if prefers reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedLength(fullText.length)
      setIsTypingComplete(true)
      return
    }

    let index = 0
    const total = fullText.length

    const typeNext = () => {
      index += 2 // 2 characters per tick for smooth calligraphy cadence
      if (index >= total) {
        setDisplayedLength(total)
        setIsTypingComplete(true)
      } else {
        setDisplayedLength(index)
        const char = fullText[index]
        const delay = char === '\n' ? 130 : char === '.' || char === ',' ? 85 : 18
        typingTimerRef.current = window.setTimeout(typeNext, delay)
      }
    }

    typingTimerRef.current = window.setTimeout(typeNext, 300)

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [fullText, prefersReducedMotion])

  // Instant reveal on user click
  const handleInstantReveal = () => {
    if (!isTypingComplete) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      setDisplayedLength(fullText.length)
      setIsTypingComplete(true)
      audio.playSparkle()
    }
  }

  const renderedText = fullText.slice(0, displayedLength)
  const lines = renderedText.split('\n')

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scaleY: 0.38, scaleX: 0.88, y: 40 }}
      animate={{ opacity: 1, scaleY: 1, scaleX: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scaleY: 0.35, scaleX: 0.88, y: 25 }}
      transition={{
        duration: prefersReducedMotion ? 0.25 : 0.75,
        ease: [0.16, 1, 0.3, 1], // luxury smooth unfold
      }}
      style={{ transformOrigin: 'top center' }}
      onClick={handleInstantReveal}
      className="relative max-w-3xl w-full mx-auto max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-12 md:p-16 shadow-[0_30px_90px_-20px_rgba(25,13,32,0.95),0_0_60px_rgba(214,177,110,0.3)] border-2 border-[#D6B16E]/40 pointer-events-auto cursor-pointer"
    >
      {/* 1. Background Ivory Paper Texture with Paper Shadows (#FFF4E4 -> #E8D4B6) */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-98"
        style={{
          background: `
            radial-gradient(ellipse at 50% 12%, #FFF4E4 0%, #FAF0E0 60%, #E8D4B6 100%)
          `,
          boxShadow: 'inset 0 0 45px rgba(232, 212, 182, 0.7)',
        }}
      />

      {/* 2. Micro Paper Fiber Grain Pattern */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-[0.038]"
        style={{
          backgroundImage: `radial-gradient(#49352F 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
        }}
      />

      {/* 3. Gold Filigree Border Inset */}
      <div className="absolute inset-3 sm:inset-5 rounded-2xl border border-[#D6B16E]/45 pointer-events-none" />
      <div className="absolute inset-4 sm:inset-6 rounded-2xl border border-[#D6B16E]/20 pointer-events-none" />

      {/* 4. Elegant Botanical Floral Corner Ornaments */}
      {/* Top-Left */}
      <div className="absolute top-5 left-5 text-[#D6B16E]/75 pointer-events-none">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4,4 Q18,4 24,18 Q4,20 4,4 Z" fill="currentColor" fillOpacity="0.12" />
          <path d="M4,4 Q4,18 18,24" />
          <circle cx="24" cy="18" r="2.2" fill="currentColor" />
          <circle cx="18" cy="24" r="2.2" fill="currentColor" />
          <path d="M8,8 Q14,9 15,15 Q9,14 8,8 Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Top-Right */}
      <div className="absolute top-5 right-5 text-[#D6B16E]/75 pointer-events-none -scale-x-100">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4,4 Q18,4 24,18 Q4,20 4,4 Z" fill="currentColor" fillOpacity="0.12" />
          <path d="M4,4 Q4,18 18,24" />
          <circle cx="24" cy="18" r="2.2" fill="currentColor" />
          <circle cx="18" cy="24" r="2.2" fill="currentColor" />
          <path d="M8,8 Q14,9 15,15 Q9,14 8,8 Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Bottom-Left */}
      <div className="absolute bottom-5 left-5 text-[#D6B16E]/75 pointer-events-none -scale-y-100">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4,4 Q18,4 24,18 Q4,20 4,4 Z" fill="currentColor" fillOpacity="0.12" />
          <path d="M4,4 Q4,18 18,24" />
          <circle cx="24" cy="18" r="2.2" fill="currentColor" />
          <circle cx="18" cy="24" r="2.2" fill="currentColor" />
          <path d="M8,8 Q14,9 15,15 Q9,14 8,8 Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Bottom-Right */}
      <div className="absolute bottom-5 right-5 text-[#D6B16E]/75 pointer-events-none -scale-x-100 -scale-y-100">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4,4 Q18,4 24,18 Q4,20 4,4 Z" fill="currentColor" fillOpacity="0.12" />
          <path d="M4,4 Q4,18 18,24" />
          <circle cx="24" cy="18" r="2.2" fill="currentColor" />
          <circle cx="18" cy="24" r="2.2" fill="currentColor" />
          <path d="M8,8 Q14,9 15,15 Q9,14 8,8 Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#49352F]/10 hover:bg-[#49352F]/20 flex items-center justify-center text-[#49352F] transition-colors cursor-pointer z-20"
        aria-label="Close letter"
        title="Fold letter back into envelope"
      >
        <X size={18} />
      </button>

      {/* Content Container (Layered above background textures) */}
      <div className="relative z-10">
        {/* Luxury Letterhead Emblem */}
        <div className="text-center mb-8 pb-4 border-b border-[#D6B16E]/40">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8D1938]/12 border border-[#8D1938]/25 text-[#8D1938] mb-3 shadow-inner">
            <Heart className="w-5 h-5 fill-[#8D1938]" />
          </div>
          <p className="font-vibes text-2xl sm:text-3xl text-[#8D1938] tracking-wide">
            A Letter From My Heart
          </p>
          <div className="flex items-center justify-center gap-3 mt-1 text-[#D6B16E]">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-[#D6B16E]" />
            <Feather className="w-3.5 h-3.5" />
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-[#D6B16E]" />
          </div>
        </div>

        {/* Editorial Handwritten Body Content (Espresso #49352F text) */}
        <div className="space-y-6 font-cormorant text-xl sm:text-2xl md:text-[1.65rem] leading-[2.1] text-[#49352F] px-2 sm:px-6">
          {lines.map((line, idx) => {
            const isGreeting = idx === 0
            const isClosing = line.startsWith('With all my love')
            const isSignature = line.startsWith('Rafi')

            if (isGreeting) {
              return (
                <p
                  key={idx}
                  className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl text-[#381827] mb-4"
                >
                  {line}
                </p>
              )
            }

            if (isClosing) {
              return (
                <div key={idx} className="pt-8 border-t border-[#D6B16E]/30 flex flex-col items-end">
                  <p className="font-vibes text-3xl sm:text-4xl md:text-5xl text-[#8D1938] mb-1">
                    {line}
                  </p>
                </div>
              )
            }

            if (isSignature) {
              return (
                <div key={idx} className="flex justify-end">
                  <p className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl text-[#381827] tracking-wider">
                    {line}
                  </p>
                </div>
              )
            }

            return (
              <p key={idx} className="italic text-[#49352F]/95">
                {line}
              </p>
            )
          })}

          {/* Golden Calligraphy Nib Cursor while typing */}
          {!isTypingComplete && (
            <span className="inline-block w-2.5 h-6 bg-[#D6B16E] animate-pulse ml-1 align-middle rounded-sm shadow-[0_0_8px_#D6B16E]" />
          )}
        </div>

        {/* Instant Reveal Tap Hint */}
        {!isTypingComplete && (
          <p className="text-center font-poppins text-xs text-[#8D1938]/70 mt-6 animate-pulse">
            ✦ Click anywhere on the letter to reveal full message ✦
          </p>
        )}

        {/* Footer Actions: Read Again & Continue to Celebration */}
        <div className="mt-10 pt-6 border-t border-[#D6B16E]/40 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReadAgain()
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#49352F]/8 hover:bg-[#49352F]/15 text-[#49352F] font-poppins text-xs tracking-wider uppercase font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8D1938]" />
            <span>Read Again</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onContinue()
            }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#8D1938] via-[#B65C83] to-[#8D1938] hover:from-[#6B1229] hover:to-[#8D1938] text-[#FFF4E4] font-poppins text-xs tracking-widest uppercase font-semibold shadow-xl shadow-[#8D1938]/30 border border-[#D6B16E]/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D6B16E]" />
            <span>See Birthday Surprise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

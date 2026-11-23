import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, KeyRound, Sparkles, Heart, Check, X, ArrowRight, Music } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { useCountdown } from '../hooks/useCountdown'
import { audio } from '../utils/audio'

interface CountdownLockScreenProps {
  onUnlock: () => void
}

// Secret access valid codes (case-insensitive)
const VALID_CODES = ['1112', 'rafi', 'annissa', '21']

export default function CountdownLockScreen({ onUnlock }: CountdownLockScreenProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(websiteConfig.targetIsoDate)
  const [showSecretModal, setShowSecretModal] = useState(false)
  const [secretCode, setSecretCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)

  // Auto-play music on first user touch / click (respecting browser autoplay policy)
  useEffect(() => {
    setIsPlayingMusic(audio.isBGMPlaying())
    const interval = setInterval(() => {
      setIsPlayingMusic(audio.isBGMPlaying())
    }, 800)

    const handleFirstInteraction = () => {
      if (!audio.isBGMPlaying()) {
        audio.startBGM()
        setIsPlayingMusic(true)
      }
    }

    window.addEventListener('click', handleFirstInteraction, { once: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true })

    return () => {
      clearInterval(interval)
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [])

  // Auto unlock if countdown has genuinely expired
  useEffect(() => {
    if (isExpired) {
      onUnlock()
    }
  }, [isExpired, onUnlock])

  // Check URL query parameter (e.g. ?code=1112 or ?unlock=true or ?pass=rafi)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const codeParam = params.get('code') || params.get('pass') || params.get('key')
    const unlockParam = params.get('unlock') || params.get('bypass')

    if (
      (codeParam && VALID_CODES.includes(codeParam.toLowerCase().trim())) ||
      unlockParam === 'true'
    ) {
      audio.playSparkle()
      onUnlock()
    }
  }, [onUnlock])

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = secretCode.toLowerCase().trim()

    if (VALID_CODES.includes(cleanCode)) {
      setIsSuccess(true)
      setErrorMessage('')
      audio.playSparkle()
      setTimeout(() => {
        onUnlock()
      }, 700)
    } else {
      setErrorMessage('Kode rahasia salah, coba lagi ya!')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  const units = [
    { label: 'Hari', en: 'Days', val: days },
    { label: 'Jam', en: 'Hours', val: hours },
    { label: 'Menit', en: 'Mins', val: minutes },
    { label: 'Detik', en: 'Secs', val: seconds },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#FFF9F5] overflow-hidden select-none">
      {/* Background soft pastel ambient & petals */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7DCE5]/70 via-[#FFF6F0] to-[#F7DCE5]/60 pointer-events-none" />

      {/* Floating Bokeh / Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
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
              duration: 14 + (i % 5) * 3,
              repeat: Infinity,
              delay: (i * 0.7) % 5,
              ease: 'linear',
            }}
            className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-[#EFAEBF]/50 to-[#F6C6B3]/40 blur-[1px]"
          />
        ))}
      </div>

      {/* Main Countdown Lock Card Container */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Top Tag: COUNTING DOWN */}
        <div className="relative pt-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/60 text-[#674A49] shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
            <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
              COUNTING DOWN
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
          </motion.div>
        </div>

        {/* Central Content & Live Countdown Ticker */}
        <div className="relative my-auto py-3 flex flex-col items-center justify-center w-full">
          {/* Small decorative heart */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-px bg-[#D8B77E]/60" />
            <Heart className="w-3.5 h-3.5 text-[#C98299] fill-[#C98299]/30" />
            <span className="w-8 h-px bg-[#D8B77E]/60" />
          </div>

          <p className="font-cormorant text-base sm:text-lg tracking-[0.2em] text-[#674A49]/80 uppercase mb-0.5">
            Menuju Hari Spesial
          </p>

          <h1 className="font-playfair text-3xl sm:text-4xl font-medium tracking-wide text-[#674A49] mb-1">
            ANNISSA
          </h1>

          <p className="font-cormorant italic text-base sm:text-lg text-[#C98299] tracking-wider mb-4">
            Annissa Nur Fadilah • 21st Birthday
          </p>

          {/* 4 Compact Countdown Cards */}
          <div className="w-full grid grid-cols-4 gap-2 sm:gap-2.5 max-w-[320px] mx-auto my-2">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-[#FFF6F0] border border-[#D8B77E]/50 shadow-sm"
              >
                <span className="font-playfair text-2xl sm:text-3xl font-bold text-[#674A49] leading-tight">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="font-quicksand text-[10px] font-bold text-[#C98299] uppercase tracking-wider mt-0.5">
                  {unit.label}
                </span>
                <span className="font-dmsans text-[8px] text-[#594745]/50">
                  {unit.en}
                </span>
              </div>
            ))}
          </div>

          <div className="inline-block mt-3 px-4 py-1 rounded-full bg-[#FFF6F0] border border-[#D8B77E]/40 shadow-xs">
            <span className="font-quicksand text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-[#674A49]">
              11 DECEMBER 2026
            </span>
          </div>

          <p className="font-dmsans text-xs text-[#594745]/75 max-w-[280px] mx-auto leading-relaxed mt-3.5">
            Undangan ini masih terkunci dan akan terbuka secara otomatis saat hari ulang tahunmu tiba ✨
          </p>
        </div>

        {/* Bottom Action: LOCKED BUTTON */}
        <div className="relative pb-2 w-full flex flex-col items-center">
          <div className="w-full py-4 px-6 rounded-2xl bg-[#F6C6B3]/35 border border-[#D8B77E]/60 text-[#674A49]/80 font-quicksand text-xs sm:text-sm font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-not-allowed shadow-inner">
            <Lock className="w-4 h-4 text-[#C98299]" />
            <span>BELUM WAKTUNYA DIBUKA</span>
          </div>

          <p className="mt-2 text-[11px] font-dmsans text-[#594745]/60 tracking-wide">
            Nantikan momen spesial 11 Desember 2026
          </p>
        </div>

        {/* POJOK BAWAH KANAN: Tombol Akses Khusus Rahasia */}
        <button
          onClick={() => {
            audio.playSparkle()
            setShowSecretModal(true)
          }}
          title="Akses Khusus"
          className="absolute bottom-2 right-2 p-2 rounded-full text-[#D8B77E] hover:text-[#C98299] hover:bg-[#F7DCE5]/40 transition-all cursor-pointer z-20 group"
        >
          <KeyRound className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>

      {/* MODAL POPUP: Masukkan Kode Rahasia Akses Khusus */}
      <AnimatePresence>
        {showSecretModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative w-full max-w-xs rounded-3xl bg-[#FFFDFB] border border-[#D8B77E] p-6 shadow-2xl text-center flex flex-col items-center"
            >
              <button
                onClick={() => setShowSecretModal(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full text-[#594745]/50 hover:bg-[#F7DCE5]/40 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#F7DCE5] border border-[#D8B77E]/60 flex items-center justify-center text-[#C98299] mb-3 shadow-xs">
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="font-playfair text-xl text-[#674A49] font-semibold mb-1">
                Akses Khusus
              </h3>

              <p className="font-dmsans text-xs text-[#594745]/70 mb-4">
                Masukkan kode rahasia untuk membuka dan mengecek undangan sekarang:
              </p>

              <form onSubmit={handleSecretSubmit} className="w-full flex flex-col gap-3">
                <input
                  type="password"
                  autoFocus
                  placeholder="Masukkan kode rahasia..."
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#D8B77E]/50 font-dmsans text-sm text-center text-[#594745] placeholder-[#594745]/40 focus:outline-none focus:border-[#C98299]"
                />

                {errorMessage && (
                  <p className="font-quicksand text-xs text-rose-500 font-bold">
                    {errorMessage}
                  </p>
                )}

                {isSuccess && (
                  <p className="font-quicksand text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Kode benar! Membuka...
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSuccess}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C98299] to-[#A25B72] text-[#FFF9F5] font-quicksand text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105"
                >
                  <span>Buka Akses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

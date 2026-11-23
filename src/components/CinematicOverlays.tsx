import { useState } from 'react'
import { websiteConfig } from '../data/websiteConfig'
import type { MemoryItem } from '../data/websiteConfig'
import { Sparkles, Heart, X, Cake, Flame, Mic, MicOff, Wind, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RomanticHandwrittenLetter from './RomanticHandwrittenLetter'

interface CinematicOverlaysProps {
  progress: number
  onStartJourney: () => void
  onReplayJourney: () => void
  selectedMemory: MemoryItem | null
  onSelectMemory?: (item: MemoryItem | null) => void
  onCloseMemory: () => void
  isLetterOpen: boolean
  onToggleLetter: () => void
  onContinueToCelebration?: () => void
  candlesLit: boolean
  onBlowCandles: () => void
  hasWished: boolean
  isBlowing?: boolean
  micEnabled?: boolean
  onToggleMic?: () => void
  micError?: string | null
}

// Smooth bell curve opacity for scroll intervals
function getSceneOpacity(progress: number, start: number, peakStart: number, peakEnd: number, end: number): number {
  if (progress < start || progress > end) return 0
  if (progress >= peakStart && progress <= peakEnd) return 1
  if (progress < peakStart) return (progress - start) / (peakStart - start)
  return 1 - (progress - peakEnd) / (end - peakEnd)
}

export default function CinematicOverlays({
  progress,
  onStartJourney,
  onReplayJourney,
  selectedMemory,
  onSelectMemory,
  onCloseMemory,
  isLetterOpen,
  onToggleLetter,
  onContinueToCelebration,
  candlesLit,
  onBlowCandles,
  hasWished,
  isBlowing = false,
  micEnabled = false,
  onToggleMic,
  micError,
}: CinematicOverlaysProps) {
  const [letterReadCount, setLetterReadCount] = useState(0)

  // 5 distinct scene opacities matching 5-scene narrative:
  // Scene 1: Entrance (0.00 - 0.16)
  // Scene 2: Birthday Celebration & Cake (0.18 - 0.42)
  // Scene 3: Our Little Memories (0.44 - 0.65)
  // Scene 4: The Love Letter (0.66 - 0.86)
  // Scene 5: Final Birthday Surprise (0.87 - 1.00)
  const introOpacity = getSceneOpacity(progress, 0.0, 0.0, 0.12, 0.17)
  const birthdayOpacity = getSceneOpacity(progress, 0.19, 0.25, 0.38, 0.43)
  const memoriesOpacity = getSceneOpacity(progress, 0.44, 0.50, 0.60, 0.65)
  const letterOpacity = getSceneOpacity(progress, 0.66, 0.72, 0.82, 0.86)
  const endingOpacity = getSceneOpacity(progress, 0.87, 0.92, 1.0, 1.0)

  // Memory gallery navigation
  const memoryIndex = selectedMemory ? websiteConfig.memories.findIndex((m) => m.id === selectedMemory.id) : -1
  const handlePrevMemory = () => {
    if (!onSelectMemory || memoryIndex === -1) return
    const prevIdx = (memoryIndex - 1 + websiteConfig.memories.length) % websiteConfig.memories.length
    onSelectMemory(websiteConfig.memories[prevIdx])
  }
  const handleNextMemory = () => {
    if (!onSelectMemory || memoryIndex === -1) return
    const nextIdx = (memoryIndex + 1) % websiteConfig.memories.length
    onSelectMemory(websiteConfig.memories[nextIdx])
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-20 text-[#381827]">
      {/* ================= SCENE 1 — THE MAGICAL ENTRANCE ================= */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{
          opacity: introOpacity,
          pointerEvents: introOpacity > 0.4 ? 'auto' : 'none',
        }}
      >
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge: To Someone Special */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-[#F8B8CC]/60 backdrop-blur-md mb-6 shadow-lg shadow-[#E989AC]/15"
          >
            <Sparkles className="w-4 h-4 text-[#F5D58A] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-vibes text-2xl md:text-3xl text-[#E989AC]">
              {websiteConfig.introTitle}
            </span>
            <Sparkles className="w-4 h-4 text-[#F5D58A] animate-spin" style={{ animationDuration: '6s' }} />
          </motion.div>

          {/* Name: ANISSA NUR FADILAH */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-[1.1] bg-gradient-to-r from-[#D96B90] via-[#E989AC] to-[#F29F80] bg-clip-text text-transparent drop-shadow-[0_4px_28px_rgba(233,137,172,0.4)]"
          >
            {websiteConfig.recipientName}
          </motion.h1>

          <div className="w-32 h-0.5 mx-auto mb-6 bg-gradient-to-r from-transparent via-[#F5D58A] to-transparent" />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.55 }}
            className="font-poppins text-[#5C3D49] text-base sm:text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed font-medium drop-shadow-sm"
          >
            {websiteConfig.introSubtitle}
          </motion.p>

          {/* Button: START OUR JOURNEY */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartJourney}
            className="group relative inline-flex items-center gap-3 px-10 py-4 sm:px-14 sm:py-5 font-poppins text-xs sm:text-sm tracking-[0.25em] uppercase text-[#381827] rounded-full cursor-pointer shadow-xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #FFF4E8 0%, #FFC9A8 50%, #F8B8CC 100%)',
              border: '1.5px solid #F5D58A',
              boxShadow: '0 10px 30px rgba(233, 137, 172, 0.35)',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#E989AC]" />
            <span className="relative z-10 font-bold tracking-widest text-[#381827]">START OUR JOURNEY</span>
            <Sparkles className="w-4 h-4 text-[#E989AC]" />
          </motion.button>

          <div className="mt-8 flex items-center justify-center gap-2 text-[#704856]/80 text-xs font-poppins font-medium">
            <span className="animate-bounce">↓</span>
            <span>scroll or drag down to explore</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </motion.div>

      {/* ================= SCENE 2 — THE BIRTHDAY CELEBRATION & CANDLE BLOWING ================= */}
      <div
        className="absolute inset-0 flex flex-col justify-between py-8 sm:py-12 px-6 pointer-events-none"
        style={{
          opacity: birthdayOpacity,
          pointerEvents: birthdayOpacity > 0.4 ? 'auto' : 'none',
        }}
      >
        {/* Top Header Floating Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#D9B77E]/60 backdrop-blur-md mb-3 shadow-md shadow-[#D9B77E]/15">
            <Cake className="w-3.5 h-3.5 text-[#D9B77E]" />
            <span className="font-poppins text-[11px] uppercase tracking-widest font-bold text-[#381827]">
              {websiteConfig.birthdayDate}
            </span>
          </div>

          {/* Grand Header: HAPPY BIRTHDAY, ANISSA! */}
          <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-[#D96B90] via-[#E99BB7] to-[#D9B77E] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(233,155,183,0.35)]">
            HAPPY BIRTHDAY, ANISSA!
          </h2>

          {/* Subtitle / Post-blow message */}
          {hasWished ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="font-vibes text-3xl sm:text-4xl md:text-5xl text-[#E99BB7] mt-2 drop-shadow-sm animate-pulse"
            >
              Make a wish, beautiful! ✨💖
            </motion.p>
          ) : (
            <p className="font-poppins text-[#704856] text-xs sm:text-sm md:text-base mt-2 max-w-md mx-auto leading-relaxed font-medium">
              {websiteConfig.birthdaySubtitle}
            </p>
          )}
        </motion.div>

        {/* Center Space is kept clear to frame the 3D rotating banquet cake centerpiece */}
        <div className="flex-1 min-h-[160px] sm:min-h-[220px]" />

        {/* Bottom Interaction Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="flex flex-col items-center gap-3 max-w-xl mx-auto"
        >
          {/* Wind Blowing breath feedback */}
          {isBlowing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border border-[#F4B6C8] shadow-lg backdrop-blur-md text-[#D96B90] text-xs font-poppins font-bold"
            >
              <Wind className="w-4 h-4 text-[#E99BB7] animate-spin" />
              <span>Blowing out candles gently... 💨</span>
            </motion.div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Primary Action Button: 🎂 BLOW THE CANDLES! */}
            <button
              onClick={onBlowCandles}
              disabled={isBlowing}
              className={`group relative inline-flex items-center gap-2.5 px-8 py-3.5 sm:px-11 sm:py-4 rounded-full font-poppins text-xs sm:text-sm tracking-wider uppercase font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer border border-[#D9B77E] ${
                candlesLit
                  ? 'bg-gradient-to-r from-[#D9B77E] via-[#FFD6BA] to-[#F4B6C8] text-[#381827] shadow-[#D9B77E]/40 hover:shadow-[#D9B77E]/60'
                  : 'bg-gradient-to-r from-[#E99BB7] to-[#F4B6C8] text-white shadow-[#E99BB7]/30'
              }`}
            >
              {candlesLit ? (
                <>
                  <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>🎂 BLOW THE CANDLES!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D9B77E] animate-spin" />
                  <span>Relight Candles 🔥</span>
                </>
              )}
            </button>

            {/* Optional Microphone Detection Button */}
            {candlesLit && onToggleMic && (
              <button
                onClick={onToggleMic}
                disabled={isBlowing}
                className={`inline-flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-poppins text-xs tracking-wider uppercase font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer border ${
                  micEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-800 backdrop-blur-md animate-pulse'
                    : 'bg-white/75 border-[#D9B77E]/40 text-[#5C3D49] hover:bg-white/95 backdrop-blur-md'
                }`}
                title={micEnabled ? 'Listening for blow sound...' : 'Click to enable microphone and blow for real'}
              >
                {micEnabled ? (
                  <>
                    <Mic className="w-4 h-4 text-emerald-600 animate-bounce" />
                    <span>Mic Listening (Blow now!)</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4 text-[#A984A5]" />
                    <span>Blow with Mic</span>
                  </>
                )}
              </button>
            )}
          </div>

          {micError && (
            <p className="text-[11px] font-poppins text-rose-500/90 font-medium">
              {micError}
            </p>
          )}

          {hasWished && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-vibes text-2xl sm:text-3xl text-[#D96B90] mt-1 text-center drop-shadow-sm"
            >
              {websiteConfig.wishedMessage}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* ================= SCENE 3 — OUR LITTLE MEMORIES ================= */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 pointer-events-none"
        style={{
          opacity: memoriesOpacity,
          pointerEvents: memoriesOpacity > 0.4 ? 'auto' : 'none',
        }}
      >
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-[#F8B8CC]/50 backdrop-blur-md mb-3 shadow-md">
            <Heart className="w-4 h-4 text-[#E989AC] fill-[#E989AC]" />
            <span className="font-vibes text-2xl text-[#E989AC]">Special Moments</span>
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#381827] font-bold tracking-tight">
            {websiteConfig.memoriesHeading}
          </h2>
          <p className="font-poppins text-[#704856] text-sm md:text-base mt-2 max-w-md mx-auto font-medium">
            {websiteConfig.memoriesSubtitle}
          </p>
          <p className="font-poppins text-[#E989AC] text-xs mt-3 font-semibold animate-pulse">
            ✦ Click on any floating 3D Polaroid to open the memory ✦
          </p>
        </div>
      </div>

      {/* Cinematic Memory Modal with Next & Previous Navigation */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#381827]/40 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-xl w-full bg-[#FFF4E8] border-2 border-[#F5D58A]/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(233,137,172,0.4)] overflow-hidden"
            >
              <button
                onClick={onCloseMemory}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#381827]/10 hover:bg-[#381827]/20 flex items-center justify-center text-[#381827] transition-colors cursor-pointer"
                aria-label="Close memory modal"
              >
                <X size={18} />
              </button>

              <div className="rounded-2xl overflow-hidden border border-[#F8B8CC]/40 shadow-md mb-6 bg-white/60">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-poppins text-[#E989AC] mb-2 font-semibold">
                <span>{selectedMemory.date}</span>
                {selectedMemory.location && <span>📍 {selectedMemory.location}</span>}
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl text-[#381827] font-bold mb-3">
                {selectedMemory.title}
              </h3>

              <p className="font-cormorant text-xl sm:text-2xl text-[#49352F] italic leading-relaxed">
                &ldquo;{selectedMemory.caption}&rdquo;
              </p>

              {/* Navigation Controls: Previous, Counter, Next, Close */}
              <div className="mt-6 pt-4 border-t border-[#D6B16E]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMemory}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-[#381827] text-xs font-poppins font-medium border border-[#D6B16E]/40 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Previous memory"
                  >
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                  </button>
                  <span className="text-xs font-poppins text-[#704856] px-2 font-semibold">
                    {memoryIndex >= 0 ? `${memoryIndex + 1} / ${websiteConfig.memories.length}` : ''}
                  </span>
                  <button
                    onClick={handleNextMemory}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-[#381827] text-xs font-poppins font-medium border border-[#D6B16E]/40 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Next memory"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button
                  onClick={onCloseMemory}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FFC9A8] to-[#F8B8CC] border border-[#F5D58A] text-[#381827] text-xs font-poppins font-semibold tracking-wider uppercase shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SCENE 4 — THE LOVE LETTER ================= */}
      <div
        className="absolute inset-0 flex flex-col justify-between items-center py-10 px-6"
        style={{
          opacity: letterOpacity,
          pointerEvents: letterOpacity > 0.4 ? 'auto' : 'none',
        }}
      >
        <AnimatePresence mode="wait">
          {!isLetterOpen ? (
            <motion.div
              key="envelope-ambient-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-between items-center pointer-events-none"
            >
              {/* Header Text Above the 3D Envelope */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center pt-2 sm:pt-6"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-[#F8B8CC]/50 backdrop-blur-md mb-3 shadow-md">
                  <Heart className="w-4 h-4 text-[#8D1938] fill-[#8D1938]\" />
                  <span className="font-vibes text-2xl text-[#8D1938]">From My Heart</span>
                </div>
                <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#381827] font-bold tracking-tight">
                  A Letter Just For You
                </h2>
              </motion.div>

              {/* Interactive Prompt Below the 3D Envelope */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center pb-4 sm:pb-8 flex flex-col items-center pointer-events-auto"
              >
                <p className="font-cormorant text-xl sm:text-2xl text-[#49352F] italic mb-4 max-w-md drop-shadow-sm font-semibold">
                  &ldquo;There's something special I want you to read...&rdquo;
                </p>

                <button
                  onClick={onToggleLetter}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#8D1938] via-[#E989AC] to-[#8D1938] text-[#FFF4E8] font-poppins text-xs sm:text-sm tracking-widest uppercase font-semibold shadow-2xl shadow-[#8D1938]/30 border border-[#F5D58A]/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="w-3 h-3 rounded-full bg-[#F5D58A] animate-ping" />
                  <span>Click the wax seal to open your letter 💌</span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="letter-modal-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#381827]/40 backdrop-blur-md pointer-events-auto"
            >
              <RomanticHandwrittenLetter
                key={letterReadCount}
                onClose={onToggleLetter}
                onReadAgain={() => setLetterReadCount((c) => c + 1)}
                onContinue={() => {
                  if (onContinueToCelebration) onContinueToCelebration()
                  else onToggleLetter()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= SCENE 5 — FINAL BIRTHDAY SURPRISE ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{
          opacity: endingOpacity,
          pointerEvents: endingOpacity > 0.4 ? 'auto' : 'none',
        }}
      >
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-vibes text-3xl sm:text-4xl md:text-5xl text-[#E989AC] mb-4 animate-pulse drop-shadow-sm">
            {websiteConfig.finalSubtitle}
          </p>

          <h2
            className="font-playfair text-6xl sm:text-8xl md:text-9xl font-bold mb-6 tracking-tight bg-gradient-to-r from-[#E989AC] via-[#F8B8CC] to-[#FFC9A8] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(233,137,172,0.45)]"
          >
            {websiteConfig.finalMessage}
          </h2>

          <div className="w-44 h-0.5 mx-auto mb-6 bg-gradient-to-r from-transparent via-[#F5D58A] to-transparent" />

          <p className="font-poppins text-[#704856] text-sm sm:text-base md:text-lg mb-12 tracking-wider font-semibold">
            {websiteConfig.signatureText}
          </p>

          <button
            onClick={onReplayJourney}
            className="group relative inline-flex items-center gap-3 px-10 py-4 sm:px-14 sm:py-5 font-poppins text-xs sm:text-sm tracking-[0.25em] uppercase text-[#381827] rounded-full transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FFF4E8 0%, #FFC9A8 50%, #F8B8CC 100%)',
              border: '1.5px solid #F5D58A',
              boxShadow: '0 10px 30px rgba(233, 137, 172, 0.4)',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#E989AC]" />
            <span className="relative z-10 font-bold">{websiteConfig.replayButtonText}</span>
            <Sparkles className="w-4 h-4 text-[#E989AC]" />
          </button>
        </div>
      </div>
    </div>
  )
}

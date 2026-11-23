import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronLeft, ChevronRight, MapPin, Calendar, ZoomIn } from 'lucide-react'
import { websiteConfig, type MemoryItem } from '../data/websiteConfig'

export default function MemoriesGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const memories = websiteConfig.memories

  const handleOpen = (idx: number) => {
    setSelectedIdx(idx)
  }

  const handleClose = () => {
    setSelectedIdx(null)
  }

  const handlePrev = useCallback(() => {
    setSelectedIdx((prev) => (prev === null ? null : (prev - 1 + memories.length) % memories.length))
  }, [memories.length])

  const handleNext = useCallback(() => {
    setSelectedIdx((prev) => (prev === null ? null : (prev + 1) % memories.length))
  }, [memories.length])

  // Keyboard navigation (Esc, ArrowLeft, ArrowRight)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIdx, handlePrev, handleNext])

  return (
    <section id="memories" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF6F0] overflow-hidden">
      {/* Background Soft Texture */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#FFF9F5]/40 to-[#F7DCE5]/20 pointer-events-none" />

      <div className="site-container relative z-10 max-w-[1100px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/50 text-[#674A49] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
            <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
              Scrapbook Album
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-[#674A49] font-normal mb-3">
            {websiteConfig.memoriesHeading}
          </h2>

          <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] mb-1">
            "{websiteConfig.memoriesSubtitle}"
          </p>

          <p className="font-dmsans text-xs sm:text-sm text-[#594745]/70">
            {websiteConfig.memoriesEnglishSubtitle}
          </p>
        </div>

        {/* Polaroid Scrapbook Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 justify-items-center">
          {memories.map((mem, idx) => {
            const rot = mem.rotation ?? (idx % 2 === 0 ? -1.5 : 1.5)
            return (
              <motion.div
                key={mem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
                style={{ rotate: `${rot}deg` }}
                onClick={() => handleOpen(idx)}
                className="group relative w-full max-w-[320px] bg-[#FFFDFB] p-4 pb-6 rounded-2xl shadow-md hover:shadow-xl shadow-[#674A49]/10 border border-[#D8B77E]/30 cursor-pointer transition-all duration-300"
              >
                {/* Washi Tape on top */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 z-10 pointer-events-none opacity-90 drop-shadow-xs">
                  <img src="/assets/decorations/washi-tape.svg" alt="" className="w-full h-full object-contain" />
                </div>

                {/* Photo container */}
                <div className="relative w-full aspect-[4/4.5] rounded-xl overflow-hidden bg-[#F7DCE5]/30 mb-4">
                  <img
                    src={mem.image}
                    alt={mem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-[#674A49]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/90 text-[#674A49] shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Caption & Info */}
                <div className="text-left px-1">
                  <div className="flex items-center justify-between text-[11px] font-quicksand font-semibold text-[#C98299] mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {mem.date}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 text-[#594745]/60">
                        <MapPin className="w-3 h-3" />
                        {mem.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-playfair text-lg text-[#674A49] font-medium leading-snug mb-1">
                    {mem.title}
                  </h3>

                  <p className="font-dmsans text-xs text-[#594745]/80 line-clamp-2 leading-relaxed">
                    {mem.caption}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#674A49]/80 backdrop-blur-md p-4 sm:p-6"
            onClick={handleClose}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-3 rounded-full bg-white/90 text-[#674A49] shadow-lg hover:bg-white cursor-pointer transition-transform hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-white/80 text-[#674A49] shadow-lg hover:bg-white cursor-pointer transition-transform hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-white/80 text-[#674A49] shadow-lg hover:bg-white cursor-pointer transition-transform hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Card Content inside Lightbox */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-lg w-full bg-[#FFFDFB] rounded-3xl p-4 sm:p-6 shadow-2xl border border-[#D8B77E]/40 overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden bg-[#F7DCE5]/40 mb-4 max-h-[58vh]">
                <img
                  src={memories[selectedIdx].image}
                  alt={memories[selectedIdx].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="px-1 text-center">
                <div className="flex items-center justify-center gap-3 text-xs font-quicksand font-bold text-[#C98299] mb-1">
                  <span>{memories[selectedIdx].date}</span>
                  {memories[selectedIdx].location && (
                    <>
                      <span>•</span>
                      <span>{memories[selectedIdx].location}</span>
                    </>
                  )}
                </div>

                <h3 className="font-playfair text-xl sm:text-2xl text-[#674A49] font-medium mb-2">
                  {memories[selectedIdx].title}
                </h3>

                <p className="font-dmsans text-xs sm:text-sm text-[#594745]/90 leading-relaxed max-w-md mx-auto">
                  {memories[selectedIdx].caption}
                </p>

                <div className="mt-3 text-[11px] font-quicksand text-[#674A49]/50">
                  {selectedIdx + 1} / {memories.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Maximize2 } from 'lucide-react'
import { websiteConfig, type MemoryItem } from '../../data/websiteConfig'
import { audio } from '../../utils/audio'

export default function MemoriesSection() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const memories = websiteConfig.memories

  const handleOpen = (idx: number) => {
    audio.playSparkle()
    setSelectedIdx(idx)
  }

  const handleClose = useCallback(() => {
    setSelectedIdx(null)
  }, [])

  const handlePrev = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev - 1 + memories.length) % memories.length : null))
  }, [memories.length])

  const handleNext = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % memories.length : null))
  }, [memories.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIdx, handleClose, handlePrev, handleNext])

  return (
    <section id="memories" className="relative w-full py-20 sm:py-24 md:py-28 bg-[#FFF9F2] overflow-hidden scroll-mt-20">
      {/* Editorial Chapter Header — Centered */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="font-poppins text-xs uppercase tracking-[0.3em] text-[#D99AA8] font-semibold mb-3"
        >
          CHAPTER II &bull; MEMORIES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.0, delay: 0.15 }}
          className="font-playfair text-3xl sm:text-5xl md:text-6xl text-[#49372F] font-normal tracking-tight mb-4"
        >
          {websiteConfig.memoriesHeading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="font-cormorant text-lg sm:text-2xl text-[#49372F]/80 italic max-w-xl mx-auto"
        >
          {websiteConfig.memoriesSubtitle}
        </motion.p>
      </div>

      {/* Symmetrical Master Grid Container: 3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile */}
      <div className="max-w-[1200px] w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full">
          {memories.map((mem: MemoryItem, idx: number) => (
            <motion.article
              key={mem.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, delay: (idx % 3) * 0.1 }}
              onClick={() => handleOpen(idx)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#E8D4B8]/70 p-4 sm:p-5 shadow-[0_8px_30px_-10px_rgba(73,55,47,0.06)] hover:shadow-[0_18px_45px_-10px_rgba(217,154,168,0.22)] transition-all duration-300 flex flex-col justify-between w-full min-w-0"
            >
              {/* 1. Large Photograph with consistent 4:3 aspect ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#FFF9F2] mb-4">
                <img
                  src={mem.image}
                  alt={mem.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#49372F]/0 group-hover:bg-[#49372F]/15 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 rounded-full bg-white/95 text-[#49372F] shadow-md">
                    <Maximize2 className="w-4 h-4 text-[#D99AA8]" />
                  </div>
                </div>
              </div>

              {/* 2 & 3 & 4. Editorial Content */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  {/* Date & Location Metadata */}
                  <div className="flex items-center justify-between text-[11px] font-poppins uppercase tracking-wider text-[#9BAE91] font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#D99AA8]" />
                      {mem.date}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 text-[#D99AA8]">
                        <MapPin className="w-3 h-3" />
                        {mem.location}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-playfair text-xl sm:text-2xl text-[#49372F] font-normal leading-snug mb-2 group-hover:text-[#D99AA8] transition-colors">
                    {mem.title}
                  </h3>

                  {/* Caption / Description */}
                  <p className="font-cormorant text-base sm:text-lg text-[#49372F]/80 leading-relaxed italic line-clamp-3">
                    &ldquo;{mem.caption}&rdquo;
                  </p>
                </div>

                {/* 5 & 6. Footer: Memory Number & View Snapshot Action */}
                <div className="pt-4 mt-4 border-t border-[#F5ECE1] flex items-center justify-between">
                  <span className="font-vibes text-xl text-[#D99AA8]">
                    Memory 0{idx + 1}
                  </span>
                  <span className="text-xs font-poppins font-medium text-[#49372F]/60 group-hover:text-[#49372F] transition-colors">
                    View snapshot &rarr;
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#49372F]/80 backdrop-blur-md p-4 sm:p-6"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8D4B8] flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Close photo preview"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#49372F] hover:bg-[#D99AA8] hover:text-white transition-all shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image View */}
              <div className="relative md:w-3/5 bg-black/5 flex items-center justify-center p-4 sm:p-8 min-h-[300px]">
                <img
                  src={memories[selectedIdx].image}
                  alt={memories[selectedIdx].title}
                  className="w-full h-auto max-h-[65vh] object-contain rounded-xl shadow-md"
                />

                {/* Prev / Next on Image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  aria-label="Previous photograph"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#49372F] shadow transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  aria-label="Next photograph"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#49372F] shadow transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Memory Story Editorial Sidebar */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-poppins text-xs uppercase tracking-widest text-[#D99AA8] font-semibold">
                      Memory 0{selectedIdx + 1} of 0{memories.length}
                    </span>
                  </div>
                  <h3 className="font-playfair text-2xl sm:text-3xl text-[#49372F] font-normal leading-tight mb-3">
                    {memories[selectedIdx].title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-poppins text-[#49372F]/60 mb-6 pb-4 border-b border-[#E8D4B8]/60">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D99AA8]" />
                      {memories[selectedIdx].date}
                    </span>
                    {memories[selectedIdx].location && (
                      <span className="flex items-center gap-1.5 text-[#D99AA8]">
                        <MapPin className="w-3.5 h-3.5" />
                        {memories[selectedIdx].location}
                      </span>
                    )}
                  </div>
                  <p className="font-cormorant text-xl text-[#49372F]/90 leading-relaxed italic">
                    &ldquo;{memories[selectedIdx].caption}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E8D4B8]/60 flex items-center justify-between text-xs font-poppins text-[#49372F]/60">
                  <span>Use arrow keys to navigate</span>
                  <span className="font-medium text-[#D99AA8]">A Journey for Annisa</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

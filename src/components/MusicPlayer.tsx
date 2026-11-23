import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Disc3, VolumeX } from 'lucide-react'
import { audio } from '../utils/audio'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsPlaying(audio.isBGMPlaying())
    const interval = setInterval(() => {
      setIsPlaying(audio.isBGMPlaying())
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newState = audio.toggleBGM()
    setIsPlaying(newState)
  }

  return (
    <div className="fixed top-4 right-4 z-70 pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggle}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-md border border-[#D8B77E]/60 flex items-center justify-center cursor-pointer transition-all ${
          isPlaying
            ? 'bg-[#FFFDFB] text-[#C98299] shadow-[#C98299]/25 ring-2 ring-[#F7DCE5]'
            : 'bg-[#FFFDFB]/90 text-[#674A49]/60 hover:text-[#674A49]'
        }`}
        title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? (
          <Disc3 className="w-5 h-5 sm:w-5.5 sm:h-5.5 animate-spin-slow text-[#C98299]" />
        ) : (
          <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#674A49]/70" />
        )}
      </motion.button>
    </div>
  )
}

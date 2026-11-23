import { useState, useEffect } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'

interface LoadingScreenProps {
  onComplete: () => void
  progress: number
}

export default function LoadingScreen({ onComplete, progress }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setFadeOut(true), 400)
      const complete = setTimeout(onComplete, 1200)
      return () => {
        clearTimeout(timer)
        clearTimeout(complete)
      }
    }
  }, [progress, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-[#FFF9F2]`}
    >
      {/* Background delicate radial glow */}
      <div className="absolute inset-0 bg-radial from-[#F4D9DE]/30 via-transparent to-[#FFF9F2] pointer-events-none" />

      {/* Heart Ornament */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8D4B8] shadow-sm flex items-center justify-center">
          <Heart className="w-7 h-7 text-[#D99AA8] fill-[#D99AA8]/20 animate-pulse" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#E8D4B8] animate-bounce" />
      </div>

      {/* Recipient Title */}
      <p className="font-poppins text-xs uppercase tracking-[0.3em] text-[#D99AA8] font-semibold mb-2">
        A BIRTHDAY JOURNEY FOR
      </p>
      <h1 className="font-playfair text-3xl sm:text-5xl text-[#49372F] font-normal mb-8 text-center px-4">
        {websiteConfig.recipientName}
      </h1>

      {/* Progress Bar */}
      <div className="w-64 sm:w-80 relative">
        <div className="h-1 bg-[#E8D4B8]/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#E8D4B8] via-[#D99AA8] to-[#49372F]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[#49372F]/70 text-xs mt-3 text-center font-poppins font-medium tracking-wider">
          {progress < 100 ? `Preparing your experience... ${Math.round(progress)}%` : 'Ready with love ✨'}
        </p>
      </div>
    </div>
  )
}

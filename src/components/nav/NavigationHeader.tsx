import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Sparkles, Menu, X } from 'lucide-react'
import { audio } from '../../utils/audio'
import { websiteConfig } from '../../data/websiteConfig'

interface NavigationHeaderProps {
  onNavigate: (sectionId: string) => void
}

export default function NavigationHeader({ onNavigate }: NavigationHeaderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAudioToggle = () => {
    if (!audio.isBGMPlaying()) {
      audio.startBGM()
      setIsPlaying(true)
    } else {
      audio.stopBGM()
      setIsPlaying(false)
    }
  }

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false)
    onNavigate(id)
  }

  const navLinks = [
    { id: 'garden', label: 'Garden' },
    { id: 'memories', label: 'Memories' },
    { id: 'letter', label: 'Letter' },
    { id: 'celebration', label: 'Celebration' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'py-3 bg-[#FFF9F2]/90 backdrop-blur-md border-b border-[#E8D4B8]/60 shadow-xs'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] mx-auto flex items-center justify-between">
        {/* Monogram / Brand */}
        <button
          onClick={() => handleNavClick('top')}
          className="group flex items-center gap-2.5 cursor-pointer text-left"
          aria-label="Scroll to top"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[#E8D4B8] flex items-center justify-center text-[#D99AA8] shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-playfair text-base sm:text-lg font-medium text-[#49372F] tracking-tight block leading-tight">
              {websiteConfig.recipientShortName}
            </span>
            <span className="font-poppins text-[10px] uppercase tracking-[0.2em] text-[#D99AA8] block font-semibold">
              December 11
            </span>
          </div>
        </button>

        {/* Section Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-poppins uppercase tracking-[0.2em] text-[#49372F]/75">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-[#D99AA8] transition-colors cursor-pointer py-1"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side controls: Audio + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Toggle Button */}
          <button
            onClick={handleAudioToggle}
            aria-label={isPlaying ? 'Pause romantic piano' : 'Play romantic piano'}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-poppins font-medium transition-all shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-[#D99AA8] text-white border-[#D99AA8] shadow-[0_2px_10px_rgba(217,154,168,0.4)]'
                : 'bg-white/90 text-[#49372F] border-[#E8D4B8] hover:bg-white'
            }`}
          >
            {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#49372F]/50" />}
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
              {isPlaying ? 'Music On' : 'Play Piano'}
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-0.5 h-2.5 bg-white animate-pulse" />
                <span className="w-0.5 h-4 bg-white animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/90 border border-[#E8D4B8] text-[#49372F] hover:bg-white transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-[1200px] w-[calc(100%-32px)] mx-auto pt-3 pb-2 border-t border-[#E8D4B8]/40 mt-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-left py-2 px-3 text-xs font-poppins uppercase tracking-[0.2em] text-[#49372F] hover:bg-[#F4D9DE]/30 rounded-xl transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

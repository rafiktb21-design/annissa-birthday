import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Calendar } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'

export default function WelcomeSection() {
  const cfg = websiteConfig.welcome

  return (
    <section id="welcome" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden flex flex-col items-center text-center">
      {/* Decorative Floral Background accents */}
      <div className="absolute top-0 left-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none opacity-40">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none opacity-40 scale-x-[-1]">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="site-container relative z-10 flex flex-col items-center max-w-2xl">
        {/* Ornamental Top Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#F7DCE5]/60 border border-[#D8B77E]/40 text-[#674A49] mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
          <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
            {cfg.tagline}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
        </div>

        {/* Heading: Happy 21st Birthday Annissa! */}
        <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl text-[#674A49] font-normal tracking-tight leading-[1.2] mb-3">
          {cfg.title} <br />
          <span className="italic text-[#C98299] font-medium">{cfg.nameHighlight}</span>
        </h2>

        {/* Delicate Golden Divider */}
        <div className="flex items-center gap-3 my-2">
          <span className="w-12 h-px bg-[#D8B77E]" />
          <Heart className="w-4 h-4 text-[#C98299] fill-[#C98299]/30" />
          <span className="w-12 h-px bg-[#D8B77E]" />
        </div>

        {/* Top Watercolor Bouquet Crown */}
        <div className="w-44 h-16 pointer-events-none -mb-3 animate-float">
          <img src="/assets/flowers/watercolor-bouquet.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Portrait Photograph in Elegant Arched Frame */}
        <div className="relative my-4">
          {/* Subtle Outer Frame Halo */}
          <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-t-[140px] rounded-b-[40px] bg-gradient-to-b from-[#F7DCE5] via-[#FFF6F0] to-[#E7DFF3] -z-10 shadow-xl shadow-[#674A49]/10 border border-[#D8B77E]/50" />

          {/* Arched Photo Container */}
          <div className="w-[240px] h-[320px] sm:w-[290px] sm:h-[390px] rounded-t-[130px] rounded-b-[30px] overflow-hidden border-2 border-white shadow-inner relative bg-[#FFF6F0]">
            <img
              src={cfg.portraitImage}
              alt="Annissa Nur Fadilah"
              className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.02]"
              loading="eager"
            />
            {/* Soft inner glow vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#674A49]/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Cute Bow Ribbon on Arch Peak */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-10 pointer-events-none drop-shadow-md">
            <img src="/assets/decorations/bow-ribbon.svg" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Floating Floral Accent on Arch Corner */}
          <div className="absolute -bottom-5 -right-5 w-24 h-24 pointer-events-none">
            <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -bottom-5 -left-5 w-24 h-24 pointer-events-none scale-x-[-1]">
            <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Date Tag Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FFFDFB] border border-[#D8B77E] text-[#674A49] shadow-md z-10">
            <Calendar className="w-3.5 h-3.5 text-[#C98299]" />
            <span className="font-quicksand text-xs font-bold tracking-widest">
              {cfg.dateBadge}
            </span>
          </div>
        </div>

        {/* Garland Floral Divider */}
        <div className="w-full max-w-xs my-4 pointer-events-none">
          <img src="/assets/decorations/garland.svg" alt="" className="w-full h-8 object-contain opacity-80" />
        </div>

        {/* Supporting Quote in Indonesian and English */}
        <div className="max-w-lg mt-6 px-4">
          <p className="font-cormorant text-xl sm:text-2xl text-[#674A49] leading-relaxed italic mb-2 font-medium">
            "{cfg.quote}"
          </p>
          <p className="font-dmsans text-xs sm:text-sm text-[#594745]/80 tracking-wide font-normal">
            {cfg.englishQuote}
          </p>
        </div>
      </div>
    </section>
  )
}

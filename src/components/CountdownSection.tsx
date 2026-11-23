import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, Clock, PartyPopper } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'
import { useCountdown } from '../hooks/useCountdown'

export default function CountdownSection() {
  const cfg = websiteConfig.countdown
  const { days, hours, minutes, seconds, isExpired } = useCountdown(websiteConfig.targetIsoDate)

  const units = [
    { label: 'Hari', enLabel: 'Days', value: days },
    { label: 'Jam', enLabel: 'Hours', value: hours },
    { label: 'Menit', enLabel: 'Mins', value: minutes },
    { label: 'Detik', enLabel: 'Secs', value: seconds },
  ]

  return (
    <section id="countdown" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-[#FFF6F0] overflow-hidden flex flex-col items-center text-center">
      {/* Decorative Corner Florals */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none opacity-40">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none opacity-40 scale-x-[-1]">
        <img src="/assets/flowers/floral-corner.svg" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="site-container relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Hanging Floral Garland at the top */}
        <div className="w-full max-w-xs mb-3 pointer-events-none">
          <img src="/assets/decorations/garland.svg" alt="" className="w-full h-8 object-contain opacity-80" />
        </div>

        {/* Section Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/50 text-[#674A49] mb-4">
          <Clock className="w-3.5 h-3.5 text-[#C98299]" />
          <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
            {cfg.heading}
          </span>
          <Clock className="w-3.5 h-3.5 text-[#C98299]" />
        </div>

        <h2 className="font-playfair text-3xl sm:text-4xl text-[#674A49] font-normal mb-2">
          Menuju 11 Desember 2026
        </h2>

        <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] mb-8">
          "{cfg.subtitle}"
        </p>

        {isExpired ? (
          /* When reached / expired */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-8 rounded-3xl bg-[#FFFDFB] border border-[#D8B77E]/50 shadow-xl text-center flex flex-col items-center gap-2"
          >
            <PartyPopper className="w-10 h-10 text-[#C98299] animate-bounce" />
            <h3 className="font-playfair text-2xl sm:text-3xl text-[#674A49] font-medium">
              {cfg.celebratedMessage}
            </h3>
            <p className="font-dmsans text-sm text-[#C98299]">
              {cfg.celebratedEnglish}
            </p>
          </motion.div>
        ) : (
          /* 4 Compact Responsive Countdown Cards */
          <div className="w-full grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
            {units.map((unit, idx) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#FFFDFB] border border-[#D8B77E]/40 shadow-md shadow-[#674A49]/5"
              >
                <span className="font-playfair text-2xl sm:text-4xl font-semibold text-[#674A49] tracking-tight">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="font-quicksand text-[11px] sm:text-xs font-bold text-[#C98299] uppercase tracking-wider mt-1">
                  {unit.label}
                </span>
                <span className="text-[9px] text-[#594745]/50 hidden sm:inline">
                  {unit.enLabel}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Small Watercolor Floral Accent */}
        <div className="w-36 h-14 mt-6 pointer-events-none opacity-85">
          <img src="/assets/flowers/watercolor-bouquet.svg" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-quicksand text-[#674A49]/70">
          <Calendar className="w-3.5 h-3.5 text-[#D8B77E]" />
          <span>Waktu Indonesia Barat (GMT+7)</span>
        </div>
      </div>
    </section>
  )
}

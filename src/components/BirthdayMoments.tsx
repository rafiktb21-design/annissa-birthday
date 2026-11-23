import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Quote } from 'lucide-react'
import { websiteConfig } from '../data/websiteConfig'

export default function BirthdayMoments() {
  const cfg = websiteConfig.moments
  const memories = websiteConfig.memories

  // Featured memory: memory-03 (twilight by ocean) or memory-02
  const featured = memories[2] ?? memories[0]
  const sub1 = memories[3] ?? memories[1]
  const sub2 = memories[4] ?? memories[2]

  return (
    <section id="moments" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF6F0] overflow-hidden flex flex-col items-center">
      <div className="site-container relative z-10 max-w-[1000px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/50 text-[#674A49] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
            <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
              Storytelling
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C98299]" />
          </div>

          <h2 className="font-playfair text-3xl sm:text-5xl text-[#674A49] font-normal mb-2">
            {cfg.heading}
          </h2>

          <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299]">
            "{cfg.subtitle}"
          </p>
        </div>

        {/* Editorial Collage Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Main Large Featured Photograph (col 1-7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="md:col-span-7 relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-[#FFFDFB] p-3 shadow-xl border border-[#D8B77E]/40">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#674A49]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-quicksand text-xs uppercase tracking-widest text-[#D8B77E] font-semibold">
                    {featured.date} • {featured.location}
                  </span>
                  <h3 className="font-playfair text-xl sm:text-2xl font-medium mt-1">
                    {featured.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Quote badge floating */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FFFDFB] border border-[#D8B77E]/30 shadow-sm flex items-start gap-3">
              <Quote className="w-5 h-5 text-[#C98299] shrink-0 mt-0.5" />
              <p className="font-cormorant text-base sm:text-lg text-[#674A49] italic">
                "{featured.caption}"
              </p>
            </div>
          </motion.div>

          {/* Secondary Column: Two smaller complementary photos + Loving Quote (col 8-12) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Sub Photo 1 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-4 bg-[#FFFDFB] p-3 rounded-2xl border border-[#D8B77E]/30 shadow-md"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
                <img
                  src={sub1.image}
                  alt={sub1.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 pr-2">
                <span className="font-quicksand text-[11px] font-bold text-[#C98299] tracking-wider uppercase">
                  {sub1.date}
                </span>
                <h4 className="font-playfair text-base text-[#674A49] font-medium leading-snug mt-0.5">
                  {sub1.title}
                </h4>
                <p className="font-dmsans text-xs text-[#594745]/75 line-clamp-2 mt-1">
                  {sub1.caption}
                </p>
              </div>
            </motion.div>

            {/* Sub Photo 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex items-center gap-4 bg-[#FFFDFB] p-3 rounded-2xl border border-[#D8B77E]/30 shadow-md"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
                <img
                  src={sub2.image}
                  alt={sub2.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 pr-2">
                <span className="font-quicksand text-[11px] font-bold text-[#C98299] tracking-wider uppercase">
                  {sub2.date}
                </span>
                <h4 className="font-playfair text-base text-[#674A49] font-medium leading-snug mt-0.5">
                  {sub2.title}
                </h4>
                <p className="font-dmsans text-xs text-[#594745]/75 line-clamp-2 mt-1">
                  {sub2.caption}
                </p>
              </div>
            </motion.div>

            {/* Romantic Quote Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#F7DCE5]/70 to-[#FFF6F0] border border-[#D8B77E]/50 text-center"
            >
              <Heart className="w-4 h-4 text-[#C98299] mx-auto mb-2 fill-[#C98299]/20" />
              <p className="font-cormorant italic text-base sm:text-lg text-[#674A49]">
                "{cfg.quotes[0].quote}"
              </p>
              <p className="font-vibes text-xl text-[#C98299] mt-2">
                — {cfg.quotes[0].author}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

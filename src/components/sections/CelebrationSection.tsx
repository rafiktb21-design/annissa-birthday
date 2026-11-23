import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import confetti from 'canvas-confetti'
import { Sparkles, Mic, MicOff, Gift } from 'lucide-react'
import CelebrationCake3D from '../../three/CelebrationCake3D'
import { websiteConfig } from '../../data/websiteConfig'
import { audio } from '../../utils/audio'

export default function CelebrationSection() {
  const [candlesLit, setCandlesLit] = useState(true)
  const [isBlowing, setIsBlowing] = useState(false)
  const [wished, setWished] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const micStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const blowTimeoutRef = useRef<number | null>(null)

  const triggerBlowOut = useCallback(() => {
    if (!candlesLit) return
    setIsBlowing(true)
    audio.playCandleBlow()

    if (blowTimeoutRef.current) clearTimeout(blowTimeoutRef.current)
    blowTimeoutRef.current = window.setTimeout(() => {
      setCandlesLit(false)
      setIsBlowing(false)
      setWished(true)
      audio.playPartyPopper()
      audio.playSparkle()

      // Glorious Champagne & Rose Gold Confetti Burst
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D99AA8', '#E8D4B8', '#F5C6AE', '#FFF9F2', '#9BAE91'],
      })
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#F4D9DE', '#E8D4B8', '#D99AA8'],
        })
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#F4D9DE', '#E8D4B8', '#D99AA8'],
        })
      }, 350)
    }, 600)
  }, [candlesLit])

  // Optional microphone interaction
  const toggleMicrophone = async () => {
    if (micActive) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop())
        micStreamRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      setMicActive(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      audioContextRef.current = audioCtx
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)

      setMicActive(true)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const checkBlow = () => {
        if (!micStreamRef.current) return
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const avg = sum / bufferLength
        // Blow threshold
        if (avg > 58 && candlesLit) {
          triggerBlowOut()
          return
        }
        requestAnimationFrame(checkBlow)
      }
      checkBlow()
    } catch {
      setMicActive(false)
    }
  }

  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (blowTimeoutRef.current) clearTimeout(blowTimeoutRef.current)
    }
  }, [])

  return (
    <section id="celebration" className="relative w-full py-20 sm:py-24 md:py-28 bg-[#FFF9F2] overflow-hidden flex flex-col items-center scroll-mt-20">
      <div className="max-w-[1200px] w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] mx-auto flex flex-col items-center">
        {/* Editorial Chapter Header — Centered */}
        <div className="max-w-3xl mx-auto px-6 text-center mb-6 sm:mb-8">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="font-poppins text-xs uppercase tracking-[0.3em] text-[#D99AA8] font-semibold mb-2 sm:mb-3"
          >
            CHAPTER IV &bull; THE CELEBRATION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, delay: 0.15 }}
            className="font-playfair text-3xl sm:text-5xl md:text-6xl text-[#49372F] font-normal tracking-tight mb-3"
          >
            Happy 21st Birthday, <span className="italic font-normal text-[#D99AA8]">{websiteConfig.recipientShortName}</span>!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="font-cormorant text-lg sm:text-2xl text-[#49372F]/80 italic max-w-xl mx-auto"
          >
            {candlesLit
              ? 'Close your eyes, make a silent wish, and blow out the candles.'
              : 'May all your brightest dreams and sweetest wishes unfold.'}
          </motion.p>
        </div>

        {/* Master 3D Stage with Perfectly Framed Centered Cake */}
        <div className="w-full max-w-[900px] mx-auto aspect-[16/10] min-h-[440px] max-h-[580px] z-10">
          <div className="w-full h-full rounded-3xl overflow-hidden border border-[#E8D4B8]/80 shadow-[0_20px_70px_-15px_rgba(73,55,47,0.14)] bg-gradient-to-b from-[#FFFDF9] via-[#F4D9DE]/20 to-[#FFF9F2]">
            <Canvas
              camera={{ position: [0, 1.8, 5.8], fov: 38, near: 0.1, far: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.25} color="#FFF5EB" />
              <directionalLight
                position={[6, 12, 6]}
                intensity={2.2}
                color="#FFF2D6"
                castShadow
              />
              <Environment files="/assets/hdri/sunny_rose_garden_1k.hdr" environmentIntensity={0.65} />

              {/* Centered Celebration Cake lowered to frame candles and table completely */}
              <CelebrationCake3D
                position={[0, -0.85, 0]}
                candlesLit={candlesLit}
                onBlowCandles={triggerBlowOut}
                isBlowing={isBlowing}
                isSurpriseActive={wished}
              />

              <OrbitControls
                target={[0, 0.45, 0]}
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 3.4}
                maxAzimuthAngle={Math.PI / 4}
                minAzimuthAngle={-Math.PI / 4}
                rotateSpeed={0.5}
              />
            </Canvas>
          </div>
        </div>

        {/* Interactive Controls & Wish Result — Centered with Tight Rhythm */}
        <div className="w-full max-w-xl mx-auto px-6 text-center mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            {candlesLit ? (
              <motion.div
                key="controls"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                {/* Primary Action Button */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={triggerBlowOut}
                  className="inline-flex items-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-[#49372F] text-[#FFF9F2] font-poppins text-xs sm:text-sm uppercase tracking-widest font-semibold shadow-xl shadow-[#49372F]/15 border border-[#E8D4B8] cursor-pointer hover:bg-[#3D2C25] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#D99AA8]" />
                  <span>Tiup Lilin &amp; Make a Wish</span>
                </motion.button>

                {/* Optional Microphone Button */}
                <button
                  onClick={toggleMicrophone}
                  aria-label="Use microphone to blow"
                  className={`inline-flex items-center gap-2 px-5 py-3.5 sm:py-4 rounded-full text-xs font-poppins uppercase tracking-wider font-medium border transition-all cursor-pointer ${
                    micActive
                      ? 'bg-[#D99AA8] text-white border-[#D99AA8] shadow-md animate-pulse'
                      : 'bg-white/90 text-[#49372F] border-[#E8D4B8] hover:bg-white'
                  }`}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-[#49372F]/60" />}
                  <span>{micActive ? 'Mic Active: Blow now!' : 'Use Mic to Blow'}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="wished"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#E8D4B8] shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-[#D99AA8]" />
                  <span className="font-poppins text-xs uppercase tracking-widest text-[#D99AA8] font-semibold">
                    A Wish Sent to the Stars
                  </span>
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl text-[#49372F] font-normal mb-2">
                  May Every Wish Come True
                </h3>
                <p className="font-cormorant text-lg sm:text-xl text-[#49372F]/80 italic">
                  {websiteConfig.wishedMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'
import CountdownLockScreen from './components/CountdownLockScreen'
import InvitationCover from './components/InvitationCover'
import WelcomeSection from './components/WelcomeSection'
import MemoriesGallery from './components/MemoriesGallery'
import LetterSection from './components/LetterSection'
import CountdownSection from './components/CountdownSection'
import CelebrationSection from './components/CelebrationSection'
import BirthdayMoments from './components/BirthdayMoments'
import SurpriseGift from './components/SurpriseGift'
import BirthdayGuestbook from './components/BirthdayGuestbook'
import FinalMessage from './components/FinalMessage'
import MusicPlayer from './components/MusicPlayer'
import MobileNavigation from './components/MobileNavigation'
import FloatingDecorations from './components/FloatingDecorations'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    // Check session storage or URL param for unlock
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('annissa_birthday_bypass') === 'true'
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code') || params.get('pass') || params.get('key')
      const unlock = params.get('unlock') || params.get('bypass')
      if (saved || unlock === 'true' || ['1112', 'rafi', 'annissa', '21'].includes((code || '').toLowerCase())) {
        return true
      }
    }
    return false
  })

  const [isInvitationOpened, setIsInvitationOpened] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  const handleUnlockCountdown = () => {
    setIsUnlocked(true)
    sessionStorage.setItem('annissa_birthday_bypass', 'true')
  }

  // Initialize Lenis smooth scroll once invitation is opened
  useEffect(() => {
    if (!isInvitationOpened) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.2,
      wheelMultiplier: 0.9,
      infinite: false,
    })
    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [isInvitationOpened])

  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === 'welcome') {
      lenisRef.current?.scrollTo(0, { duration: 1.2 })
      return
    }
    const elem = document.getElementById(sectionId)
    if (elem) {
      lenisRef.current?.scrollTo(elem, { offset: -20, duration: 1.2 })
    }
  }, [])

  const handleOpenInvitation = () => {
    setIsInvitationOpened(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReplay = () => {
    setIsInvitationOpened(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FFF9F5] text-[#594745] selection:bg-[#F7DCE5] selection:text-[#674A49]">
      {/* Floating Aesthetic Background Petals, Butterflies & Fairy Lights (Tampil di semua tahap) */}
      <FloatingDecorations />

      {/* Floating Music Controller (Tampil di semua tahap: Countdown, Sampul, dan Konten Utama) */}
      <MusicPlayer />

      {/* TAHAP 1 — COUNTDOWN LOCK SCREEN (Sebelum Waktunya Tiba & Belum Dibypass) */}
      {!isUnlocked && (
        <CountdownLockScreen onUnlock={handleUnlockCountdown} />
      )}

      {/* TAHAP 2 — KARTU SAMPUL UNDANGAN (Setelah Countdown Tiba atau Dibypass Akses Khusus) */}
      {isUnlocked && (
        <InvitationCover
          isOpen={isInvitationOpened}
          onOpen={handleOpenInvitation}
        />
      )}

      {/* TAHAP 3 — ISI CERITA UTUH WEBSITE (Setelah Buka Undangan Diklik) */}
      {isUnlocked && isInvitationOpened && (
        <>
          {/* Floating Mobile Bottom Navigation */}
          <MobileNavigation onNavigate={scrollToSection} />

          <main className="w-full pb-36 sm:pb-28">
            {/* SECTION 2 — WELCOME */}
            <WelcomeSection />

            {/* SECTION 3 — OUR MEMORIES */}
            <MemoriesGallery />

            {/* SECTION 4 — A LETTER FOR YOU */}
            <LetterSection />

            {/* SECTION 5 — BIRTHDAY COUNTDOWN */}
            <CountdownSection />

            {/* SECTION 6 — THE BIRTHDAY CELEBRATION */}
            <CelebrationSection />

            {/* SECTION 7 — BIRTHDAY MOMENTS */}
            <BirthdayMoments />

            {/* SECTION 8 — A LITTLE SURPRISE */}
            <SurpriseGift />

            {/* SECTION 9 — BIRTHDAY WISHES GUESTBOOK */}
            <BirthdayGuestbook />

            {/* SECTION 10 — FINAL MESSAGE */}
            <FinalMessage onReplay={handleReplay} />
          </main>
        </>
      )}
    </div>
  )
}

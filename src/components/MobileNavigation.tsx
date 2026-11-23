import React, { useState, useEffect } from 'react'
import { Sparkles, Heart, Image as ImageIcon, Mail, Cake, MessageSquare } from 'lucide-react'

interface MobileNavigationProps {
  onNavigate: (sectionId: string) => void
}

export default function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  const [activeSection, setActiveSection] = useState('welcome')

  const navItems = [
    { id: 'welcome', label: 'Home', icon: Heart },
    { id: 'memories', label: 'Kenangan', icon: ImageIcon },
    { id: 'letter', label: 'Surat', icon: Mail },
    { id: 'birthday', label: 'Ultah', icon: Cake },
    { id: 'guestbook', label: 'Ucapan', icon: MessageSquare },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const sections = ['welcome', 'memories', 'letter', 'birthday', 'guestbook']

      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop - 200
          const bottom = top + el.offsetHeight
          if (scrollY >= top && scrollY < bottom) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3 pt-2 px-4 pointer-events-none safe-bottom md:hidden">
      <div className="pointer-events-auto flex items-center justify-around gap-1 px-3 py-2 rounded-full bg-[#FFFDFB]/95 backdrop-blur-md border border-[#D8B77E]/50 shadow-lg shadow-[#674A49]/15 max-w-md w-full">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-full transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
                isActive
                  ? 'bg-[#F7DCE5] text-[#C98299] shadow-xs'
                  : 'text-[#674A49]/70 hover:text-[#C98299]'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="font-quicksand text-[10px] font-bold tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

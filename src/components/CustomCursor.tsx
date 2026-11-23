import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 24, stiffness: 350, mass: 0.5 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)

  const followerConfig = { damping: 18, stiffness: 180, mass: 0.8 }
  const followerX = useSpring(cursorX, followerConfig)
  const followerY = useSpring(cursorY, followerConfig)

  useEffect(() => {
    // Only show on desktop devices with fine pointer (mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Detect if hovering over clickable / interactive elements
      const target = e.target as HTMLElement | null
      if (target) {
        const clickable = target.closest('button, a, input, [role="button"], .cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer'
        setIsPointer(!!clickable)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY, isVisible])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Romantic Follower Halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#E989AC]/60"
        style={{
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? 48 : (isClicking ? 28 : 36),
          height: isPointer ? 48 : (isClicking ? 28 : 36),
          background: isPointer ? 'rgba(248, 184, 204, 0.3)' : 'rgba(245, 213, 138, 0.12)',
          boxShadow: isPointer ? '0 0 20px rgba(233, 137, 172, 0.5)' : 'none',
          transition: 'width 0.2s, height 0.2s, background 0.2s',
        }}
      />

      {/* Inner Precision Glow Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-[#E989AC] shadow-[0_0_10px_#F8B8CC]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? 8 : (isClicking ? 4 : 6),
          height: isPointer ? 8 : (isClicking ? 4 : 6),
          transition: 'width 0.15s, height 0.15s',
        }}
      />
    </div>
  )
}

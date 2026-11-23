import { useEffect, useRef, useState } from 'react'

interface CinematicTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
  visible?: boolean
}

export default function CinematicText({ children, className = '', delay = 0, visible = true }: CinematicTextProps) {
  const [show, setShow] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => setShow(true), delay)
    } else {
      setShow(false)
    }
    return () => clearTimeout(timerRef.current)
  }, [visible, delay])

  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  )
}

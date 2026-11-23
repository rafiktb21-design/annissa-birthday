import React from 'react'

interface FloralDividerProps {
  className?: string
}

export default function FloralDivider({ className = '' }: FloralDividerProps) {
  return (
    <div className={`w-full max-w-xs mx-auto flex items-center justify-center my-6 pointer-events-none select-none ${className}`}>
      <img
        src="/assets/decorations/garland.svg"
        alt=""
        className="w-full h-8 object-contain opacity-75"
      />
    </div>
  )
}

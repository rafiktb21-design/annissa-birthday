import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator({ visible = true }: { visible?: boolean }) {
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 transition-opacity duration-700 ${visible ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}>
      <span className="text-[#704856] text-xs font-poppins font-medium tracking-widest uppercase">Scroll</span>
      <ChevronDown className="w-5 h-5 text-[#E989AC] animate-bounce" />
    </div>
  )
}

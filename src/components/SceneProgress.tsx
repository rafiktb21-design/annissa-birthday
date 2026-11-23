const sceneNames = ['Entrance', 'Celebration', 'Memories', 'Letter', 'Finale']

export default function SceneProgress({ currentScene }: { currentScene: number }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
      {sceneNames.map((name, i) => (
        <div key={name} className="group flex items-center gap-2">
          <span className={`text-xs font-poppins opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#381827] bg-white/70 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap`}>
            {name}
          </span>
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === currentScene
                ? 'bg-[#F5D58A] scale-150 shadow-[0_0_12px_rgba(245,213,138,0.9)]'
                : i < currentScene
                ? 'bg-[#E989AC]'
                : 'bg-[#F8B8CC]/40'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

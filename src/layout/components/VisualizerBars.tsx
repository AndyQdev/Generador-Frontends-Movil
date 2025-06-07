// components/VisualizerBars.tsx
export const VisualizerBars = () => {
  return (
    <div className="flex items-end gap-1 h-10">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-green-500 animate-pulse"
          style={{
            height: `${Math.random() * 100}%`,
            animationDuration: `${0.3 + Math.random() * 0.7}s`,
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      ))}
    </div>
  )
}

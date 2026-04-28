import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import moment from 'moment'

const StoryViewer = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)

  const currentStory = stories[currentIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 1
      })
    }, 50) // 5 seconds total (50ms * 100)
    return () => clearInterval(timer)
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-[3rem] overflow-hidden shadow-2xl">
        
        {/* Progress Bars */}
        <div className="absolute top-6 left-6 right-6 z-20 flex gap-1.5">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-10 left-6 right-6 z-20 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <img src={currentStory?.user?.profile_picture || '/default-avatar.png'} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
              <div className="flex flex-col">
                 <span className="text-white text-sm font-bold">{currentStory?.user?.full_name}</span>
                 <span className="text-white/60 text-[10px] font-bold uppercase tracking-tight">{moment(currentStory?.createdAt).fromNow()}</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 text-white/80 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
              <button onClick={onClose} className="p-2 text-white/80 hover:text-white transition-colors"><X size={20} /></button>
           </div>
        </div>

        {/* Content */}
        <div className="w-full h-full flex items-center justify-center p-8 text-center" style={{ background: currentStory?.background_color || '#111' }}>
           {currentStory?.media_type === 'image' && (
              <img src={currentStory.media_url} className="absolute inset-0 w-full h-full object-cover" alt="" />
           )}
           {currentStory?.media_type === 'video' && (
              <video src={currentStory.media_url} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop />
           )}
           {currentStory?.content && (
              <p className={`relative z-10 text-white text-2xl md:text-3xl font-black leading-tight drop-shadow-lg ${currentStory?.media_type !== 'text' ? 'bg-black/20 p-6 backdrop-blur-sm rounded-3xl' : ''}`}>
                 {currentStory.content}
              </p>
           )}
        </div>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-30 cursor-pointer" onClick={handleNext} />
        
        {/* Desktop Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md hidden md:flex transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md hidden md:flex transition-all"
        >
          <ChevronRight size={24} />
        </button>

      </div>
    </div>
  )
}

export default StoryViewer
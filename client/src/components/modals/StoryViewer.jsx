import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'

const StoryViewer = ({ stories, setViewStory }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const currentStory = stories?.[currentStoryIndex]

    useEffect(() => {
        let timer = null;
        let progressInterval = null;

        if (currentStory) {
            setProgress(0);
            const duration = currentStory.media_type === 'video' ? 15000 : 8000;
            const setTime = 100;
            let elapsed = 0;

            progressInterval = setInterval(() => {
                elapsed += setTime;
                setProgress((elapsed / duration) * 100);
                if (elapsed >= duration) {
                    clearInterval(progressInterval);
                }
            }, setTime);

            timer = setTimeout(() => {
                handleNext()
            }, duration);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [currentStory]);

    const handleNext = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1)
            setProgress(0)
        } else {
            setViewStory(null)
        }
    }

    const handleClose = () => {
        setViewStory(null)
    }

    if (!currentStory) return null

    const renderContent = () => {
        switch (currentStory.media_type) {
            case 'image':
                return (
                    <img 
                        src={currentStory.media_url} 
                        alt='' 
                        className='w-full h-full object-contain md:max-w-[450px] shadow-2xl' 
                    />
                );
            case 'video':
                return (
                    <video 
                        onEnded={handleNext} 
                        src={currentStory.media_url}
                        className='w-full h-full object-contain md:max-w-[450px] shadow-2xl' 
                        controls 
                        autoPlay 
                    />
                );
            case 'text':
                return (
                    <div 
                        className='w-full h-full flex items-center justify-center p-12 text-white text-3xl font-headline font-bold text-center leading-relaxed'
                        style={{ backgroundColor: currentStory.background_color || '#8037b1' }}
                    >
                        {currentStory.content}
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className='fixed inset-0 z-[150] bg-stone-950 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-700'>
            {/* Cinematic Progress Segment */}
            <div className='absolute top-0 left-0 w-full flex gap-1.5 p-4 z-20'>
                {stories.map((_, index) => (
                    <div key={index} className='h-[4px] flex-1 bg-white/20 rounded-full overflow-hidden'>
                        <div 
                            className={`h-full bg-white transition-all duration-100 linear ${index < currentStoryIndex ? 'w-full' : index === currentStoryIndex ? '' : 'w-0'}`}
                            style={{ width: index === currentStoryIndex ? `${progress}%` : undefined }}
                        />
                    </div>
                ))}
            </div>

            {/* Identity Bar */}
            <div className='absolute top-10 left-6 z-20 flex items-center gap-4 py-2 px-4 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl transition-all hover:bg-black/30'>
                <div className='w-10 h-10 rounded-full story-ring p-[1.5px]'>
                    <div className='w-full h-full rounded-full border border-white/20 overflow-hidden bg-stone-800'>
                        <img 
                            src={currentStory.user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            className='w-full h-full object-cover' 
                            alt={currentStory.user?.full_name} 
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span className='text-[13px] font-headline font-black text-white tracking-widest uppercase leading-none'>{currentStory.user?.full_name}</span>
                    <span className='text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1'>Editorial Story</span>
                </div>
            </div>

            {/* Close Trigger */}
            <button 
                onClick={handleClose} 
                className='absolute top-10 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90 border border-white/5 shadow-lg'
            >
                <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Media Canvas */}
            <div className='w-full h-full flex flex-col items-center justify-center relative bg-stone-900/50 shadow-2xl overflow-hidden'>
                {renderContent()}
                
                {/* Story Narration Overlay */}
                {currentStory.media_type !== 'text' && currentStory.content && (
                    <div className='absolute bottom-0 left-0 right-0 px-8 py-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center text-center'>
                        <p className='text-white text-lg md:text-2xl font-medium max-w-2xl leading-relaxed tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000'>
                            {currentStory.content}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Triggers (Left/Right) */}
            <div className="absolute inset-0 flex z-10">
                <div 
                    onClick={() => {
                        if (currentStoryIndex > 0) {
                            setCurrentStoryIndex(prev => prev - 1)
                            setProgress(0)
                        }
                    }}
                    className="flex-1 cursor-pointer"
                />
                <div 
                    onClick={handleNext}
                    className="flex-1 cursor-pointer"
                />
            </div>
        </div>
    )
}

export default StoryViewer
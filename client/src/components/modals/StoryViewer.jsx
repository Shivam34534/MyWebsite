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
        <div className='fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center overflow-hidden animate-in slide-in-from-right-8 duration-500'>
            {/* Cinematic Progress Segment */}
            <div className='absolute top-0 left-0 w-full flex gap-1 p-2 z-20'>
                {stories.map((_, index) => (
                    <div key={index} className='h-[6px] flex-1 bg-white/20 neo-border border-white/10 overflow-hidden'>
                        <div 
                            className={`h-full bg-primary transition-all duration-100 linear ${index < currentStoryIndex ? 'w-full' : index === currentStoryIndex ? '' : 'w-0'}`}
                            style={{ width: index === currentStoryIndex ? `${progress}%` : undefined }}
                        />
                    </div>
                ))}
            </div>

            {/* Identity Bar */}
            <div className='absolute top-12 left-8 z-20 flex items-center gap-5 p-4 bg-white neo-border shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#000]'>
                <div className='w-12 h-12 neo-border bg-black p-0.5'>
                    <div className='w-full h-full neo-border border-white overflow-hidden bg-stone-100'>
                        <img 
                            src={currentStory.user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            className='w-full h-full object-cover grayscale-[0.2]' 
                            alt={currentStory.user?.full_name} 
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span className='text-sm font-black text-black tracking-tight uppercase leading-none italic'>{currentStory.user?.full_name}</span>
                    <span className='text-[8px] font-black text-black/40 uppercase tracking-widest mt-1'>STORY_PROTOCOL_04</span>
                </div>
            </div>

            {/* Close Trigger */}
            <button 
                onClick={handleClose} 
                className='absolute top-12 right-8 z-20 w-12 h-12 neo-border bg-white text-black hover:bg-black hover:text-white transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000]'
            >
                <span className="material-symbols-outlined font-black">close</span>
            </button>

            {/* Media Canvas */}
            <div className='w-full h-full flex flex-col items-center justify-center relative bg-black shadow-2xl overflow-hidden'>
                {renderContent()}
                
                {/* Story Narration Overlay */}
                {currentStory.media_type !== 'text' && currentStory.content && (
                    <div className='absolute bottom-0 left-0 right-0 p-10 bg-black/80 flex items-center justify-center text-center border-t-[6px] border-primary z-10'>
                        <p className='text-white text-xl md:text-3xl font-black uppercase tracking-tight italic max-w-2xl leading-tight'>
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
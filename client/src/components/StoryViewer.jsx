import { BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const StoryViewer = ({ stories, setViewStory }) => {

    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const currentStory = stories?.[currentStoryIndex]

    useEffect(() => {
        let timer = null;
        let progressInterval = null;

        if (currentStory && currentStory.media_type !== 'video') {
            setProgress(0);
            const duration = 10000;
            const setTime = 100;
            let elapsed = 0;

            progressInterval = setInterval(() => {
                elapsed += setTime;
                setProgress((elapsed / duration) * 100);
                if (elapsed >= duration) {
                    clearInterval(progressInterval);
                }
            }, setTime);

            // Close story after duration (10sec)
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
                    <img src={currentStory.media_url} alt='' className='max-w-full max-h-screen 
                    object-contain' />
                );
            case 'video':
                return (
                    <video onEnded={handleNext} src={currentStory.media_url}
                        className='max-h-screen' controls autoPlay />
                );
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center p-8
                    text-white text-2xl text-center'>
                        {currentStory.content}
                    </div>
                );

            default:
                break;
        }
    }
    return (
        <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex
    items-center justify-center' style={{
                backgroundColor: currentStory.media_type ===
                    'text' ? currentStory.background_color : '#000000'
            }}>

            {/* Progress Bar */}
            <div className='absolute top-0 left-0 w-full flex gap-1 p-2 box-border'>
                {stories.map((story, index) => (
                    <div key={index} className='h-1 flex-1 bg-gray-700 rounded overflow-hidden'>
                        <div className={`h-full bg-white transition-all duration-100 linear ${index < currentStoryIndex ? 'w-full' : index === currentStoryIndex ? '' : 'w-0'}`}
                            style={{ width: index === currentStoryIndex ? `${progress}%` : undefined }}>
                        </div>
                    </div>
                ))}
            </div>
            {/* User Info - Top Left */}
            <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4
            sm:p-4 sm:px-8 backdrop-blur rounded bg-black/50'>
                <img src={currentStory.user?.profile_picture || assets.sample_profile} alt="" className='size-7
                sm:size-8 rounded-full object-cover border border-white' />
                <div className='text-white font-medium flex items-center gap-1.5'>
                    <span>{currentStory.user?.full_name}</span>
                    <BadgeCheck size={18} />
                </div>
            </div>

            {/* Close Button */}
            <button onClick={handleClose} className='absolute top-4 right-4 text-white tex-3xl
            font-bold focus:outline-none'>
                <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />
            </button>

            {/* Content Wrapper */}
            <div className='max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center relative'>
                {renderContent()}
                {currentStory.media_type !== 'text' && currentStory.content && (
                    <div className='absolute bottom-10 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm rounded-b-lg text-center'>
                        <p className='text-white text-lg font-medium'>{currentStory.content}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StoryViewer
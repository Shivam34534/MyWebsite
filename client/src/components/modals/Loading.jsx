import React from 'react'

const Loading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-xl z-[200]'>
        <div className='flex flex-col items-center gap-6 animate-in fade-in duration-1000'>
            <div className='relative flex flex-col items-center'>
                <h1 className='text-4xl font-black font-headline tracking-tighter bg-gradient-to-tr from-[#8037b1] via-[#E1306C] to-[#FF8C00] bg-clip-text text-transparent animate-pulse'>
                    Gallery
                </h1>
                <div className='w-16 h-0.5 bg-stone-200/20 rounded-full mt-2 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-primary/40 w-1/2 animate-loading-bar'></div>
                </div>
            </div>
            <p className='text-[10px] font-bold uppercase tracking-[0.5em] text-on-surface-variant/30 animate-pulse'>Curating your moment</p>
        </div>
    </div>
  )
}

export default Loading

import React from 'react'

const Loading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#F2F2F2] z-[200]'>
        <div className='flex flex-col items-center gap-8'>
            <div className='bg-primary p-6 neo-border shadow-[8px_8px_0_0_#000] rotate-3 animate-bounce'>
                <h1 className='text-6xl font-black italic tracking-tighter text-black uppercase leading-none'>
                    LOADING...
                </h1>
            </div>
            <div className='w-64 h-8 neo-border bg-white relative overflow-hidden shadow-[4px_4px_0_0_#000]'>
                <div className='absolute inset-0 bg-accent w-full animate-[loading-bar_1.5s_infinite_linear] border-r-[4px] border-black'></div>
            </div>
            <p className='text-[10px] font-black uppercase tracking-[0.6em] text-black italic animate-pulse'>SYNCHRONIZING_AURA_PROTOCOLS</p>
        </div>
    </div>
  )
}

export default Loading

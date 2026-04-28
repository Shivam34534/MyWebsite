import React from 'react'

const Loading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#F8FAFC] z-[200]'>
        <div className='flex flex-col items-center gap-6 animate-fade-in'>
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
                <span className="text-white font-black text-4xl italic">A</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Aura</h2>
              <p className='text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 animate-pulse'>Synchronizing Vibe...</p>
            </div>
        </div>
    </div>
  )
}

export default Loading

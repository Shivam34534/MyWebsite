const Loading = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-slate-50/50 backdrop-blur-sm'>
        <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
                <div className='w-14 h-14 rounded-2xl border-4 border-indigo-100' />
                <div className='w-14 h-14 rounded-2xl border-4 border-indigo-600 border-t-transparent animate-spin absolute inset-0' />
                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-6 h-6 bg-indigo-500 rounded-full animate-pulse' />
                </div>
            </div>
            <p className='text-xs font-bold text-slate-400 tracking-[0.2em] uppercase animate-pulse'>Aura is loading</p>
        </div>
    </div>
  )
}

export default Loading

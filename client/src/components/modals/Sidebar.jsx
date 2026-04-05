import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { useClerk } from '../../mockClerk'
import { useSelector } from 'react-redux'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 lg:w-72 border-r border-stone-200/15 dark:border-stone-800/15 bg-stone-50 dark:bg-stone-950 flex flex-col p-6 gap-8 z-50 transition-transform duration-500 max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col gap-1 px-2">
        <h1 
          onClick={() => navigate('/')}
          className="text-2xl font-black bg-gradient-to-tr from-[#8037b1] via-[#E1306C] to-[#FF8C00] bg-clip-text text-transparent font-headline tracking-tight cursor-pointer"
        >
          Gallery
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/50">Editorial Social</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <MenuItems setSidebarOpen={setSidebarOpen} />
        
        <Link to='/create-post' 
          onClick={() => setSidebarOpen(false)}
          className='flex items-center gap-4 p-3 rounded-xl text-stone-500 dark:text-stone-400 font-medium hover:bg-stone-200/50 transition-all active:scale-95 group'
        >
          <span className="material-symbols-outlined transition-transform duration-200 group-hover:scale-110">add_box</span>
          <span className="font-headline text-base">Create</span>
        </Link>
      </nav>

      <div className='mt-auto p-4 bg-surface-container-low rounded-2xl flex items-center justify-between border border-stone-200/5 group cursor-pointer' onClick={() => navigate('/profile')}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              className="w-10 h-10 rounded-full object-cover border-2 border-surface shadow-sm transition-transform group-hover:scale-105" 
              src={user?.profile_picture || assets.sample_profile} 
              onError={(e) => { e.target.src = assets.sample_profile }}
              alt=""
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
          </div>
          <div className="flex flex-col overflow-hidden max-w-[120px]">
            <span className="text-sm font-bold font-headline text-on-surface truncate">{user?.full_name}</span>
            <span className="text-[10px] text-on-surface-variant/80 font-medium truncate">{user?.username}</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); signOut(); }}
          className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar



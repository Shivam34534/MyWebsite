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
    <aside className={`fixed left-0 top-0 h-screen w-64 lg:w-[280px] xl:w-[320px] border-r border-stone-200/50 bg-white/80 backdrop-blur-3xl flex flex-col p-8 gap-10 z-50 transition-transform duration-500 ease-in-out max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Branding */}
      <div className="flex flex-col gap-1.5 px-3">
        <h1 
          onClick={() => navigate('/')}
          className="text-3xl font-black bg-gradient-to-tr from-[#8037b1] via-[#E1306C] to-[#FF8C00] bg-clip-text text-transparent font-headline tracking-tighter cursor-pointer leading-none"
        >
          Gallery
        </h1>
        <p className="text-[10px] font-black tracking-[0.35em] uppercase text-on-surface-variant/30 pl-0.5">Editorial Social</p>
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-2 flex-1 pt-4">
        <MenuItems setSidebarOpen={setSidebarOpen} />
        
        {/* Create Action with Distinct Styling */}
        <Link to='/create-post' 
          onClick={() => setSidebarOpen(false)}
          className='flex items-center gap-4 p-3.5 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all active:scale-95 group mt-4 border border-transparent hover:border-primary/10'
        >
          <div className='w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors'>
            <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110">add_box</span>
          </div>
          <span className="font-headline font-bold text-[15px] tracking-tight">Post Moment</span>
        </Link>
      </nav>

      {/* Curator Identity Stage */}
      <div className='mt-auto p-5 bg-stone-50 rounded-[2rem] flex items-center justify-between border border-stone-200/30 group cursor-pointer hover:bg-stone-100/50 transition-all shadow-sm' onClick={() => navigate('/profile')}>
        <div className="flex items-center gap-4">
          <div className="relative p-0.5 rounded-full border border-white bg-white shadow-sm ring-1 ring-stone-200/50 transition-transform group-hover:scale-105">
            <img 
              className="w-11 h-11 rounded-full object-cover" 
              src={user?.profile_picture || assets.sample_profile} 
              onError={(e) => { e.target.src = assets.sample_profile }}
              alt=""
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-black font-headline text-on-surface truncate leading-tight">{user?.full_name}</span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider truncate">{user?.username}</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); signOut(); }}
          className="w-9 h-9 flex items-center justify-center hover:bg-red-50 text-stone-300 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
          title="Sign Out from Studio"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar



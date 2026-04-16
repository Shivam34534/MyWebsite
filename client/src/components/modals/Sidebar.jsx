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
    <aside className={`fixed left-0 top-0 h-screen w-64 lg:w-[280px] xl:w-[320px] bg-[#F2F2F2] border-r-[6px] border-black flex flex-col p-8 gap-10 z-50 transition-transform duration-300 ease-in-out max-lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative`}>
      {/* Branding */}
      <div className="flex flex-col gap-1 -rotate-2">
        <h1 
          onClick={() => navigate('/')}
          className="text-6xl font-black text-black italic tracking-tighter cursor-pointer leading-none hover:rotate-0 transition-transform"
        >
          AURA.NET
        </h1>
        <div className="bg-black text-[10px] font-black tracking-widest uppercase text-white px-2 py-0.5 w-fit">CORE_SOCIAL_X</div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-6 flex-1 pt-4">
        <MenuItems setSidebarOpen={setSidebarOpen} />
        
        {/* Create Action */}
        <Link to='/create-post' 
          onClick={() => setSidebarOpen(false)}
          className='neo-button bg-accent mt-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none'
        >
          <span className="material-symbols-outlined text-[24px] font-black">add_box</span>
          <span className="text-sm font-black uppercase tracking-widest">INITIALIZE_POST</span>
        </Link>
      </nav>

      {/* Profile Section */}
      <div className='mt-auto p-4 neo-border bg-white flex items-center justify-between group cursor-pointer hover:translate-y-[-2px] transition-all shadow-[6px_6px_0px_0px_#000]' onClick={() => navigate('/profile')}>
        <div className="flex items-center gap-4">
          <div className="neo-border p-0.5 bg-black rotate-3 group-hover:rotate-0 transition-transform">
            <img 
              className="w-12 h-12 object-cover" 
              src={user?.profile_picture || assets.sample_profile} 
              onError={(e) => { e.target.src = assets.sample_profile }}
              alt=""
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-black text-black truncate leading-none uppercase tracking-tighter">{user?.full_name}</span>
            <span className="text-[9px] text-black/40 font-black uppercase tracking-widest truncate mt-1">@{user?.username}</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); signOut(); }}
          className="w-10 h-10 neo-border bg-stone-100 flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px] font-black">logout</span>
        </button>
      </div>
    </aside>

  )
}

export default Sidebar



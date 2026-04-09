import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { useClerk } from '../../mockClerk'
import { useSelector } from 'react-redux'
import { LogOut, PlusSquare, Smartphone } from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()

  return (
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-full lg:w-[280px] xl:w-[320px] bg-bg border-r-[6px] border-black flex flex-col p-6 z-[100] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      
      {/* ⚡ Branding */}
      <div className="mb-12 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="neo-box bg-white px-4 py-2 rotate-1 group-hover:-rotate-1 neo-transition mb-2">
           <h1 className="text-4xl font-black italic tracking-tighter">GALLERY</h1>
        </div>
        <div className="flex items-center gap-2 px-1">
           <div className="w-8 h-2 bg-main border-2 border-black" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neo Social system</span>
        </div>
      </div>

      {/* ⚡ Secondary Nav Label */}
      <div className="px-2 mb-4">
        <span className="text-[11px] font-black text-black/40 uppercase tracking-widest">Navigation_Map</span>
      </div>

      {/* ⚡ Primary Navigation */}
      <nav className="flex flex-col gap-4 flex-1">
        <MenuItems setSidebarOpen={setSidebarOpen} />
        
        {/* Post Action */}
        <Link to='/create-post' 
          onClick={() => setSidebarOpen(false)}
          className='neo-button bg-accent w-full mt-4 group'
        >
          <PlusSquare className="w-5 h-5 group-hover:scale-110 neo-transition" />
          <span className="font-black text-sm uppercase">Post Moment</span>
        </Link>
      </nav>

      {/* ⚡ System Status */}
      <div className="p-4 neo-box bg-white mb-6 hidden lg:block">
         <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">Device_Status</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-main rounded-full border-2 border-black animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-tighter">System_Online</span>
         </div>
      </div>

      {/* ⚡ Curator Identity Stage */}
      <div className='neo-box bg-white p-4 flex flex-col gap-4'>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-12 h-12 neo-box overflow-hidden bg-accent">
            <img 
              className="w-full h-full object-cover" 
              src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
              alt={user?.full_name}
            />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-black uppercase truncate tracking-tighter">{user?.full_name}</span>
            <span className="text-[10px] font-bold text-black/50 truncate">@{user?.username}</span>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); signOut(); }}
          className="neo-button-secondary py-2 text-xs w-full flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          TERMINATE_SESSION
        </button>
      </div>
    </aside>
  )
}

export default Sidebar



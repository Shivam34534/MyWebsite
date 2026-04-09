import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { useClerk } from '../../mockClerk'
import { useSelector } from 'react-redux'
import { LogOut, PlusSquare, Smartphone, Zap, Activity, Cpu, ShieldCheck } from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()

  return (
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-full lg:w-[300px] xl:w-[340px] bg-white border-r-[6px] border-black flex flex-col p-6 z-[100] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} selection:bg-main selection:text-black`}>
      
      {/* ⚡ BRANDING SECTION */}
      <div className="mb-14 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="neo-box bg-main px-5 py-3 -rotate-1 group-hover:rotate-0 neo-transition mb-4 border-b-8">
           <h1 className="text-5xl font-black italic tracking-tighter leading-none uppercase">GALLERY_OS</h1>
        </div>
        <div className="flex items-center justify-between px-1">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-black">STRIKE_MODE_ACTIVE</span>
           </div>
           <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5">V7.1.5</span>
        </div>
      </div>

      {/* ⚡ PRIMARY INTERFACE NODES */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="px-2 flex items-center justify-between">
          <span className="font-mono text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">INTERFACE_STATIONS</span>
          <Activity className="w-3 h-3 text-black/20" />
        </div>
        
        <nav className="flex flex-col gap-3">
          <MenuItems setSidebarOpen={setSidebarOpen} />
          
          <Link to='/create-post' 
            onClick={() => setSidebarOpen(false)}
            className='neo-button bg-accent w-full mt-6 group py-4 relative group'
          >
            <PlusSquare className="w-6 h-6 group-hover:rotate-90 neo-transition" strokeWidth={3} />
            <span className="font-black text-lg uppercase italic">TRANSMIT_DATA</span>
            <div className="absolute right-3 top-3 w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 neo-transition" />
          </Link>
        </nav>

        {/* ⚡ SYSTEM TELEMETRY */}
        <div className="mt-12 space-y-4">
           <div className="px-2">
             <span className="font-mono text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">HARDWARE_STATUS</span>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="neo-box bg-gray-soft p-3 flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3" />
                    <span className="font-mono text-[8px] font-black">LOAD</span>
                 </div>
                 <span className="font-mono text-xs font-black">24.2%</span>
              </div>
              <div className="neo-box bg-gray-soft p-3 flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="font-mono text-[8px] font-black">SECURE</span>
                 </div>
                 <span className="font-mono text-xs font-black">TRUE</span>
              </div>
           </div>
        </div>
      </div>

      {/* ⚡ IDENTITY GATEWAY */}
      <div className='mt-auto pt-8'>
        <div className="neo-box bg-white overflow-hidden flex flex-col group/user border-t-8">
          <div 
            className="p-5 flex items-center gap-4 cursor-pointer hover:bg-main/10 neo-transition"
            onClick={() => navigate(`/profile/${user?._id}`)}
          >
            <div className="w-14 h-14 neo-box overflow-hidden bg-accent -rotate-3 group-hover/user:rotate-0 neo-transition">
              <img 
                className="w-full h-full object-cover grayscale group-hover/user:grayscale-0" 
                src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                alt={user?.full_name}
              />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-lg font-black uppercase italic truncate leading-none mb-1">@{user?.username || 'GUEST'}</span>
              <span className="font-mono text-[9px] font-black text-black/40 truncate">UID_{user?._id?.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); signOut(); }}
            className="bg-black text-white py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-secondary neo-transition flex items-center justify-center gap-3"
          >
            <LogOut className="w-4 h-4" strokeWidth={3} />
            DISCONNECT_SESSION
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

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
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-black text-xl italic">A</span>
        </div>
        <h1 className='text-2xl font-extrabold tracking-tight text-gray-900 uppercase'>Aura</h1>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-2">
        <MenuItems setSidebarOpen={setSidebarOpen} />
      </nav>

      {/* Profile Section */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div 
          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
          onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
        >
          <img 
            src={user?.profile_picture || '/default-avatar.png'} 
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
            alt=""
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); signOut(); }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar



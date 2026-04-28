import React, { useState } from 'react'
import Sidebar from '../components/modals/Sidebar'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Loading from '../components/modals/Loading';
import { useSelector } from 'react-redux';
import { Home, Compass, MessageCircle, User, Plus, Search, Bell, Menu } from 'lucide-react'

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Feed' },
    { icon: Compass, path: '/discover', label: 'Explore' },
    { icon: MessageCircle, path: '/messages', label: 'Messages' },
    { icon: User, path: '/profile', label: 'Profile' },
  ]

  if (!user) return <Loading />

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex'>
      {/* 🖥️ Sidebar (Desktop) */}
      <aside className='hidden lg:flex w-72 xl:w-80 h-screen sticky top-0 border-r border-gray-100 bg-white/80 backdrop-blur-xl flex-col p-6'>
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl italic">A</span>
          </div>
          <h1 className='text-2xl font-extrabold tracking-tight text-gray-900'>AURA</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              end={item.path === '/'}
              className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
              <span className="font-semibold text-[15px]">{item.label}</span>
            </NavLink>
          ))}
          
          <NavLink 
            to='/create-post'
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all mt-8"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Create Post</span>
          </NavLink>
        </nav>

        {/* Desktop User Profile Footer */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <NavLink to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <img 
              src={user?.profile_picture || '/default-avatar.png'} 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              alt=""
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">{user?.full_name}</span>
              <span className="text-xs text-gray-500 truncate">@{user?.username}</span>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* 📱 Main Content Area */}
      <main className='flex-1 flex flex-col min-w-0 h-screen'>
        {/* Mobile Header */}
        <header className='lg:hidden sticky top-0 z-[40] bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between'>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm italic">A</span>
             </div>
             <h1 className='text-xl font-black tracking-tighter'>AURA</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className='p-2 rounded-lg bg-gray-50 text-gray-900 lg:hidden'
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Viewport */}
        <div className='flex-1 overflow-y-auto no-scrollbar scroll-smooth'>
          <div className='max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8'>
            <Outlet />
          </div>
        </div>

        {/* 📱 Mobile Bottom Nav */}
        <nav className='lg:hidden sticky bottom-0 z-[40] w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-3 pb-8 flex items-center justify-between'>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              end={item.path === '/'}
              className={({isActive}) => `p-2 rounded-xl transition-all ${isActive ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
            >
              <item.icon className="w-6 h-6" />
            </NavLink>
          ))}
          <NavLink to='/create-post' className="p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/30">
            <Plus className="w-6 h-6" />
          </NavLink>
        </nav>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white p-6 animate-in slide-in-from-left duration-300">
             <Sidebar setSidebarOpen={setSidebarOpen} />
          </aside>
        </div>
      )}
    </div>
  )
}

export default Layout

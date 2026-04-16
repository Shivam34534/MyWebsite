import React, { useState } from 'react'
import Sidebar from '../components/modals/Sidebar'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../mockClerk';
import Loading from '../components/modals/Loading';
import { useSelector } from 'react-redux';
import { Home, Compass, MessageCircle, Heart, PlusSquare, User, Menu } from 'lucide-react'

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Feed' },
    { icon: Compass, path: '/discover', label: 'Explore' },
    { icon: MessageCircle, path: '/messages', label: 'Inbox' },
    { icon: User, path: '/profile', label: 'Studio' },
  ]

  return user ? (
    <div className='w-full min-h-screen bg-[#F2F2F2] flex overflow-hidden'>
      {/* 🏛️ Stable Sidebar Anchor (Desktop) */}
      <div className='hidden lg:block lg:w-[280px] xl:w-[320px] h-screen flex-shrink-0 border-r-[4px] border-black bg-white'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* 🎬 Dynamic Main Stage */}
      <div className='flex-1 flex flex-col min-h-screen relative overflow-hidden'>
        {/* Responsive Header for Mobile */}
        <header className='lg:hidden sticky top-0 flex items-center justify-between p-4 z-[40] bg-white border-b-[4px] border-black'>
            <div className="flex items-center gap-3">
                <div className="neo-border w-10 h-10 bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Home className="w-6 h-6" />
                </div>
                <h1 className='text-2xl font-black tracking-tighter'>AURA</h1>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className='neo-button p-2'
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>

        {/* Global Action Overlay for Mobile Menu */}
        {sidebarOpen && (
            <div 
                onClick={() => setSidebarOpen(false)}
                className='lg:hidden fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300'
            />
        )}
        
        {/* Mobile Sidebar Instance (Slide From Left) */}
        <div className={`lg:hidden fixed inset-y-0 left-0 z-[50] w-[280px] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r-[4px] border-black bg-white`}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Main Viewport */}
        <main className='flex-1 overflow-y-auto no-scrollbar scroll-smooth'>
            <section className='w-full h-full lg:px-8 xl:px-12 py-6 lg:py-10 max-w-7xl mx-auto'>
                <Outlet />
            </section>
        </main>

        {/* 📱 Mobile Bottom Navigation (Neo-Brutalism Style) */}
        <nav className='lg:hidden sticky bottom-0 z-[40] w-full bg-white border-t-[4px] border-black px-4 py-3 pb-8 flex items-center justify-around'>
            {navItems.map((item) => (
                <NavLink 
                    key={item.path} 
                    to={item.path}
                    className={({isActive}) => `flex flex-col items-center gap-1 transition-all duration-200 ${isActive ? 'translate-y-[-4px]' : 'hover:translate-y-[-2px]'}`}
                >
                    <div className={`p-2 neo-border transition-all ${location.pathname === item.path ? 'bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-stone-50'}`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                </NavLink>
            ))}
            {/* Center "Add" Button */}
            <NavLink 
                to='/create-post' 
                className='flex flex-col items-center -mt-10'
            >
                <div className="w-14 h-14 bg-secondary neo-border flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                    <PlusSquare className="w-8 h-8" />
                </div>
            </NavLink>
        </nav>
      </div>
    </div>

  ) : (
    <Loading />
  )
}

export default Layout

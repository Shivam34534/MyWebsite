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
    <div className='w-full min-h-screen bg-surface flex overflow-hidden'>
      {/* 🏛️ Stable Sidebar Anchor (Desktop) */}
      <div className='hidden lg:block lg:w-[280px] xl:w-[320px] h-screen flex-shrink-0'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* 🎬 Dynamic Main Stage */}
      <div className='flex-1 flex flex-col min-h-screen relative overflow-hidden bg-surface'>
        {/* Responsive Header for Mobile */}
        <header className='lg:hidden sticky top-0 flex items-center justify-between p-5 z-[40] bg-surface/80 backdrop-blur-3xl border-b border-stone-200/50 shadow-sm'>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8037b1] to-[#E1306C] flex items-center justify-center text-white shadow-lg">
                    <Home className="w-4.5 h-4.5" />
                </div>
                <h1 className='text-xl font-headline font-black text-on-surface tracking-tighter'>Gallery</h1>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className='p-2.5 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-all active:scale-90 text-on-surface'
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </header>

        {/* Global Action Overlay for Mobile Menu */}
        {sidebarOpen && (
            <div 
                onClick={() => setSidebarOpen(false)}
                className='lg:hidden fixed inset-0 z-[45] bg-stone-950/40 backdrop-blur-md animate-in fade-in duration-300'
            />
        )}
        
        {/* Mobile Sidebar Instance (Slide From Left) */}
        <div className={`lg:hidden fixed inset-y-0 left-0 z-[50] w-[280px] transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Main Viewport with Premium Gutters */}
        <main className='flex-1 overflow-y-auto no-scrollbar scroll-smooth'>
            <section className='w-full h-full lg:px-8 xl:px-12 py-6 lg:py-10 max-w-7xl mx-auto'>
                <Outlet />
            </section>
        </main>

        {/* 📱 Mobile Bottom Navigation (Instagram Style) */}
        <nav className='lg:hidden sticky bottom-0 z-[40] w-full bg-surface/90 backdrop-blur-3xl border-t border-stone-100/50 px-6 py-3 pb-8 flex items-center justify-between shadow-[0_-12px_24px_rgba(0,0,0,0.04)]'>
            {navItems.map((item) => (
                <NavLink 
                    key={item.path} 
                    to={item.path}
                    className={({isActive}) => `flex flex-col items-center gap-1 group transition-all duration-300 ${isActive ? 'text-primary' : 'text-stone-300 hover:text-stone-500'}`}
                >
                    <item.icon className={`w-6 h-6 transition-transform group-active:scale-90 ${location.pathname === item.path ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${location.pathname === item.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 line-clamp-1'}`}>{item.label}</span>
                </NavLink>
            ))}
            {/* Center "Add" Button for Mobile */}
            <NavLink 
                to='/create-post' 
                className='flex flex-col items-center gap-1 text-primary group'
            >
                <div className="w-10 h-10 rounded-2xl signature-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 -mt-8 border-4 border-surface group-active:scale-95 transition-transform">
                    <PlusSquare className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-1">Curate</span>
            </NavLink>
        </nav>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout

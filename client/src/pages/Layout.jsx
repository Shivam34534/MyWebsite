import React, { useState } from 'react'
import Sidebar from '../components/modals/Sidebar'
import { Outlet, NavLink } from 'react-router-dom'
import Loading from '../components/modals/Loading';
import { useSelector } from 'react-redux';
import { Home, Compass, MessageCircle, User, Menu, PlusSquare, X } from 'lucide-react'

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, path: '/', label: 'Feed' },
    { icon: Compass, path: '/discover', label: 'Explore' },
    { icon: MessageCircle, path: '/messages', label: 'Inbox' },
    { icon: User, path: '/profile', label: 'Studio' },
  ]

  return user ? (
    <div className='w-full min-h-screen bg-bg flex overflow-hidden selection:bg-main'>
      
      {/* ⚡ Desktop Sidebar */}
      <div className='hidden lg:block w-[280px] xl:w-[320px] h-screen flex-shrink-0'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* ⚡ Main Content Area */}
      <div className='flex-1 flex flex-col min-h-screen relative overflow-hidden'>
        
        {/* ⚡ Mobile Header */}
        <header className='lg:hidden sticky top-0 flex items-center justify-between p-4 z-[40] bg-white border-b-4 border-black'>
            <div className="flex items-center gap-3">
                <div className="neo-box bg-main p-2">
                    <Home className="w-5 h-5" />
                </div>
                <h1 className='text-2xl font-black text-black tracking-tighter italic uppercase'>Gallery</h1>
            </div>
            <button 
                onClick={() => setSidebarOpen(true)}
                className='neo-button bg-accent p-2'
            >
                <Menu className="w-6 h-6" />
            </button>
        </header>

        {/* ⚡ Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-[90] flex">
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className='absolute inset-0 bg-black/80 backdrop-blur-sm'
                />
                <div className='relative w-[300px] h-full'>
                   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                   <button 
                      onClick={() => setSidebarOpen(false)}
                      className="absolute top-6 right-[-50px] neo-button bg-secondary text-white p-2"
                   >
                      <X className="w-6 h-6" />
                   </button>
                </div>
            </div>
        )}
        
        {/* ⚡ Main Viewport */}
        <main className='flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-white lg:bg-[#f0f0f0]'>
            <section className='w-full h-full lg:p-8 xl:p-12 max-w-6xl mx-auto'>
                <div className="lg:neo-box lg:bg-white min-h-[calc(100vh-100px)] p-4 lg:p-8">
                   <Outlet />
                </div>
            </section>
        </main>

        {/* 📱 Mobile Bottom Navigation */}
        <nav className='lg:hidden sticky bottom-0 z-[40] w-full bg-white border-t-4 border-black px-4 py-2 flex items-center justify-around shadow-none'>
            {navItems.map((item) => (
                <NavLink 
                    key={item.path} 
                    to={item.path}
                    className={({isActive}) => `flex flex-col items-center gap-1 p-2 transition-all duration-100 ${isActive ? 'bg-main border-2 border-black -translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-black/60 hover:text-black'}`}
                >
                    <item.icon className="w-6 h-6" />
                </NavLink>
            ))}
            {/* Center "Add" Button */}
            <NavLink 
                to='/create-post' 
                className='flex items-center justify-center -mt-8'
            >
                <div className="neo-box bg-secondary p-4 rotate-12 hover:rotate-0 neo-transition text-white">
                    <PlusSquare className="w-6 h-6" />
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

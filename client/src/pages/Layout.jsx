import React, { useState } from 'react'
import Sidebar from '../components/modals/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../mockClerk';
import Loading from '../components/modals/Loading';
import { useSelector } from 'react-redux';

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className='w-full min-h-screen bg-surface flex overflow-hidden'>
      {/* Editorial Sidebar - Perfectly Fixed */}
      <div className='hidden lg:block lg:w-[280px] xl:w-[320px] h-screen border-r border-stone-200/50 dark:border-stone-800/20'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Content Stage */}
      <div className='flex-1 flex flex-col min-h-screen relative overflow-hidden'>
        {/* Responsive Header for Mobile */}
        <header className='lg:hidden sticky top-0 flex items-center justify-between p-4 z-[40] bg-surface/60 backdrop-blur-3xl border-b border-stone-200/50 shadow-sm'>
            <h1 className='text-2xl font-headline font-black bg-gradient-to-tr from-[#8037b1] via-[#E1306C] to-[#FF8C00] bg-clip-text text-transparent tracking-tighter'>Gallery</h1>
            <button 
                onClick={() => setSidebarOpen(true)}
                className='p-2.5 bg-surface-container/50 hover:bg-surface-container rounded-2xl transition-all active:scale-90 text-on-surface'
            >
                <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
        </header>

        {/* Global Action Overlay for Mobile Menu */}
        {sidebarOpen && (
            <div 
                onClick={() => setSidebarOpen(false)}
                className='lg:hidden fixed inset-0 z-[45] bg-stone-950/25 backdrop-blur-sm animate-in fade-in duration-300'
            />
        )}
        
        {/* Mobile Sidebar Trigger (Floating menu replacement) */}
        <div className='lg:hidden'>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        <main className='flex-1 overflow-y-auto overflow-x-hidden no-scrollbar'>
            <div className='w-full h-full'>
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout

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
    <div className='w-full flex h-screen overflow-hidden bg-surface'>
      {/* Editorial Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Stage */}
      <main className='flex-1 overflow-y-auto no-scrollbar relative'>
        {/* Responsive Header for Mobile */}
        <div className='lg:hidden fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-[40] bg-surface/80 backdrop-blur-xl border-b border-stone-200/5 shadow-sm'>
            <h1 className='text-xl font-headline font-black bg-gradient-to-tr from-[#8037b1] via-[#E1306C] to-[#FF8C00] bg-clip-text text-transparent tracking-tighter'>Gallery</h1>
            <button 
                onClick={() => setSidebarOpen(true)}
                className='p-2.5 hover:bg-surface-container rounded-2xl transition-all active:scale-90 text-on-surface'
            >
                <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
        </div>

        {/* Global Action Overlay for Mobile Menu */}
        {sidebarOpen && (
            <div 
                onClick={() => setSidebarOpen(false)}
                className='lg:hidden fixed inset-0 z-[45] bg-stone-950/20 backdrop-blur-sm animate-in fade-in duration-300'
            />
        )}
        
        <div className='pt-20 lg:pt-0 min-h-full'>
            <Outlet />
        </div>
      </main>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout

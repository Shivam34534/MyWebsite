import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Loading from '../components/Loading';
import CreatePostModal from '../components/modals/CreatePostModal';

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  if (!user) return <Loading />;

  return (
    <div className="bg-surface min-h-screen">
      <TopNavBar />
      <SideNavBar onOpenCreatePost={() => setIsPostModalOpen(true)} />
      <main className="pt-16 lg:ml-64 min-h-screen">
        <Outlet />
      </main>
      <BottomNavBar onOpenCreatePost={() => setIsPostModalOpen(true)} />
      
      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
    </div>
  )
}


export default Layout


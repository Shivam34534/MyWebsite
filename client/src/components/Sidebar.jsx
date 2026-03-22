import React, { use } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '../mockClerk'
import { useSelector } from 'react-redux'
import NotificationDropdown from './NotificationDropdown'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {



  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()

  return (
    <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col
    justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}>
      <div className='w-full'>
        <img onClick={() => navigate('/')} src={assets.logo} className="w-26 mx-auto cursor-pointer block mt-4" alt='Logo' />
        <hr className='border-gray-300 mb-8 mt-4' />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link to='/create-post' className='flex items-center justify-center
        gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500
        to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95
        transition text-white cursor-pointer'>
          <CirclePlus className='w-5 h-5' />
          Create Post
        </Link>

        {user.role === 'admin' && (
          <Link to='/admin' className='flex items-center justify-center
          gap-2 py-2 mt-3 mx-6 rounded-lg border-2 border-red-500 text-red-600
          hover:bg-red-50 active:scale-95 transition cursor-pointer font-bold'>
            Admin Panel
          </Link>
        )}
      </div>

      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center
      justify-between'>
        <div onClick={() => navigate('/profile')} className='flex gap-3 items-center cursor-pointer'>
          <img src={user.profile_picture || assets.sample_profile}
            onError={(e) => { e.target.src = assets.sample_profile }}
            alt="" className='w-10 h-10 rounded-full' />
          <div>
            <h1 className='text-sm font-medium'>{user.full_name}</h1>
            <p className='text-xs text-gray-500'>@{user.username}</p>
          </div>

        </div>
        <div className='flex items-center gap-3'>
          <LogOut onClick={signOut} title="Logout" className='w-5 h-5 text-gray-400 
          hover:text-red-500 transition cursor-pointer' />
        </div>
      </div>

    </div>
  )
}

export default Sidebar


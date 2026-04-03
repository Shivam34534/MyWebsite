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
    <div className={`w-64 xl:w-80 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col
    justify-between items-center max-sm:absolute top-0 bottom-0 z-30 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-500 ease-in-out shadow-2xl sm:shadow-none`}>
      
      <div className='w-full'>
        <div className='px-8 py-6'>
          <img 
            onClick={() => navigate('/')} 
            src={assets.logo} 
            className="w-28 cursor-pointer hover:opacity-80 transition-opacity active:scale-95 duration-200" 
            alt='Logo' 
          />
        </div>
        
        <div className='px-4'>
            <MenuItems setSidebarOpen={setSidebarOpen} />
            
            <Link to='/create-post' className='flex items-center justify-center
            gap-3 py-3.5 mt-8 mx-4 rounded-2xl bg-gradient-to-br from-indigo-600
            via-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]
            transition-all duration-300 text-white font-semibold tracking-tight cursor-pointer group'>
              <CirclePlus className='w-5 h-5 group-hover:rotate-90 transition-transform duration-300' />
              <span>Create Post</span>
            </Link>
        </div>
      </div>

      <div className='w-full p-6'>
        <div className='bg-gray-50/50 rounded-2xl p-4 flex items-center justify-between border border-gray-100 hover:bg-gray-100/50 transition-colors duration-300'>
          <div onClick={() => navigate('/profile')} className='flex gap-3 items-center cursor-pointer group'>
            <div className='relative'>
                <img src={user.profile_picture || assets.sample_profile}
                    onError={(e) => { e.target.src = assets.sample_profile }}
                    alt="" className='w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300' />
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
            </div>
            <div className='overflow-hidden'>
              <h1 className='text-sm font-bold text-slate-900 truncate'>{user.full_name}</h1>
              <p className='text-[11px] text-slate-500 font-medium truncate'>@{user.username}</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className='p-2 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all duration-300'
            title="Logout"
          >
            <LogOut className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar


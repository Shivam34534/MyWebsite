import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

const MenuItems = ({ setSidebarOpen }) => {
  const { hasUnreadMessages, setHasUnreadMessages } = useSocket();

  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium'>
        {
         menuItemsData.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to==='/'} onClick={() => {
                setSidebarOpen(false);
                if (label === 'Messages') {
                    setHasUnreadMessages(false);
                }
            }} className={({isActive})=> `px-3.5 py-2 flex items-center justify-between
            rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-700' : 
            'hover:bg-gray-50'}`}>
                <div className='flex items-center gap-3'>
                    <Icon className='w-5 h-5'/>
                    {label}
                </div>
                {label === 'Messages' && hasUnreadMessages && (
                    <div className='w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm'></div>
                )}
            </NavLink>
         ))
        }
      
    </div>
  )
}

export default MenuItems

import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className='px-4 text-slate-600 space-y-1.5'>
        {
         menuItemsData.map(({ to, label, Icon }) => (
            <NavLink 
                key={to} 
                to={to} 
                end={to==='/'} 
                onClick={() => setSidebarOpen(false)} 
                className={({isActive})=> `px-5 py-3 flex items-center justify-between
                rounded-2xl transition-all duration-300 group ${isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 
                'hover:bg-slate-50 hover:text-slate-900'}`}
            >
                <div className='flex items-center gap-4'>
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
                    <span className='font-bold text-sm tracking-tight'>{label}</span>
                </div>
            </NavLink>
         ))
        }
    </div>
  )
}

export default MenuItems

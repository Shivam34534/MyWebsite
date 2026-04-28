import React from 'react'
import { menuItemsData } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className='flex flex-col gap-1'>
      {
        menuItemsData.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
            }`}
          >
            <span 
                className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110" 
            >
              {icon}
            </span>
            <span className='text-[15px]'>{label}</span>
          </NavLink>
        ))
      }
    </div>
  )
}

export default MenuItems

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
            className={({ isActive }) => `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
              isActive 
                ? 'bg-stone-100/50 dark:bg-stone-900/50 text-stone-950 dark:text-stone-50 font-extrabold shadow-sm border border-stone-200/20' 
                : 'text-stone-500 dark:text-stone-400 font-medium hover:bg-stone-200/50'
            } active:scale-95`}
          >
            <span className="material-symbols-outlined transition-transform duration-200 group-hover:scale-110" style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>
              {icon}
            </span>
            <span className='font-headline tracking-tight text-base'>{label}</span>
          </NavLink>
        ))
      }
    </div>
  )
}

export default MenuItems


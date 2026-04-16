import React from 'react'
import { menuItemsData } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className='flex flex-col gap-3'>
      {
        menuItemsData.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-5 p-4 transition-all duration-200 group active:translate-y-1 ${
              isActive 
                ? 'bg-primary text-black neo-border shadow-[4px_4px_0px_0px_#000] font-black' 
                : 'text-black/60 font-black hover:bg-stone-50 hover:text-black uppercase'
            }`}
          >
            {({ isActive }) => (
              <>
                <span 
                    className="material-symbols-outlined font-black transition-transform duration-200 group-hover:rotate-12" 
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span className='text-sm uppercase tracking-widest leading-none'>{label}</span>
              </>
            )}
          </NavLink>
        ))
      }
    </div>
  )
}

export default MenuItems

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, User, ArrowRight } from 'lucide-react'

const UserCard = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-5 flex items-center gap-4 hover:shadow-xl hover:shadow-gray-200/40 transition-all group cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
      <div className="relative">
        <img 
          src={user.profile_picture || '/default-avatar.png'} 
          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-110" 
          alt="" 
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-white" title="Online" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
          {user.full_name}
        </h3>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight truncate">
          @{user.username}
        </p>
      </div>

      <button className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
        <Plus size={18} />
      </button>
    </div>
  )
}

export default UserCard
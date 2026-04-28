import React from 'react'
import { X, Mail, MapPin, Calendar, Link as LinkIcon, Edit3 } from 'lucide-react'
import moment from 'moment'

const ProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Header / Cover */}
        <div className="h-40 bg-gradient-to-br from-primary to-secondary" />

        {/* Content */}
        <div className="px-8 pb-10 -mt-12 text-center">
          <div className="inline-block p-1.5 rounded-[2.2rem] bg-white shadow-xl mb-4">
            <img 
              src={user?.profile_picture || '/default-avatar.png'} 
              className="w-28 h-28 rounded-[1.8rem] object-cover"
              alt=""
            />
          </div>

          <h2 className="text-2xl font-black text-gray-900">{user?.full_name}</h2>
          <p className="text-gray-500 font-semibold mb-6">@{user?.username}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-lg font-black text-gray-900">{user?.followers?.length || 0}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</span>
             </div>
             <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-lg font-black text-gray-900">{user?.following?.length || 0}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Following</span>
             </div>
          </div>

          <div className="space-y-4 text-left px-2 mb-8">
             <div className="flex items-center gap-3 text-gray-500 font-medium">
                <Mail size={18} className="text-primary" />
                <span className="text-sm">{user?.email}</span>
             </div>
             <div className="flex items-center gap-3 text-gray-500 font-medium">
                <MapPin size={18} className="text-secondary" />
                <span className="text-sm">{user?.location || 'Unknown location'}</span>
             </div>
             <div className="flex items-center gap-3 text-gray-500 font-medium">
                <Calendar size={18} className="text-accent" />
                <span className="text-sm">Member since {moment(user?.createdAt).format('MMMM YYYY')}</span>
             </div>
          </div>

          <button className="w-full button-primary py-4 flex items-center justify-center gap-2">
             <Edit3 size={18} /> Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
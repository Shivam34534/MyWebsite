import React from 'react'
import { MapPin, Calendar, Mail, Edit3, Settings } from 'lucide-react'
import moment from 'moment'

const UserProfileInfo = ({ user, isOwnProfile }) => {
  return (
    <div className="glass-card bg-white p-8">
       <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-10 text-center md:text-left">
          <div className="relative group">
             <div className="p-1.5 rounded-[2.2rem] bg-white shadow-xl border border-gray-50">
                <img 
                  src={user?.profile_picture || '/default-avatar.png'} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[1.8rem] object-cover"
                  alt=""
                />
             </div>
             {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                   <Edit3 size={18} />
                </button>
             )}
          </div>

          <div className="flex-1">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                   <h1 className="text-3xl font-black text-gray-900">{user?.full_name}</h1>
                   <p className="text-gray-500 font-semibold">@{user?.username}</p>
                </div>
                <div className="flex gap-3 justify-center md:justify-start">
                   {isOwnProfile ? (
                      <>
                         <button className="button-secondary px-6 py-2.5">Edit Profile</button>
                         <button className="button-secondary p-2.5"><Settings size={20} /></button>
                      </>
                   ) : (
                      <button className="button-primary px-8 py-2.5">Follow</button>
                   )}
                </div>
             </div>

             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-secondary" /> {user?.location || 'The Web'}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> Joined {moment(user?.createdAt).format('MMM YYYY')}</span>
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-accent" /> {user?.email}</span>
             </div>
          </div>
       </div>

       <div className="border-t border-gray-100 pt-8 flex items-center justify-around md:justify-start md:gap-20 text-center md:text-left">
          {[
             { label: 'Posts', value: user?.posts_count || 0 },
             { label: 'Followers', value: user?.followers?.length || 0 },
             { label: 'Following', value: user?.following?.length || 0 },
          ].map((stat, i) => (
             <div key={i} className="flex flex-col">
                <span className="text-2xl font-black text-gray-900">{stat.value}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
             </div>
          ))}
       </div>

       <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
             "{user?.bio || "Exploring the intersection of design and technology."}"
          </p>
       </div>
    </div>
  )
}

export default UserProfileInfo
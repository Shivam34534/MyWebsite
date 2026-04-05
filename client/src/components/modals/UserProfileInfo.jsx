import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.user.value)
    const isOwnProfile = !profileId || profileId === currentUser?._id

    return (
        <div className="relative px-6 pb-8 flex flex-col gap-6">
            {/* Profile Meta Segment */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                    {/* Avatar Orbit */}
                    <div className="relative -mt-16 md:-mt-20 group">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full story-ring p-[4px]">
                            <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden bg-stone-100">
                                <img 
                                    src={user?.profile_picture || assets.sample_profile} 
                                    onError={(e) => { e.target.src = assets.sample_profile }}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                                    alt={user?.full_name} 
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-surface rounded-full shadow-lg"></div>
                    </div>

                    {/* Profile Credentials */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[28px] md:text-4xl font-black font-headline tracking-tighter text-on-surface uppercase">{user?.full_name}</h2>
                            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm font-bold text-on-surface-variant">@{user?.username}</span>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">Gallery Pro</span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Controls */}
                <div className="flex items-center gap-3">
                    {isOwnProfile ? (
                        <button 
                            onClick={() => setShowEdit(true)}
                            className="px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-sm border border-outline-variant/10"
                        >
                            Edit Studio
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest active:scale-95">Follow Creator</button>
                            <button className="p-3 bg-surface-container-high hover:bg-stone-200 dark:hover:bg-stone-800 rounded-2xl transition-all shadow-sm border border-outline-variant/10">
                                <span className="material-symbols-outlined">chat</span>
                            </button>
                        </div>
                    )}
                    <button className="p-3 bg-surface-container-high hover:bg-stone-200 dark:hover:bg-stone-800 rounded-2xl transition-all shadow-sm border border-outline-variant/10">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Narrative Metadata */}
            <div className="flex flex-col gap-4">
                <p className="text-sm md:text-base font-medium text-on-surface-variant leading-relaxed max-w-2xl">{user?.bio || "Exploring the intersection of storytelling and editorial photography."}</p>
                
                {/* Engagement Analytics */}
                <div className="flex items-center gap-8 py-4 border-t border-stone-200/10 mt-2">
                    <div className="flex flex-col">
                        <span className="text-lg font-black font-headline text-on-surface leading-none">{posts?.length || 0}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-1">Stories</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black font-headline text-on-surface leading-none">{(user?.connections?.length || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-1">Network</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black font-headline text-on-surface leading-none">{(posts?.reduce((acc, p) => acc + (p.likes_count || 0), 0) || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-1">Impact</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileInfo
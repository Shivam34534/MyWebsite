import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.user.value)
    const isOwnProfile = !profileId || profileId === currentUser?._id

    return (
        <div className="relative px-4 md:px-6 flex flex-col gap-8">
            {/* Profile Meta Segment */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                    {/* Avatar Orbit */}
                    <div className="relative -mt-16 md:-mt-24 group">
                        <div className="w-32 h-32 md:w-44 md:h-44 neo-border bg-black p-0.5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_#A3E635] transition-all">
                            <div className="w-full h-full neo-border border-white bg-stone-100 overflow-hidden">
                                <img 
                                    src={user?.profile_picture || assets.sample_profile} 
                                    onError={(e) => { e.target.src = assets.sample_profile }}
                                    className="w-full h-full object-cover grayscale-[0.2] transition-all" 
                                    alt={user?.full_name} 
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary neo-border flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                             <span className="material-symbols-outlined text-black font-black">check</span>
                        </div>
                    </div>

                    {/* Profile Credentials */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-black uppercase leading-none">{user?.full_name}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-black text-black/60 italic leading-none truncate max-w-[200px]">@{user?.username}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-tertiary neo-border shadow-[3px_3px_0px_0px_#000]">AURA ELITE</span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Controls */}
                <div className="flex flex-wrap items-center gap-4">
                    {isOwnProfile ? (
                        <button 
                            onClick={() => setShowEdit(true)}
                            className="neo-button bg-accent"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            EDIT STUDIO
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button className="neo-button bg-primary px-8">FOLLOW CREATOR</button>
                            <button className="neo-button bg-white p-3">
                                <span className="material-symbols-outlined">chat</span>
                            </button>
                        </div>
                    )}
                    <button className="neo-button bg-white p-3">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Narrative Metadata */}
            <div className="flex flex-col gap-6">
                <div className="neo-card bg-stone-50 rotate-[0.5deg]">
                    <p className="text-lg font-bold text-black leading-tight max-w-2xl">
                        {user?.bio || "STORYTELLER. VISIONARY. BRUTALIST."}
                    </p>
                </div>
                
                {/* Engagement Analytics */}
                <div className="grid grid-cols-3 gap-0 neo-border overflow-hidden bg-black shadow-[8px_8px_0px_0px_#000]">
                    <div className="flex flex-col items-center justify-center py-4 bg-white border-r-[3px] border-black hover:bg-lime-400 transition-colors">
                        <span className="text-2xl font-black">{posts?.length || 0}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">STORIES</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4 bg-white border-r-[3px] border-black hover:bg-pink-400 transition-colors">
                        <span className="text-2xl font-black">{(user?.connections?.length || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">NETWORK</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4 bg-white hover:bg-accent transition-colors">
                        <span className="text-2xl font-black">{(posts?.reduce((acc, p) => acc + (p.likes_count || 0), 0) || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">IMPACT</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default UserProfileInfo
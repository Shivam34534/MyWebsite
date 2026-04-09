import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Settings, Share2, MessageCircle, UserPlus, CheckCircle } from 'lucide-react'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.user.value)
    const isOwnProfile = !profileId || profileId === currentUser?._id

    return (
        <div className="relative px-6 pb-8 flex flex-col gap-8">
            {/* ⚡ Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                    {/* ⚡ Avatar Node */}
                    <div className="relative -mt-20 group">
                        <div className="w-32 h-32 md:w-44 md:h-44 neo-box bg-white overflow-hidden p-1 -rotate-2 group-hover:rotate-0 neo-transition">
                            <img 
                                src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 neo-transition scale-100 group-hover:scale-110" 
                                alt={user?.full_name} 
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-main border-4 border-black rounded-full z-10"></div>
                    </div>

                    {/* ⚡ User Credentials */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">{user?.full_name}</h2>
                            <CheckCircle className="text-black w-8 h-8" strokeWidth={3} />
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="neo-box bg-black text-white px-3 py-1 font-bold text-sm tracking-tighter">@{user?.username}</span>
                            <span className="font-black uppercase tracking-widest text-[10px] text-black/40">NEO_CURATOR_V2</span>
                        </div>
                    </div>
                </div>

                {/* ⚡ Interaction Controls */}
                <div className="flex flex-wrap items-center gap-4">
                    {isOwnProfile ? (
                        <button 
                            onClick={() => setShowEdit(true)}
                            className="neo-button bg-accent flex items-center gap-2"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-black uppercase text-sm">Update Studio</span>
                        </button>
                    ) : (
                        <>
                            <button className="neo-button-primary flex items-center gap-2 px-8">
                                <UserPlus className="w-5 h-5" />
                                <span className="font-black uppercase text-sm">Follow</span>
                            </button>
                            <button className="neo-button bg-white">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    <button className="neo-button bg-white">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* ⚡ Bio / Narrative */}
            <div className="flex flex-col gap-6 max-w-3xl">
                <div className="neo-box bg-white p-4 rotate-1">
                    <p className="text-lg font-bold leading-relaxed">{user?.bio || "COMMUNICATING_VIA_VISUAL_STIMULI. DATA_ENTRY_PENDING."}</p>
                </div>
                
                {/* ⚡ Stats Grid */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t-4 border-black border-dashed mt-2">
                    <div className="flex flex-col">
                        <span className="text-3xl font-black italic text-black leading-none">{posts?.length || 0}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mt-2">ENTRIES</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black italic text-black leading-none">{(user?.connections?.length || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mt-2">NETWORK_NODES</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black italic text-black leading-none">{(posts?.reduce((acc, p) => acc + (p.likes_count || 0), 0) || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mt-2">TOTAL_REACTIONS</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileInfo
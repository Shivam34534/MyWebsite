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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-10">
                    {/* ⚡ Avatar Node */}
                    <div className="relative -mt-24 group">
                        <div className="w-36 h-36 md:w-52 md:h-52 neo-box bg-white overflow-hidden p-1.5 -rotate-3 group-hover:rotate-0 neo-transition">
                            <img 
                                src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 neo-transition scale-100 group-hover:scale-110" 
                                alt={user?.full_name} 
                            />
                        </div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-main border-4 border-black rounded-full z-10 animate-pulse"></div>
                    </div>

                    {/* ⚡ User Credentials */}
                    <div className="flex flex-col mb-4">
                        <div className="flex items-center gap-4">
                            <h1>{user?.full_name}</h1>
                            <div className="bg-black rounded-full p-1 border-2 border-white shadow-neo-sm">
                                <CheckCircle className="text-main w-8 h-8 md:w-10 md:h-10" strokeWidth={4} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <span className="neo-box bg-black text-white px-5 py-1.5 font-mono text-sm font-black tracking-widest uppercase">NODE_ALIAS: @{user?.username}</span>
                            <span className="font-mono font-black uppercase tracking-[0.3em] text-[10px] text-black/30">NEO_CURATOR_PROTOCOL_V7</span>
                        </div>
                    </div>
                </div>

                {/* ⚡ Interaction Controls */}
                <div className="flex flex-wrap items-center gap-5 mb-4">
                    {isOwnProfile ? (
                        <button 
                            onClick={() => setShowEdit(true)}
                            className="neo-button bg-accent flex items-center gap-3 px-8 py-3 group"
                        >
                            <Settings className="w-6 h-6 group-hover:rotate-90 neo-transition" strokeWidth={3} />
                            <span className="font-black uppercase italic">UPDATE_STUDIO</span>
                        </button>
                    ) : (
                        <>
                            <button className="neo-button-primary flex items-center gap-3 px-10 py-3">
                                <UserPlus className="w-6 h-6" strokeWidth={3} />
                                <span className="font-black uppercase italic">FOLLOW_NODE</span>
                            </button>
                            <button className="neo-button bg-white p-3 hover:bg-secondary hover:text-white">
                                <MessageCircle className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </>
                    )}
                    <button className="neo-button bg-white p-3 hover:bg-main">
                        <Share2 className="w-6 h-6" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* ⚡ Bio / Narrative */}
            <div className="flex flex-col gap-8 max-w-4xl mt-4">
                <div className="neo-box bg-white p-6 rotate-1 hover:rotate-0 neo-transition border-l-8">
                    <p className="text-xl md:text-2xl font-bold leading-relaxed italic uppercase tracking-tight">
                       <span className="text-secondary mr-2">/</span>
                       {user?.bio || "STORYTELLING_VIA_VISUAL_DECRYPTION. DATA_ENTRY_PENDING_BY_CURATOR."}
                    </p>
                </div>
                
                {/* ⚡ Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-t-4 border-black border-dashed">
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-2 italic">DATA_ENTRIES</span>
                        <span className="text-4xl md:text-5xl font-black italic text-black leading-none">{posts?.length || 0}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-2 italic">NETWORK_NODES</span>
                        <span className="text-4xl md:text-5xl font-black italic text-black leading-none">{(user?.connections?.length || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-2 italic">TOTAL_IMPACT</span>
                        <span className="text-4xl md:text-5xl font-black italic text-black leading-none">{(posts?.reduce((acc, p) => acc + (p.likes_count || 0), 0) || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileInfo
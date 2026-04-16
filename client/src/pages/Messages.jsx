import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import Loading from '../components/modals/Loading'
import { useSelector } from 'react-redux'
import ChatBox from './ChatBox'

const Messages = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [connections, setConnections] = useState([])
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const token = await getToken()
                const { data } = await api.get('/api/user/connections', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (data.success) {
                    const connectionUsers = await Promise.all(
                        data.connections.map(async (userId) => {
                            try {
                                const { data: userData } = await api.get(`/api/user/profile/${userId}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                })
                                return userData.success ? userData.profile : null
                            } catch (error) {
                                return null
                            }
                        })
                    )
                    setConnections(connectionUsers.filter(user => user !== null))
                }
            } catch (error) {
                console.error('Error fetching connections:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchConnections()
    }, [])

    const filteredConnections = connections.filter(user => 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) return <Loading />

    return (
        <main className="w-full flex h-screen overflow-hidden bg-[#F2F2F2]">
            {/* Conversations List */}
            <section className={`${id ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-[420px] flex-shrink-0 flex flex-col bg-white border-r-[4px] border-black`}>
                <div className="p-8 flex flex-col gap-8 border-b-[4px] border-black bg-stone-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black italic tracking-tighter text-black uppercase">CHATS.SYS</h2>
                        <button className="w-10 h-10 neo-border bg-black text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                            <span className="material-symbols-outlined font-black">edit_square</span>
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black text-[24px] font-black">search</span>
                        <input 
                            type="text" 
                            placeholder="SEARCH_LOGS..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white neo-border text-sm font-black placeholder:text-black/30 outline-none focus:bg-lime-50 transition-all uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 flex flex-col gap-4">
                    {filteredConnections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-stone-50 neo-border neo-shadow italic">
                             <div className="w-16 h-16 neo-border bg-accent flex items-center justify-center -rotate-12">
                                <span className="material-symbols-outlined text-4xl font-black">mail</span>
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-40">COMMUNICATION_CHANNELS_EMPTY</p>
                        </div>
                    ) : (
                        filteredConnections.map((user) => (
                            <div 
                                key={user._id} 
                                onClick={() => navigate(`/messages/${user._id}`)}
                                className={`flex items-center gap-4 p-4 neo-border transition-all cursor-pointer group ${id === user._id ? 'bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-stone-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 neo-border bg-black p-0.5 group-hover:rotate-3 transition-transform">
                                        <div className="w-full h-full bg-white overflow-hidden">
                                            <img 
                                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0" 
                                                src={user.profile_picture || assets.sample_profile} 
                                                onError={(e) => { e.target.src = assets.sample_profile }}
                                                alt={user.full_name} 
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime-400 neo-border shadow-[2px_2px_0px_0px_#000]"></div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-black text-lg text-black truncate pr-2 uppercase italic leading-none">{user.full_name}</span>
                                        <span className="text-[9px] font-black uppercase tracking-tighter bg-black text-white px-1">ACTIVE</span>
                                    </div>
                                    <p className="text-[10px] text-black/40 truncate font-black tracking-widest">@{user.username.toUpperCase()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Chat Window */}
            <section className={`${!id ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white overflow-hidden`}>
                {id ? (
                    <ChatBox />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-8 bg-[#EEE] relative">
                        <div className="absolute top-10 right-10 w-20 h-20 neo-border bg-accent rotate-12 opacity-20"></div>
                        <div className="absolute bottom-20 left-20 w-32 h-32 neo-border bg-primary -rotate-6 opacity-20"></div>
                        
                        <div className="w-32 h-32 neo-border bg-white flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] z-10 rotate-3">
                             <span className="material-symbols-outlined text-7xl text-black font-black">forum</span>
                        </div>
                        <div className="max-w-md z-10">
                            <h3 className="text-5xl font-black text-black mb-4 uppercase tracking-tighter">SELECT_THREAD</h3>
                            <p className="text-sm text-black/60 font-bold uppercase tracking-widest leading-relaxed">
                                INITIALIZE_ENCRYPTED_COMMUNICATION_LINK. 
                                SHARE_GALLERY_PROTOCOLS_WITH_THE_NETWORK.
                            </p>
                        </div>
                        <button className="neo-button bg-black text-white px-10 py-5 text-sm z-10 hover:bg-stone-800">
                             INITIALIZE_NEW_CHAT
                        </button>
                    </div>
                )}
            </section>
        </main>

    )
}

export default Messages

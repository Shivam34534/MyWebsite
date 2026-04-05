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
        <main className="lg:ml-64 flex h-screen overflow-hidden bg-surface">
            {/* Conversations List */}
            <section className={`${id ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-surface border-r border-stone-200/15`}>
                <div className="px-6 py-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black font-headline tracking-tight text-on-surface">Conversations</h2>
                        <button className="p-2 hover:bg-surface-container rounded-xl transition-all text-on-surface-variant">
                            <span className="material-symbols-outlined">edit_square</span>
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder="Search gallery chat..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border-none text-sm placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-on-surface" 
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-24 flex flex-col gap-1">
                    {filteredConnections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-3 opacity-40">
                             <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                             <p className="text-xs font-bold uppercase tracking-widest">No chats active</p>
                        </div>
                    ) : (
                        filteredConnections.map((user) => (
                            <div 
                                key={user._id} 
                                onClick={() => navigate(`/messages/${user._id}`)}
                                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${id === user._id ? 'bg-stone-100/80 dark:bg-stone-900/80 shadow-sm border border-stone-200/10' : 'hover:bg-surface-container-low'}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-surface shadow-sm transition-transform group-hover:scale-105" 
                                        src={user.profile_picture || assets.sample_profile} 
                                        onError={(e) => { e.target.src = assets.sample_profile }}
                                        alt={user.full_name} 
                                    />
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-surface rounded-full shadow-sm"></div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-headline font-extrabold text-sm text-on-surface truncate pr-2">{user.full_name}</span>
                                        <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-tighter">now</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant/80 truncate font-medium">@{user.username}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Chat Window */}
            <section className={`${!id ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-surface-container-lowest overflow-hidden`}>
                {id ? (
                    <ChatBox />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-6">
                        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center glass-effect">
                             <span className="material-symbols-outlined text-4xl text-primary drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-xl font-black font-headline text-on-surface mb-2">Your Conversations</h3>
                            <p className="text-sm text-on-surface-variant/60 font-medium">Select a friend from the list to start an editorial chat and share your gallery moments.</p>
                        </div>
                        <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">Send a New Message</button>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Messages

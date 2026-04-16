import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import Loading from '../components/modals/Loading'
import { useSelector } from 'react-redux'
import moment from 'moment'

const ChatBox = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const messageEndRef = useRef(null)
    const { getToken } = useAuth()
    const currentUser = useSelector((state) => state.user.value)

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const token = await getToken()
                // Fetch user profile
                const { data: userData } = await api.get(`/api/user/profile/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (userData.success) {
                    setUser(userData.profile)
                }
                // Fetch messages
                const { data: messagesData } = await api.post('/api/message/get', { to_user_id: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (messagesData.success) {
                    setMessages(messagesData.messages)
                }
            } catch (error) {
                console.error('ChatBox error:', error)
                toast.error('Failed to load chat thread')
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchChatData()
    }, [id])

    const sendMessage = async () => {
        if (!text.trim() && !image) return
        try {
            const token = await getToken()
            const formData = new FormData()
            formData.append('to_user_id', id)
            if (text) formData.append('text', text)
            if (image) formData.append('image', image)

            const { data } = await api.post('/api/message/send', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                setMessages(prev => [...prev, data.message])
                setText('')
                setImage(null)
            }
        } catch (error) {
            toast.error("Failed to send message")
        }
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    if (loading || !user) return <Loading />

    return (
        <section className="flex flex-1 flex-col h-full bg-white overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 md:py-6 border-b-[4px] border-black flex items-center justify-between bg-stone-50 z-10 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/messages')} 
                        className="md:hidden w-10 h-10 neo-border bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all"
                    >
                         <span className="material-symbols-outlined font-black">arrow_back</span>
                    </button>
                    <div 
                        onClick={() => navigate(`/profile/${user.username}`)}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 neo-border bg-black p-0.5 group-hover:rotate-3 transition-transform">
                                <div className="w-full h-full bg-white overflow-hidden">
                                    <img 
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0" 
                                        src={user.profile_picture || assets.sample_profile} 
                                        onError={(e) => { e.target.src = assets.sample_profile }}
                                        alt={user.full_name} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg text-black group-hover:text-primary transition-colors leading-none uppercase italic">{user.full_name}</span>
                            <span className="text-[10px] text-black/40 font-black uppercase tracking-widest flex items-center gap-1.5 leading-none mt-1">
                                <div className="w-2 h-2 bg-lime-400 neo-border"></div> LINK_ESTABLISHED
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 neo-border bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[20px] font-black">call</span>
                    </button>
                    <button className="w-10 h-10 neo-border bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[20px] font-black">videocam</span>
                    </button>
                </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-8 bg-[#EEE] bg-grid-pattern">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-20 italic">
                         <div className="w-16 h-16 neo-border bg-tertiary flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl font-black">chat</span>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-40">ENCRYPTED_LOGS_NULL</p>
                    </div>
                ) : (
                    [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, index) => {
                        const isSent = msg.from_user_id === currentUser?._id
                        return (
                            <div key={msg._id || index} className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%] ${isSent ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className={`relative px-4 py-3 neo-border transition-all animate-in slide-in-from-bottom-2 duration-300 ${
                                    isSent 
                                    ? 'bg-primary text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                }`}>
                                    {msg.message_type === 'image' && (
                                        <div className="mb-2 neo-border border-black bg-black p-0.5">
                                            <img src={msg.media_url} alt="Gallery item" className="w-full h-auto max-h-[300px] object-cover grayscale-[0.2]" />
                                        </div>
                                    )}
                                    <p className="text-[15px] font-bold leading-tight">{msg.text}</p>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${isSent ? 'pr-1' : 'pl-1'}`}>
                                    {moment(msg.createdAt).format('HH:MM:SS')}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Control Bar */}
            <div className="p-6 bg-stone-50 border-t-[4px] border-black pb-32 md:pb-6">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="w-12 h-12 neo-border bg-white flex items-center justify-center hover:bg-black hover:text-white cursor-pointer transition-all active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_#000]">
                            <span className="material-symbols-outlined font-black">image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) setImage(file)
                            }} />
                        </label>
                    </div>
                    {image && (
                        <div className="relative group">
                            <div className="w-14 h-14 neo-border bg-black p-0.5 shadow-[4px_4px_0_0_#A3E635]">
                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <button onClick={() => setImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white neo-border w-7 h-7 flex items-center justify-center text-xs font-black shadow-[2px_2px_0_0_#000]">×</button>
                        </div>
                    )}
                    <div className="flex-1 relative flex items-center">
                        <input 
                            type="text" 
                            placeholder="TYPE_MESSAGE..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            className="w-full bg-white neo-border px-6 py-4 text-sm font-black placeholder:text-black/20 focus:bg-stone-50 outline-none transition-all shadow-[4px_4px_0px_0px_#000]" 
                        />
                    </div>
                    <button 
                        onClick={sendMessage}
                        className={`w-14 h-14 neo-border flex items-center justify-center transition-all active:translate-y-1 active:shadow-none ${text.trim() || image ? 'bg-primary shadow-[4px_4px_0px_0px_#000]' : 'bg-stone-200 text-black/20 cursor-not-allowed shadow-none'}`}
                    >
                         <span className="material-symbols-outlined font-black" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatBox

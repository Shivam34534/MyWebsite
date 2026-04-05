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
        <section className="flex flex-1 flex-col h-full bg-surface-container-lowest overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 md:py-6 border-b border-stone-200/15 flex items-center justify-between bg-surface/50 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/messages')} 
                        className="md:hidden p-2 hover:bg-surface-container rounded-xl transition-all"
                    >
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div 
                        onClick={() => navigate(`/profile/${user.username}`)}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="relative flex-shrink-0">
                            <img 
                                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-surface shadow-sm transition-transform group-hover:scale-105" 
                                src={user.profile_picture || assets.sample_profile} 
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt={user.full_name} 
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-headline font-extrabold text-sm md:text-base text-on-surface group-hover:text-primary transition-colors leading-tight">{user.full_name}</span>
                            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                    </button>
                    <button className="p-2.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px]">videocam</span>
                    </button>
                    <button className="p-2.5 hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px]">info</span>
                    </button>
                </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-6 bg-surface-container-lowest">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 gap-3 py-20">
                         <span className="material-symbols-outlined text-5xl">chat</span>
                         <p className="text-sm font-bold uppercase tracking-widest">Beginning of conversation</p>
                    </div>
                ) : (
                    [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, index) => {
                        const isSent = msg.from_user_id === currentUser?._id
                        return (
                            <div key={msg._id || index} className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[70%] ${isSent ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className={`relative px-4 py-3 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-1 duration-300 ${
                                    isSent 
                                    ? 'bg-primary text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-surface-container text-on-surface rounded-2xl rounded-tl-none border border-outline-variant/10'
                                }`}>
                                    {msg.message_type === 'image' && (
                                        <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                                            <img src={msg.media_url} alt="Gallery item" className="w-full h-auto max-h-[300px] object-cover" />
                                        </div>
                                    )}
                                    <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                                </div>
                                <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter opacity-70">
                                    {moment(msg.createdAt).format('hh:mm A')}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Control Bar */}
            <div className="p-6 bg-surface/50 backdrop-blur-xl border-t border-stone-200/15 pb-24 md:pb-6">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="flex items-center gap-1.5 pr-2">
                        <label className="p-2.5 md:p-3 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary cursor-pointer transition-all">
                            <span className="material-symbols-outlined text-[24px]">image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) setImage(file)
                            }} />
                        </label>
                        <button className="hidden sm:flex p-2.5 md:p-3 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-all">
                             <span className="material-symbols-outlined text-[24px]">sticky_note_2</span>
                        </button>
                    </div>
                    {image && (
                        <div className="relative group">
                            <img src={URL.createObjectURL(image)} alt="Preview" className="w-12 h-12 rounded-xl object-cover border-2 border-primary" />
                            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg">×</button>
                        </div>
                    )}
                    <div className="flex-1 relative flex items-center">
                        <input 
                            type="text" 
                            placeholder="Message gallery friend..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            className="w-full bg-surface-container-high rounded-2xl px-5 py-3.5 pr-12 text-sm placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/30 border-none transition-all font-medium text-on-surface" 
                        />
                        <button className="absolute right-3 p-1.5 text-on-surface-variant hover:text-primary">
                             <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                        </button>
                    </div>
                    <button 
                        onClick={sendMessage}
                        className={`p-3.5 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/10 ${text.trim() || image ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'}`}
                    >
                         <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatBox

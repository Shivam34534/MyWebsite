import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import api from '../../api/axios.js'
import { useAuth } from '../../mockClerk.jsx'
import { assets } from '../../assets/assets.js'

const RecentMessages = () => {
    const [messages, setMessages] = useState([])
    const { getToken } = useAuth()

    const fetchRecentMessages = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/user/recent-messages', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Error fetching recent messages:', error)
        }
    }

    useEffect(() => {
        fetchRecentMessages()
    }, [])

    return (
        <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
                <div className="py-8 text-center bg-surface-container-low rounded-2xl border border-outline-variant/10">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">No recent activity</p>
                </div>
            ) : (
                messages.map((message, index) => {
                    const fromUser = typeof message.from_user_id === 'object' ? message.from_user_id : {}
                    return (
                        <Link 
                            to={`/messages/${fromUser._id}`} 
                            key={index} 
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-all group"
                        >
                            <div className="relative flex-shrink-0">
                                <img 
                                    src={fromUser.profile_picture || assets.sample_profile} 
                                    alt=""
                                    onError={(e) => { e.target.src = assets.sample_profile }}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-surface shadow-sm group-hover:scale-105 transition-transform" 
                                />
                                {!message.seen && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-surface rounded-full shadow-sm"></div>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <p className="font-headline font-bold text-[13px] text-on-surface truncate group-hover:text-primary transition-colors">{fromUser.full_name}</p>
                                    <p className="text-[9px] text-on-surface-variant/60 font-bold uppercase whitespace-nowrap ml-2">{moment(message.createdAt).fromNow(true)}</p>
                                </div>
                                <p className="text-[11px] text-on-surface-variant/70 truncate font-medium">
                                    {message.text || 'Shared a media gallery'}
                                </p>
                            </div>
                        </Link>
                    )
                })
            )}
        </div>
    )
}

export default RecentMessages

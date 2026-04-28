import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { MessageCircle, ArrowRight } from 'lucide-react'
import moment from 'moment'

const RecentMessages = () => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await api.get('/api/message/conversations')
        if (data.success) {
          setConversations(data.data.slice(0, 5)) // Top 5
        }
      } catch (error) {
        console.error("Failed to fetch recent messages", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  return (
    <div className="glass-card bg-white/50">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Hot Messages</h3>
         </div>
         <button onClick={() => navigate('/messages')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
            Inbox <ArrowRight size={10} />
         </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <div 
              key={conv._id}
              onClick={() => navigate(`/messages/${conv.participant._id}`)}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <img 
                src={conv.participant.profile_picture || '/default-avatar.png'} 
                className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" 
                alt="" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{conv.participant.full_name}</span>
                   <span className="text-[9px] text-gray-400 font-bold uppercase">{moment(conv.lastMessage.createdAt).fromNow(true)}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">{conv.lastMessage.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentMessages

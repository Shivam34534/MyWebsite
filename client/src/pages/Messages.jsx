import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { Search, MessageSquare, Plus, MoreVertical, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const Messages = () => {
  const user = useSelector((state) => state.user.value)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/api/message/conversations')
        if (data.success) {
          setConversations(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [])

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-500 font-medium">Keep the conversation going.</p>
        </div>
        <button className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden min-h-[600px]">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:border-primary outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex flex-col">
          {loading ? (
            [1,2,3,4,5].map(i => (
              <div key={i} className="p-6 border-b border-gray-50 animate-pulse flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2 py-2">
                   <div className="h-4 w-1/4 bg-gray-100 rounded" />
                   <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))
          ) : conversations.length > 0 ? (
            conversations.map((conv) => (
              <div 
                key={conv._id}
                onClick={() => navigate(`/messages/${conv.participant._id}`)}
                className="p-6 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-all flex items-center gap-4 group"
              >
                <div className="relative">
                  <img 
                    src={conv.participant.profile_picture || '/default-avatar.png'} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                    alt=""
                  />
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {conv.participant.full_name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                      {moment(conv.lastMessage.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium truncate">
                    {conv.lastMessage.sender === user?._id ? 'You: ' : ''}{conv.lastMessage.content}
                  </p>
                </div>

                <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-40">
               <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="text-primary w-10 h-10" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">No conversations yet</h3>
               <p className="text-gray-500 font-medium mt-2">Start a new chat to begin your story.</p>
               <button className="button-primary mt-8 px-10">New Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { ArrowLeft, Send, Phone, Video, MoreHorizontal, Image, Smile } from 'lucide-react'
import moment from 'moment'

const ChatBox = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [messages, setMessages] = useState([])
  const [participant, setParticipant] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/api/message/${id}`)
        if (data.success) {
          setMessages(data.data)
          setParticipant(data.participant)
        }
      } catch (error) {
        console.error("Chat fetch failed", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [id])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const newMsg = { sender: user?._id, content: text, createdAt: new Date() }
    setMessages([...messages, newMsg])
    setText('')
    try {
      await api.post('/api/message/send', { receiverId: id, content: text })
    } catch (error) {
      console.error("Message send failed")
    }
  }

  if (loading) return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
       <div className="w-12 h-12 rounded-2xl bg-primary/10 animate-bounce flex items-center justify-center">
          <span className="text-primary font-black italic">A</span>
       </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-t-[2.5rem] border border-gray-100 p-4 md:p-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/messages')} className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-500 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <img src={participant?.profile_picture || '/default-avatar.png'} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover border-2 border-white shadow-sm" alt="" />
             <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-gray-900 leading-tight truncate">{participant?.full_name}</h3>
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">Online Now</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-3">
           <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all"><Phone size={20} /></button>
           <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all"><Video size={20} /></button>
           <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all"><MoreHorizontal size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-white/30 backdrop-blur-sm space-y-4">
        {messages.map((msg, i) => {
          const isOwn = msg.sender === user?._id
          return (
            <div key={i} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] px-5 py-3.5 rounded-3xl text-[15px] font-medium leading-relaxed ${isOwn ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100 shadow-sm'}`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight px-2">
                {moment(msg.createdAt).format('HH:mm')}
              </span>
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-[2.5rem] border border-gray-100 p-4 md:p-6 shadow-xl shadow-gray-200/40">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="flex items-center gap-1">
             <button type="button" className="p-3 rounded-xl hover:bg-gray-50 text-gray-400 transition-all"><Image size={22} /></button>
             <button type="button" className="p-3 rounded-xl hover:bg-gray-50 text-gray-400 transition-all hidden sm:flex"><Smile size={22} /></button>
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all font-medium text-[15px]"
            />
          </div>
          <button 
            type="submit" 
            disabled={!text.trim()}
            className={`p-4 rounded-2xl transition-all shadow-lg ${text.trim() ? 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark active:scale-95' : 'bg-gray-100 text-gray-400'}`}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox

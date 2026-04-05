import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { assets } from '../assets/assets'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import Loading from '../components/modals/Loading'
import { useSelector } from 'react-redux'

const ChatBox = () => {

  const { id } = useParams()
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
        console.error('Error fetching chat data:', error)
        toast.error(error.response?.data?.message || 'Failed to load chat')
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchChatData()
    }
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
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error.response?.data?.message || 'Failed to send message')
    }
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (loading || !user) return <Loading />


  return user && (
    <div className='flex flex-col h-screen bg-slate-50/30'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 md:px-12 xl:pl-44 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm z-30'>
        <div className='flex items-center gap-4'>
            <div className='relative group'>
              <img src={user.profile_picture || assets.sample_profile}
                onError={(e) => { e.target.src = assets.sample_profile }}
                alt="" className='size-10 rounded-2xl border-2 border-indigo-100 object-cover shadow-sm transition-transform group-hover:scale-105' />
              <div className='absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 border-2 border-white rounded-full'></div>
            </div>
            <div>
              <p className='font-black text-slate-900 tracking-tight'>{user.full_name}</p>
              <p className='text-[10px] font-bold text-indigo-500 uppercase tracking-widest'>Active Now</p>
            </div>
        </div>
        <div className='flex items-center gap-2'>
            <div className='p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-400'>
                <Eye size={20} />
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className='flex-1 p-4 md:px-12 overflow-y-scroll no-scrollbar opacity-80'
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
      >
        <div className='space-y-6 max-w-4xl mx-auto py-8'>
          {
            [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).
              map((message, index) => {
                const isCurrentUser = message.from_user_id === currentUser._id
                return (
                  <div key={message._id || index} className={`flex flex-col ${!isCurrentUser ? 'items-start' : 'items-end'}`}>
                    <div className={`p-4 text-sm max-w-[85%] md:max-w-md shadow-2xl shadow-indigo-100/20 backdrop-blur-md border ${
                      !isCurrentUser 
                        ? 'bg-white rounded-2xl rounded-bl-none border-white/60 text-slate-700' 
                        : 'bg-indigo-600 rounded-2xl rounded-br-none border-indigo-500 text-white'
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      {
                        message.message_type === 'image' && (
                          <div className='mb-3 rounded-xl overflow-hidden border border-black/10'>
                            <img src={message.media_url} alt="" className='w-full max-w-sm' />
                          </div>
                        )
                      }
                      <p className='font-medium leading-relaxed'>{message.text}</p>
                      <p className={`text-[9px] font-bold mt-2 uppercase tracking-widest opacity-60 ${!isCurrentUser ? 'text-slate-400' : 'text-indigo-100'}`}>
                        {moment(message.createdAt).format('hh:mm A')}
                      </p>
                    </div>
                  </div>
                )
              })
          }
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className='p-6 bg-transparent'>
          <div className='flex items-center gap-4 p-2 bg-white/80 backdrop-blur-2xl w-full max-w-3xl mx-auto border border-white shadow-2xl shadow-indigo-200/50 rounded-[2rem] px-6'>
            <label htmlFor="image" className='group'>
              <div className='p-2 hover:bg-indigo-50 rounded-2xl transition-all cursor-pointer'>
                {image 
                    ? <img src={URL.createObjectURL(image)} alt='' className='size-8 rounded-lg object-cover' />
                    : <ImageIcon className='size-6 text-slate-400 group-hover:text-indigo-500' />
                }
              </div>
              <input type="file" id='image' accept='image/*' hidden onChange={(e) => setImage(e.target.files[0])} />
            </label>

            <input 
              type='text' 
              className='flex-1 outline-none text-slate-700 font-medium placeholder-slate-400 bg-transparent'
              placeholder='Write a premium message...'
              onKeyDown={e => e.key === 'Enter' && sendMessage()} 
              onChange={(e) => setText(e.target.value)} 
              value={text} 
            />

            <button 
              onClick={sendMessage} 
              className='bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all cursor-pointer'
            >
              <SendHorizonal size={20} />
            </button>
          </div>
      </div>
    </div>
  )
}

export default ChatBox

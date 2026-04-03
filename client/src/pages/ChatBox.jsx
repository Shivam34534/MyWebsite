import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { assets } from '../assets/assets'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
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
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42
      bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <div className='relative'>
          <img src={user.profile_picture || assets.sample_profile}
            onError={(e) => { e.target.src = assets.sample_profile }}
            alt="" className='size-8 rounded-full' />
        </div>
        <div>
          <p className='font-medium text-slate-900'>{user.full_name}</p>
          <p className='text-xs text-gray-500'>@{user.username}</p>
        </div>
      </div>
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).
              map((message, index) => {
                const isCurrentUser = message.from_user_id === currentUser._id
                return (
                  <div key={message._id || index} className={`flex flex-col ${!isCurrentUser ? 'items-start' : 'items-end'}`}>
                    <div className={`p-2 text-sm max-w-sm bg-white text-slate-700
                    rounded-lg shadow ${!isCurrentUser ?
                        'rounded-bl-none' : 'rounded-br-none'}`}>
                      {
                        message.message_type === 'image' && <img src={message.media_url}
                          alt="" className='w-full max-w-sm rounded-lg mb-1' />
                      }
                      <p>{message.text}</p>
                    </div>
                  </div>
                )
              })
          }
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className='flex items-center gap-3 p-1.5 bg-white w-full
      max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
        <input type='text' className='flex-1 outline-none text-slate-700'
          placeholder='Type a message...'
          onKeyDown={e => e.key === 'Enter' && sendMessage()} onChange={(e) => setText
            (e.target.value)} value={text} />

        <label htmlFor="image">
          {
            image
              ? <img src={URL.createObjectURL(image)} alt='' className='h-8
              rounded' />
              : <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
          }
          <input type="file" id='image' accept='image/*' hidden onChange={
            (e) => setImage(e.target.files[0])} />
        </label>

        <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600
            hover:from-indigo-700 hover:to-purple-800 active:scale-95
            cursor-pointer text-white p-2 rounded-full'>
          <SendHorizonal size={18} />
        </button>

      </div>
    </div>
  )
}

export default ChatBox

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import api from '../api/axios'
import { useUser, useAuth } from '../mockClerk.jsx'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const RecentMessages = () => {

    const [messages, setMessages] = useState([])
    const auth = useAuth()
    const { getToken } = auth

    const fetchRecentMessages = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/user/recent-messages', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setMessages(data.messages)
            } else {
                toast.error(data.message || 'Failed to fetch recent messages')
            }
        } catch (error) {
            console.error('Error fetching recent messages:', error)
            toast.error(error.response?.data?.message || 'Failed to fetch recent messages')
        }
    }

    useEffect(() => {
        fetchRecentMessages()
    }, [])

    return (
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs
    text-slate-800'>
            <h3 className='font-semibold text-slate-8 mb-4'>Recent Messages</h3>
            <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
                {
                    messages.map((message, index) => (
                        <Link to={`messages/${typeof message.from_user_id === 'object' ? message.from_user_id._id : message.from_user_id}`} key={index} className='flex items-starts gap-2 py-2
                    hover:bg-slate-100'>
                            <img src={
                                (typeof message.from_user_id === 'object' && message.from_user_id?.profile_picture)
                                    ? message.from_user_id.profile_picture
                                    : assets.sample_profile
                            } alt=""
                                className='w-8 h-8 rounded-full' />
                            <div className='w-full'>
                                <div className='flex justify-between'>
                                    <p className='font-medium'>{typeof message.from_user_id === 'object' ? message.from_user_id.full_name : ''}</p>
                                    <p className='text-[10px] text-slate-400'>{moment
                                        (message.createdAt).fromNow()}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className='text-gray-500'>{message.text ? message.
                                        text : 'Media'}</p>
                                    {!message.seen && <p className='bg-indigo-500
                                    text-white w-4 h-4 flex items-center justify-center
                                    rounded-full text-[10px]'>1</p>}
                                </div>

                            </div>
                        </Link>
                    ))
                }
            </div>

        </div>
    )
}

export default RecentMessages

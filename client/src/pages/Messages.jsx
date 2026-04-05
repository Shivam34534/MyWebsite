import React, { useEffect, useState } from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useUser, useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import Loading from '../components/modals/Loading'

const Messages = () => {

  const navigate = useNavigate()
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = await getToken()
        const { data } = await api.get('/api/user/connections', {
          headers: { Authorization: `Bearer ${token} ` }
        })
        if (data.success) {
          // Get user details for each connection ID
          const connectionUsers = await Promise.all(
            data.connections.map(async (userId) => {
              try {
                const { data: userData } = await api.get(`/api/user/profile/${userId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                return userData.success ? userData.profile : null
              } catch (error) {
                console.error(`Error fetching user ${userId}: `, error)
                return null
              }
            })
          )
          setConnections(connectionUsers.filter(user => user !== null))
        } else {
          toast.error(data.message || 'Failed to fetch connections')
        }
      } catch (error) {
        console.error('Error fetching connections:', error)
        toast.error(error.response?.data?.message || 'Failed to fetch connections')
      } finally {
        setLoading(false)
      }
    }
    fetchConnections()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Messages</h1>
          <p className='text-slate-600'>Talk to your friends and family</p>
        </div>

        {/* Connected Users */}
        <div className='flex flex-col gap-3'>
          {connections.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>No connections yet. Start connecting with people!</p>
          ) : (
            connections.map((user) => (
              <div key={user._id} className='max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md '>
                <div className='relative mx-auto w-max'>
                  <img src={user.profile_picture || assets.sample_profile} alt=""
                    onError={(e) => { e.target.src = assets.sample_profile }}
                    className='rounded-full size-12' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-slate-700'>{user.full_name}</p>
                  <p className='text-slate-500'>@{user.username}</p>
                  <p className='text-sm text-gray-600'>{user.bio}</p>
                </div>
                <div className='flex flex-col gap-2 mt-4'>

                  <button onClick={() => navigate(`/messages/${user._id}`)}
                    className='size-10 flex items-center justify-center text-sm
                rounded bg-slate-100 hover:bg-slate-200 text-slate-800
                active:scale-95 transition cursor-pointer gap-1'>
                    <MessageSquare className='w-4 h-4' />
                  </button>

                  <button onClick={() => navigate(`/profile/${user._id}`)}
                    className='size-10 flex items-center justify-center text-sm
                rounded bg-slate-100 hover:bg-slate-200 text-slate-800
                active:scale-95 transition cursor-pointer gap-1'>
                    <Eye className='w-4 h-4' />
                  </button>

                </div>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  )
}

export default Messages

import React, { useState, useEffect } from 'react'
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import Loading from '../components/modals/Loading'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'

const Connections = () => {

  const [currentTab, setCurrentTab] = useState('Followers')
  const [connections, setConnections] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [pendingConnections, setPendingConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken()
      const { data } = await api.post('/api/user/unfollow', { id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        // Refresh connections
        const { data: connData } = await api.get('/api/user/connections', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (connData.success) {
          const fetchUserDetails = async (userIds) => {
            return Promise.all(
              userIds.map(async (userId) => {
                try {
                  const { data: userData } = await api.get(`/api/user/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  return userData.success ? userData.profile : null
                } catch (error) {
                  return null
                }
              })
            )
          }
          const [connUsers, followersUsers, followingUsers, pendingUsers] = await Promise.all([
            fetchUserDetails(connData.connections || []),
            fetchUserDetails(connData.followers || []),
            fetchUserDetails(connData.following || []),
            fetchUserDetails(connData.pendingConnections || [])
          ])
          setConnections(connUsers.filter(u => u !== null))
          setFollowers(followersUsers.filter(u => u !== null))
          setFollowing(followingUsers.filter(u => u !== null))
          setPendingConnections(pendingUsers.filter(u => u !== null))
        }
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
      toast.error(error.response?.data?.message || 'Failed to unfollow user')
    }
  }

  const handleAcceptConnection = async (userId) => {
    try {
      const token = await getToken()
      const { data } = await api.post('/api/user/accept', { id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        dispatch(fetchUser(token))
        // Refresh connections
        const { data: connData } = await api.get('/api/user/connections', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (connData.success) {
          const fetchUserDetails = async (userIds) => {
            return Promise.all(
              userIds.map(async (userId) => {
                try {
                  const { data: userData } = await api.get(`/api/user/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  return userData.success ? userData.profile : null
                } catch (error) {
                  return null
                }
              })
            )
          }
          const [connUsers, followersUsers, followingUsers, pendingUsers] = await Promise.all([
            fetchUserDetails(connData.connections || []),
            fetchUserDetails(connData.followers || []),
            fetchUserDetails(connData.following || []),
            fetchUserDetails(connData.pendingConnections || [])
          ])
          setConnections(connUsers.filter(u => u !== null))
          setFollowers(followersUsers.filter(u => u !== null))
          setFollowing(followingUsers.filter(u => u !== null))
          setPendingConnections(pendingUsers.filter(u => u !== null))
        }
      }
    } catch (error) {
      console.error('Error accepting connection:', error)
      toast.error(error.response?.data?.message || 'Failed to accept connection')
    }
  }

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = await getToken()
        const { data } = await api.get('/api/user/connections', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) {
          // Fetch user details for each array
          const fetchUserDetails = async (userIds) => {
            return Promise.all(
              userIds.map(async (userId) => {
                try {
                  const { data: userData } = await api.get(`/api/user/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  return userData.success ? userData.profile : null
                } catch (error) {
                  console.error(`Error fetching user ${userId}:`, error)
                  return null
                }
              })
            )
          }

          const [connUsers, followersUsers, followingUsers, pendingUsers] = await Promise.all([
            fetchUserDetails(data.connections || []),
            fetchUserDetails(data.followers || []),
            fetchUserDetails(data.following || []),
            fetchUserDetails(data.pendingConnections || [])
          ])

          setConnections(connUsers.filter(u => u !== null))
          setFollowers(followersUsers.filter(u => u !== null))
          setFollowing(followingUsers.filter(u => u !== null))
          setPendingConnections(pendingUsers.filter(u => u !== null))
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

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus },
  ]

  if (loading) return <Loading />

  return (
    <div className='min-h-screen bg-surface w-full p-4 sm:p-8 lg:p-12'>
      <div className='max-w-6xl mx-auto flex flex-col gap-12'>

        {/* Branding & Header */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-black font-headline tracking-tighter text-on-surface uppercase'>Network</h1>
          <p className='text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant/40 pl-0.5'>Manage your gallery connections</p>
        </div>

        {/* Tab Selection Strategy */}
        <div className='inline-flex flex-wrap items-center gap-2 bg-surface-container-low p-2 rounded-[2rem] border border-stone-200/5 shadow-sm transition-all'>
          {dataArray.map((tab) => (
            <button 
              onClick={() => setCurrentTab(tab.label)} 
              key={tab.label}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-sm font-headline font-bold transition-all duration-300 ${
                currentTab === tab.label 
                ? 'bg-white text-primary shadow-lg shadow-primary/5 scale-[1.05]' 
                : 'text-stone-400 hover:text-on-surface hover:bg-stone-50'
              }`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='tracking-tight'>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentTab === tab.label ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-400'}`}>
                {tab.value.length}
              </span>
            </button>
          ))}
        </div>

        {/* Connection Grid Stage */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700'>
          {dataArray.find((item) => item.label === currentTab)?.value.length === 0 ? (
            <div className='col-span-full py-32 text-center flex flex-col items-center gap-6 opacity-30'>
              <span className="material-symbols-outlined text-8xl">group_off</span>
              <div className='flex flex-col gap-2'>
                  <h3 className='font-headline font-black text-2xl text-on-surface'>No archives found</h3>
                  <p className='text-sm font-medium'>Start connecting with other curators in the gallery.</p>
              </div>
            </div>
          ) : (
            dataArray.find((item) => item.label === currentTab)?.value.map((user) => (
              <div key={user._id} className='bg-surface-container-lowest p-8 rounded-[3rem] border border-stone-200/5 shadow-xl transition-all hover:editorial-shadow hover:translate-y-[-4px] flex flex-col gap-8 group'>
                <div className='flex items-center gap-6'>
                    <div className='relative p-0.5 rounded-full border-[1.5px] border-stone-200 shadow-sm transition-transform group-hover:scale-105'>
                        <img 
                            src={user.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="" 
                            className="w-16 h-16 rounded-full object-cover" 
                        />
                        <div className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-white rounded-full' />
                    </div>
                    <div className='flex flex-col overflow-hidden'>
                      <h4 className='font-headline font-black text-on-surface text-lg leading-tight truncate group-hover:text-primary transition-colors'>{user.full_name}</h4>
                      <p className='text-stone-400 font-bold uppercase text-[10px] tracking-widest mt-1'>@{user.username}</p>
                    </div>
                </div>

                {user.bio && (
                    <p className='text-on-surface-variant font-medium text-sm leading-relaxed line-clamp-2 opacity-80 italic'>"{user.bio}"</p>
                )}

                <div className='grid grid-cols-2 gap-3 pt-4 border-t border-stone-200/10'>
                    <button 
                        onClick={() => navigate(`/profile/${user._id}`)} 
                        className='px-4 py-3 bg-stone-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-stone-200'
                    >
                        Visit Studio
                    </button>
                    {currentTab === 'Following' && (
                        <button onClick={() => handleUnfollow(user._id)} className='px-4 py-3 bg-stone-50 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 border border-stone-100'>
                            Unfollow
                        </button>
                    )}
                    {currentTab === 'Pending' && (
                        <button onClick={() => handleAcceptConnection(user._id)} className='px-4 py-3 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20'>
                            Accept
                        </button>
                    )}
                    {currentTab === 'Connections' && (
                        <button onClick={() => navigate(`/messages/${user._id}`)} className='px-4 py-3 bg-primary/5 text-primary hover:bg-primary/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 border border-primary/10 flex items-center justify-center gap-2'>
                            <MessageSquare className='w-3 h-3' />
                            Message
                        </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Connections

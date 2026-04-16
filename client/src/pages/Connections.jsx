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
    <div className='min-h-screen bg-[#F2F2F2] w-full p-4 sm:p-8 lg:p-12'>
      <div className='max-w-6xl mx-auto flex flex-col gap-12'>

        {/* Branding & Header */}
        <div className='flex flex-col gap-2 -rotate-1'>
          <h1 className='text-6xl font-black italic tracking-tighter text-black uppercase leading-none'>NETWORK.LOG</h1>
          <div className='bg-primary text-black px-3 py-1 neo-border text-[10px] font-black uppercase tracking-widest w-fit shadow-[4px_4px_0px_0px_#000]'>COMMUNICATION_CHANNELS_ACTIVE</div>
        </div>

        {/* Tab Selection Strategy */}
        <div className='flex flex-wrap items-center gap-4'>
          {dataArray.map((tab) => (
            <button 
              onClick={() => setCurrentTab(tab.label)} 
              key={tab.label}
              className={`flex items-center gap-4 px-6 py-4 neo-border font-black text-sm uppercase transition-all ${
                currentTab === tab.label 
                ? 'bg-primary text-black shadow-[6px_6px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]' 
                : 'bg-white text-black/40 hover:text-black hover:bg-stone-50'
              }`}
            >
              <tab.icon className='w-5 h-5 stroke-[3px]' />
              <span className='tracking-tight'>{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 neo-border shadow-[2px_2px_0_0_#000] ${currentTab === tab.label ? 'bg-black text-white' : 'bg-stone-100 text-black/20'}`}>
                {tab.value.length}
              </span>
            </button>
          ))}
        </div>

        {/* Connection Grid Stage */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8 duration-700'>
          {dataArray.find((item) => item.label === currentTab)?.value.length === 0 ? (
            <div className='col-span-full py-40 text-center flex flex-col items-center gap-8 bg-white neo-border neo-shadow-lg italic'>
              <div className="w-24 h-24 neo-border bg-stone-100 flex items-center justify-center -rotate-12">
                <span className="material-symbols-outlined text-6xl font-black">group_off</span>
              </div>
              <div className='flex flex-col gap-2'>
                  <h3 className='text-4xl font-black uppercase tracking-tight'>ARCHIVE_EMPTY</h3>
                  <p className='text-[10px] font-black uppercase tracking-widest opacity-40'>Initialize connection protocols to populate this sector.</p>
              </div>
            </div>
          ) : (
            dataArray.find((item) => item.label === currentTab)?.value.map((user) => (
              <div key={user._id} className='bg-white p-8 neo-border neo-shadow-lg transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000] flex flex-col gap-8 group'>
                <div className='flex items-center gap-6'>
                    <div className='relative neo-border bg-black p-0.5 group-hover:rotate-3 transition-transform'>
                        <img 
                            src={user.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="" 
                            className="w-20 h-20 object-cover grayscale-[0.2] group-hover:grayscale-0" 
                        />
                        <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-lime-400 neo-border shadow-[2px_2px_0_0_#000]' />
                    </div>
                    <div className='flex flex-col overflow-hidden'>
                      <h4 className='font-black text-black text-xl leading-none truncate group-hover:italic transition-all uppercase'>{user.full_name}</h4>
                      <p className='text-black/40 font-black uppercase text-[10px] tracking-widest mt-2'>@{user.username}</p>
                    </div>
                </div>

                {user.bio && (
                    <div className="bg-[#EEE] p-4 neo-border shadow-inner -rotate-1">
                        <p className='text-black font-black text-[11px] uppercase tracking-tight leading-tight line-clamp-2'>"{user.bio}"</p>
                    </div>
                )}

                <div className='grid grid-cols-1 gap-4 pt-6 border-t-[3px] border-black mt-auto'>
                    <button 
                        onClick={() => navigate(`/profile/${user._id}`)} 
                        className='neo-button bg-black text-white hover:bg-stone-800'
                    >
                        ACCESS_STUDIO
                    </button>
                    {currentTab === 'Following' && (
                        <button onClick={() => handleUnfollow(user._id)} className='neo-button bg-red-400'>
                            UNSYNC_FOLLOW
                        </button>
                    )}
                    {currentTab === 'Pending' && (
                        <button onClick={() => handleAcceptConnection(user._id)} className='neo-button bg-primary'>
                            ACCEPT_PROTOCOL
                        </button>
                    )}
                    {currentTab === 'Connections' && (
                        <button onClick={() => navigate(`/messages/${user._id}`)} className='neo-button bg-accent flex items-center justify-center gap-2'>
                            <MessageSquare className='w-4 h-4 text-black' />
                            DIRECT_LINK
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

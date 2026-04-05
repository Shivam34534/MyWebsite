import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Calendar, MapPin, PenBox, Verified, UserPlus, UserCheck } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { assets } from '../../assets/assets'
import api from '../../api/axios'
import { useAuth } from '../../mockClerk'
import toast from 'react-hot-toast'
import { fetchUser } from '../../features/user/userSlice'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit, onUpdate }) => {
  const currentUser = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const { getToken } = useAuth()

  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && currentUser) {
      setIsFollowing(currentUser.following?.includes(user._id))
    }
  }, [user, currentUser])

  const handleFollow = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const endpoint = isFollowing ? '/api/user/unfollow' : '/api/user/follow'
      const { data } = await api.post(endpoint, { id: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setIsFollowing(!isFollowing)
        dispatch(fetchUser(token))
        if (onUpdate) onUpdate()
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Failed to update follow status')
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
      toast.error(error.response?.data?.message || 'Failed to update follow status')
    } finally {
      setLoading(false)
    }
  }

  const isFollowsYou = user && currentUser && user.following?.includes(currentUser._id)

  return (
    <div className='relative py-6 px-6 md:px-12 bg-white/40 backdrop-blur-sm'>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>

        {/* Profile Avatar with Premium Frame */}
        <div className='relative z-20 -mt-24 md:-mt-32'>
          <div className='w-40 h-40 md:w-48 md:h-48 rounded-[3rem] border-[6px] border-white shadow-2xl overflow-hidden glass-card p-0'>
            <img src={user.profile_picture || assets.sample_profile}
              onError={(e) => { e.target.src = assets.sample_profile }}
              alt="" className='w-full h-full object-cover' />
          </div>
          {isFollowing && (
            <div className='absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-xl border-4 border-white'>
              <UserCheck className='w-5 h-5' />
            </div>
          )}
        </div>

        <div className='flex-1 w-full pt-2 md:pt-4'>
          <div className='flex flex-col md:flex-row items-center md:items-start justify-between gap-4'>
            <div className='text-center md:text-left'>
              <div className='flex items-center justify-center md:justify-start gap-2'>
                <h1 className='text-3xl md:text-4xl font-black text-slate-900 tracking-tight'>{user.full_name}</h1>
                <Verified className='w-6 h-6 text-indigo-500 fill-indigo-50' />
              </div>
              <div className='flex items-center justify-center md:justify-start gap-3 mt-1'>
                <p className='text-indigo-600 font-bold text-sm'>{user.username ? `@${user.username}` : '@username'}</p>
                {isFollowsYou && (
                  <span className='bg-indigo-50 text-indigo-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-indigo-100'>
                    Follows you
                  </span>
                )}
              </div>
            </div>

            <div className='flex gap-3'>
                {!profileId ? (
                  <button onClick={() => setShowEdit(true)} className='premium-button px-8 py-3 bg-slate-900 text-white !rounded-2xl'>
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={handleFollow} 
                    disabled={loading} 
                    className={`px-8 py-3 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 shadow-lg ${
                      isFollowing 
                      ? 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-slate-200/50' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow User'}
                  </button>
                )}
            </div>
          </div>

          <p className='text-slate-600 text-sm md:text-base font-medium mt-4 max-w-xl leading-relaxed text-center md:text-left'>
            {user.bio || "No bio added yet. Explore the world of Aura."}
          </p>

          <div className='flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6'>
            <div className='flex items-center gap-2 text-slate-400 group'>
              <MapPin className='w-4 h-4 group-hover:text-indigo-500 transition-colors' />
              <span className='text-xs font-bold uppercase tracking-wider'>{user.location || 'Unknown Earth'}</span>
            </div>
            <div className='flex items-center gap-2 text-slate-400 group'>
              <Calendar className='w-4 h-4 group-hover:text-indigo-500 transition-colors' />
              <span className='text-xs font-bold uppercase tracking-wider'>Aura Joined {moment(user.createdAt).format('MMM YYYY')}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className='flex items-center justify-around md:justify-start md:gap-12 mt-8 pt-6 border-t border-slate-100'>
            <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2'>
              <span className='text-xl font-black text-slate-900'>{posts?.length || 0}</span>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Posts</span>
            </div>
            <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2'>
              <span className='text-xl font-black text-slate-900'>{user.followers?.length || 0}</span>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Followers</span>
            </div>
            <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2'>
              <span className='text-xl font-black text-slate-900'>{user.following?.length || 0}</span>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Following</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserProfileInfo
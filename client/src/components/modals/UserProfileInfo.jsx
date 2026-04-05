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
    <div className='relative py-8 px-6 md:px-12 bg-white dark:bg-stone-950 rounded-b-[2.5rem] shadow-sm'>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-10'>

        {/* Profile Avatar with Gallery Styling */}
        <div className='relative z-20 -mt-24 md:-mt-36'>
          <div className='w-44 h-44 md:w-52 md:h-52 rounded-full story-ring p-[4px] shadow-2xl transition-transform hover:scale-105 duration-500'>
            <div className='w-full h-full rounded-full border-4 border-white overflow-hidden bg-white'>
              <img src={user.profile_picture || assets.sample_profile}
                onError={(e) => { e.target.src = assets.sample_profile }}
                alt="" className='w-full h-full object-cover' />
            </div>
          </div>
          {isFollowing && (
            <div className='absolute bottom-2 right-2 bg-primary text-on-primary p-2 rounded-full shadow-lg border-4 border-white flex items-center justify-center'>
              <span className="material-symbols-outlined text-[18px] font-bold">check</span>
            </div>
          )}
        </div>

        <div className='flex-1 w-full pt-4'>
          <div className='flex flex-col md:flex-row items-center md:items-start justify-between gap-6'>
            <div className='text-center md:text-left'>
              <div className='flex items-center justify-center md:justify-start gap-3'>
                <h1 className='text-3xl md:text-4xl font-headline font-black text-stone-900 dark:text-stone-50 tracking-tight'>{user.full_name}</h1>
                <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              </div>
              <div className='flex items-center justify-center md:justify-start gap-3 mt-1'>
                <p className='text-primary font-bold text-base'>{user.username ? `@${user.username}` : '@username'}</p>
                {isFollowsYou && (
                  <span className='bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-primary/20'>
                    Mutual Follow
                  </span>
                )}
              </div>
            </div>

            <div className='flex gap-3'>
                {!profileId ? (
                  <button onClick={() => setShowEdit(true)} className='flex items-center gap-2 px-8 py-3 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-950 font-bold rounded-full transition-transform active:scale-95 shadow-lg'>
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={handleFollow} 
                    disabled={loading} 
                    className={`px-10 py-3 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-xl ${
                      isFollowing 
                      ? 'bg-stone-100 text-stone-900 border border-stone-200 hover:bg-stone-200' 
                      : 'bg-primary text-on-primary hover:opacity-90'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
                <button className="p-3 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
            </div>
          </div>

          <p className='text-stone-600 dark:text-stone-400 text-sm md:text-base font-medium mt-6 max-w-xl leading-relaxed text-center md:text-left'>
            {user.bio || "Crafting digital experiences and exploring the intersections of art and technology."}
          </p>

          <div className='flex flex-wrap items-center justify-center md:justify-start gap-8 mt-8 pb-8 border-b border-stone-100/50'>
            <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2 group cursor-pointer'>
              <span className='text-xl font-headline font-black text-stone-900 dark:text-stone-50'>{posts?.length || 0}</span>
              <span className='text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]'>Posts</span>
            </div>
            <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2 group cursor-pointer'>
              <span className='text-xl font-headline font-black text-stone-900 dark:text-stone-50'>{user.followers?.length || 0}</span>
              <span className='text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]'>Followers</span>
            </div>
            <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2 group cursor-pointer'>
              <span className='text-xl font-headline font-black text-stone-900 dark:text-stone-50'>{user.following?.length || 0}</span>
              <span className='text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]'>Following</span>
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6'>
            <div className='flex items-center gap-2 text-stone-400'>
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span className='text-[11px] font-bold uppercase tracking-wider'>{user.location || 'Editorial Studio'}</span>
            </div>
            <div className='flex items-center gap-2 text-stone-400'>
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span className='text-[11px] font-bold uppercase tracking-wider'>Aura Artist Since {moment(user.createdAt).format('MMM YYYY')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserProfileInfo
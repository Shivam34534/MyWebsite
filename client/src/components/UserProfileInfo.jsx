import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Calendar, MapPin, PenBox, Verified, UserPlus, UserCheck } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { assets } from '../assets/assets'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { fetchUser } from '../features/user/userSlice'

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
        dispatch(fetchUser())
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
    <div className='relative py-4 px-6 md:px-8 bg-white'>
      <div className='flex flex-col md:flex-row items-start gap-6'>

        <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16
          rounded-full overflow-hidden'>
          <img src={user.profile_picture || assets.sample_profile}
            onError={(e) => { e.target.src = assets.sample_profile }}
            alt="" className='w-full h-full object-cover' />
        </div>

        <div className='w-full pt-16 md:pt-0 md:pl-36'>
          <div className='flex flex-col md:flex-row items-start justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                <Verified className='w-6 h-6 text-indigo-500' />
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-gray-600'>{user.username ? `@${user.username}` : 'Add a username'}</p>
                {isFollowsYou && (
                  <span className='bg-gray-100 text-gray-600 params text-xs px-2 py-0.5 rounded font-medium'>
                    Follows you
                  </span>
                )}
              </div>
            </div>
            {/* if user is not on others profile that means he is opening his
            profile so we will give edit option */}
            {!profileId ? (
              <button onClick={() => setShowEdit(true)} className='flex 
                items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4
                py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0
                cursor-pointer'>
                <PenBox className='w-4 h-4' />
                Edit
              </button>
            ) : (
              <button onClick={handleFollow} disabled={loading} className={`flex 
                items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0
                cursor-pointer text-white shadow-sm
                ${isFollowing ? 'bg-gray-800 hover:bg-gray-900' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {isFollowing ? (
                  <>
                    <UserCheck className='w-4 h-4' />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className='w-4 h-4' />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>
          <p className='text-gray-700 text-sm max-w-md mt-4'>{user.bio}</p>

          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm
          text-gray-500 mt-4'>
            <span className='flex items-center gap-1.5'>
              <MapPin className='w-4 h-4' />
              {user.location ? user.location : 'Add location'}
            </span>
            <span className='flex items-center gap-1.5'>
              <Calendar className='w-4 h-4' />
              Joined <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
            </span>
          </div>
          <div className='flex items-center gap-6 mt-6 border-t border-gray-200
          pt-4'>
            <div>
              <span className='sm:text-xl font-bold text-gray-900'>{posts?.length || 0}</span>
              <span className='text-xs sm:text-sm text-gray-500 ml-1.5'
              >Posts</span>
            </div>
            <div>
              <span className='sm:text-xl font-bold text-gray-900'>
                {user.followers?.length || 0}</span>
              <span className='text-xs sm:text-sm text-gray-500 ml-1.5'
              >Followers</span>
            </div>
            <div>
              <span className='sm:text-xl font-bold text-gray-900'>
                {user.following?.length || 0}</span>
              <span className='text-xs sm:text-sm text-gray-500 ml-1.5'
              >Following</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default UserProfileInfo
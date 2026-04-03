import React, { useState } from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { fetchUser } from '../features/user/userSlice'
import { assets } from '../assets/assets'

const UserCard = ({ user }) => {
    const currentUser = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { getToken } = useAuth()

    const isFollowingInitial = user && (currentUser?.following?.includes(user._id) || user.followers?.includes(currentUser?._id));
    const isConnectedInitial = user && (currentUser?.connections?.includes(user._id) || user.connectionStatus === 'accepted');
    const isPendingInitial = user && (user.connectionStatus === 'pending' && user.connectionFrom === currentUser?._id);
    const isPendingFromThemInitial = user && (user.connectionStatus === 'pending' && user.connectionFrom === user._id);

    const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
    const [isConnected, setIsConnected] = useState(isConnectedInitial)
    const [isPending, setIsPending] = useState(isPendingInitial)
    const [isPendingFromThem, setIsPendingFromThem] = useState(isPendingFromThemInitial)

    if (!user) return null;

    const handleFollow = async () => {
        try {
            const token = await getToken()
            const endpoint = isFollowing ? '/api/user/unfollow' : '/api/user/follow'
            const { data } = await api.post(endpoint, { id: user._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setIsFollowing(!isFollowing)
                dispatch(fetchUser())
                toast.success(data.message)
            } else {
                toast.error(data.message || 'Failed to update follow status')
            }
        } catch (error) {
            console.error('Error updating follow status:', error)
            toast.error(error.response?.data?.message || 'Failed to update follow status')
        }
    }

    const handleConnectionRequest = async () => {
        if (isConnected) {
            navigate(`/messages/${user._id}`)
            return
        }

        try {
            const token = await getToken()
            const endpoint = isPendingFromThem ? '/api/user/accept' : '/api/user/connect'
            const { data } = await api.post(endpoint, { id: user._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                if (isPendingFromThem) {
                    setIsConnected(true)
                    setIsPendingFromThem(false)
                } else {
                    setIsPending(true)
                }
                dispatch(fetchUser())
            } else {
                toast.error(data.message || 'Failed to update connection status')
            }
        } catch (error) {
            console.error('Error updating connection status:', error)
            toast.error(error.response?.data?.message || 'Failed to update connection status')
        }
    }
    return (
        <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72
        shadow border border-gray-200 rounded-md'>
            <div className='text-center'>
                <img src={user.profile_picture || assets.sample_profile}
                    onError={(e) => { e.target.src = assets.sample_profile }}
                    alt="" className='rounded-full w-16
                shadow-md mx-auto'/>
                <p className='mt-4 font-semibold'>{user.full_name}</p>
                {user.username && <p className='text-gray-500 font-light'>@{user.
                    username}</p>}
                {user.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'>
                    {user.bio}</p>}
            </div>

            <div className='flex items-center justify-center gap-2 mt-4 
            text-xs text-gray-600'>
                <div className='flex items-center gap-1 border border-gray-300 
                rounded-full px-3 py-1'>
                    <MapPin className='w-4 h-4' /> {user.location}
                </div>

                <div className='flex items-center gap-1 border border-gray-300 
                rounded-full px-3 py-1'>
                    <span>{user.followers?.length || 0}</span> Followers
                </div>
            </div>

            <div className='flex mt-4 gap-2'>
                {/* Follow Button */}
                <button onClick={handleFollow} disabled={isFollowing} className='w-full py-2 rounded-md flex justify-center
                items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition
                text-white cursor-pointer disabled:opacity-50'>
                    <UserPlus className='w-4 h-4' /> {isFollowing ? 'Following' : 'Follow'}
                </button>
                {/* Connection Request Button / Message Button */}
                <button onClick={handleConnectionRequest} className='flex items-center
                justify-center w-16 border text-slate-500 group rounded-md
                cursor-pointer active:scale-105 transition disabled:opacity-60'
                    disabled={isPending}>
                    {
                        isConnected ?
                            <MessageCircle className='w-5 h-5 group-hover:scale-105 transition text-indigo-600' />
                            :
                            isPending ?
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter'>Sent</span> :
                                isPendingFromThem ?
                                    <span className='text-[10px] font-bold text-indigo-600 uppercase tracking-tighter'>Accept</span> :
                                    <Plus className='w-5 h-5 group-hover:scale-110 transition' />
                    }
                </button>

            </div>

        </div>
    )
}

export default UserCard
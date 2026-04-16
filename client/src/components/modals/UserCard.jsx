import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../mockClerk'
import toast from 'react-hot-toast'
import { fetchUser } from '../../features/user/userSlice'
import { assets } from '../../assets/assets'

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
                dispatch(fetchUser(token))
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
                dispatch(fetchUser(token))
            } else {
                toast.error(data.message || 'Failed to update connection status')
            }
        } catch (error) {
            console.error('Error updating connection status:', error)
            toast.error(error.response?.data?.message || 'Failed to update connection status')
        }
    }

    return (
        <div key={user._id} className="relative bg-white p-6 neo-border neo-shadow group/card flex flex-col gap-6 items-center text-center transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#A3E635]">
            {/* Identity Orbit */}
            <div 
                onClick={() => navigate(`/profile/${user._id}`)}
                className="relative group cursor-pointer -rotate-1 group-hover/card:rotate-0 transition-transform"
            >
                <div className="w-24 h-24 neo-border bg-black p-0.5">
                    <div className="w-full h-full bg-stone-100 overflow-hidden">
                        <img 
                            src={user.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt={user.full_name} 
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
                        />
                    </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-lime-400 neo-border flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-xs font-black">check</span>
                </div>
            </div>

            {/* Credentials */}
            <div className="flex flex-col gap-1 w-full">
                <h3 
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="font-black text-black text-xl cursor-pointer hover:italic transition-all leading-tight uppercase truncate"
                >
                    {user.full_name}
                </h3>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest italic">@{user.username || 'unknown_entity'}</p>
            </div>

            {/* Narrative Fragment */}
            <div className="bg-[#EEE] p-3 neo-border w-full shadow-inner rotate-1">
                <p className="text-[10px] font-black uppercase tracking-tight text-black line-clamp-2 leading-tight">
                    {user.bio || "INITIALIZING_USER_PROTOCOL..."}
                </p>
            </div>

            {/* Metric Bar */}
            <div className="flex items-center gap-0 neo-border w-full overflow-hidden bg-black text-white shadow-[4px_4px_0px_0px_#000]">
                <div className="flex-1 flex flex-col items-center py-2 bg-white text-black border-r-[3px] border-black">
                    <span className="text-sm font-black italic">{(user.followers?.length || 0)}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter">NET_RANK</span>
                </div>
                <div className="flex-1 flex flex-col items-center py-2 bg-black text-white hover:bg-primary hover:text-black transition-colors">
                    <span className="text-sm font-black truncate max-w-[60px] uppercase">{(user.location || "EARTH").split(',')[0]}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter">ZONE</span>
                </div>
            </div>

            {/* Action Suite */}
            <div className="w-full flex items-center gap-2 mt-auto">
                <button 
                    onClick={handleFollow}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 neo-border font-black text-[10px] uppercase transition-all active:translate-y-1 active:shadow-none ${
                        isFollowing 
                        ? 'bg-stone-100 text-black shadow-none' 
                        : 'bg-primary text-black shadow-[4px_4px_0px_0px_#000]'
                    }`}
                >
                    <span className="material-symbols-outlined text-[16px] font-black">{isFollowing ? 'check' : 'person_add'}</span>
                    {isFollowing ? 'FOLLOWER' : 'SYNC_FOLLOW'}
                </button>
                <button 
                    onClick={handleConnectionRequest}
                    disabled={isPending}
                    className={`w-12 h-12 neo-border transition-all active:translate-y-1 active:shadow-none flex items-center justify-center ${
                        isConnected 
                        ? 'bg-accent text-black shadow-none' 
                        : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:bg-lime-400'
                    } disabled:opacity-50`}
                >
                    <span className="material-symbols-outlined text-[20px] font-black">
                        {isConnected ? 'chat' : isPending ? 'pending' : isPendingFromThem ? 'how_to_reg' : 'add'}
                    </span>
                </button>
            </div>
        </div>

    )
}

export default UserCard
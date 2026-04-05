import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import UserCard from './UserCard'
import { useSelector } from 'react-redux'
import { assets } from '../../assets/assets'
import api from '../../api/axios'
import { useAuth } from '../../mockClerk'
import Loading from './Loading'

const PostLikesList = ({ likes, setShowLikes }) => {
    const currentUser = useSelector((state) => state.user.value)
    const [likeUsers, setLikeUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const { getToken } = useAuth()

    useEffect(() => {
        const fetchLikeUsers = async () => {
            try {
                const token = await getToken()
                const headers = token ? { Authorization: `Bearer ${token}` } : {}

                const userPromises = likes.map(async (userId) => {
                    // Optimized: Check if it's the current user first to avoid API call
                    if (userId === currentUser?._id) {
                        return currentUser
                    }
                    try {
                        const { data } = await api.get(`/api/user/profile/${userId}`, { headers })
                        return data.success ? data.profile : null
                    } catch (error) {
                        return null
                    }
                })

                const users = await Promise.all(userPromises)
                setLikeUsers(users.filter(u => u !== null))
            } catch (error) {
                console.error("Error fetching like users", error)
            } finally {
                setLoading(false)
            }
        }

        if (likes.length > 0) {
            fetchLikeUsers()
        } else {
            setLoading(false)
        }
    }, [likes, currentUser, getToken])


    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-sm max-h-[80vh] flex flex-col'>
                <div className='flex items-center justify-between p-4 border-b border-gray-100'>
                    <h3 className='font-semibold text-lg'>Likes</h3>
                    <button onClick={() => setShowLikes(false)} className='p-1 hover:bg-gray-100 rounded-full transition'>
                        <X className='w-5 h-5 text-gray-500' />
                    </button>
                </div>

                <div className='overflow-y-auto p-4 flex flex-col gap-3 min-h-40'>
                    {loading ? (
                        <Loading height='h-40' />
                    ) : likeUsers.length > 0 ? (
                        likeUsers.map((user, index) => (
                            <UserCard key={user._id || index} user={user} />
                        ))
                    ) : (
                        <p className='text-gray-500 text-center py-4'>No likes yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostLikesList

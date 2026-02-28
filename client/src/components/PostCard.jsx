import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import React, { use, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useUser, useAuth } from '../mockClerk'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import PostLikesList from './PostLikesList'
import PostCommentsList from './PostCommentsList'


const PostCard = ({ post }) => {

    const postWithHashtags = post.content?.replace(/(#\w+)/g,
        '<span class="text-indigo-600">$1</span>') || ''

    const [likes, setLikes] = useState(post.likes_count || [])
    const [commentCount, setCommentCount] = useState(post.comments_count || 0)
    const [shareCount, setShareCount] = useState(post.shares_count || 0)
    const [showLikes, setShowLikes] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()

    const handleLike = async () => {
        try {
            const token = await getToken()
            const { data } = await api.post('/api/post/like', { postId: post._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                // Update likes locally
                if (likes.includes(currentUser._id)) {
                    setLikes(likes.filter(id => id !== currentUser._id))
                } else {
                    setLikes([...likes, currentUser._id])
                }
            }
        } catch (error) {
            console.error('Error liking post:', error)
            toast.error(error.response?.data?.message || 'Failed to like post')
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: 'Check out this post on PingUp!',
            text: post.content,
            url: window.location.origin // In a real app, this would be a deep link like `/post/${post._id}`
        }

        // Call backend to increment share count
        try {
            const token = await getToken()
            await api.post('/api/post/share', { postId: post._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShareCount(prev => prev + 1)
        } catch (error) {
            console.error('Error incrementing share count:', error)
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
                toast.success('Shared successfully')
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(shareData.url + ' ' + shareData.text)
            toast.success('Link copied to clipboard')
        }
    }

    const navigate = useNavigate()

    return (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-2xl overflow-hidden'>
            {/* User Info */}
            <div className='px-4 pt-4 pb-2 flex items-center justify-between'>
                <div onClick={() => navigate('/profile/' + post.user._id)} className='flex items-center gap-3 cursor-pointer group'>
                    <img src={post.user.profile_picture || assets.sample_profile} alt="Profile" className='w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all' />
                    <div className='leading-tight'>
                        <div className='flex items-center space-x-1'>
                            <span className='font-bold text-gray-900 group-hover:text-indigo-600 transition-colors'>{post.user.full_name}</span>
                            <BadgeCheck className='w-4 h-4 text-indigo-500 fill-indigo-50' />
                        </div>
                        <span className='text-gray-500 text-xs'>@{post.user.username} • {moment(post.createdAt).fromNow()}</span>
                    </div>
                </div>
                {/* Optional: Add a More Options menu here if needed later */}
            </div>

            {/* Content */}
            {post.content && (
                <div className='px-4 pb-3 relative'>
                    <div
                        className='text-gray-800 text-[15px] leading-relaxed whitespace-pre-line'
                        dangerouslySetInnerHTML={{ __html: postWithHashtags }}
                    />
                </div>
            )}

            {/* Media (Images/Videos) */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className={`grid gap-1 w-full bg-white mt-2 ${post.image_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.image_urls.map((url, index) => {
                        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
                        const isSingle = post.image_urls.length === 1;

                        return isVideo ? (
                            <div key={index} className={`bg-black w-full flex items-center justify-center overflow-hidden ${isSingle ? 'rounded-lg' : ''}`}>
                                <video
                                    src={url}
                                    controls
                                    className={`w-full ${isSingle ? 'h-auto max-h-[700px] object-contain' : 'h-64 md:h-80 object-cover'}`}
                                />
                            </div>
                        ) : (
                            <div key={index} className={`w-full flex items-center justify-center bg-gray-50 overflow-hidden ${isSingle ? 'rounded-lg' : ''}`}>
                                <img
                                    src={url}
                                    className={`w-full ${isSingle ? 'h-auto max-h-[700px] object-contain' : 'h-64 md:h-80 object-cover'} hover:opacity-95 transition-opacity cursor-pointer`}
                                    alt={`Post media ${index + 1}`}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Actions */}
            <div className='px-4 py-3 flex items-center gap-6 border-t border-gray-50 bg-white'>
                <button
                    onClick={handleLike}
                    className='flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group'
                    aria-label="Like post"
                >
                    <div className={`p-2 rounded-full group-hover:bg-red-50 transition-colors ${likes.includes(currentUser._id) ? 'text-red-500' : ''}`}>
                        <Heart className={`w-5 h-5 ${likes.includes(currentUser._id) ? 'fill-current' : ''}`} />
                    </div>
                    <span onClick={(e) => { e.stopPropagation(); setShowLikes(true); }} className='font-medium text-sm hover:underline'>
                        {likes.length > 0 ? likes.length : 'Like'}
                    </span>
                </button>

                <button
                    onClick={() => setShowComments(true)}
                    className='flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group'
                    aria-label="Comment on post"
                >
                    <div className='p-2 rounded-full group-hover:bg-indigo-50 transition-colors'>
                        <MessageCircle className='w-5 h-5' />
                    </div>
                    <span className='font-medium text-sm'>
                        {commentCount > 0 ? commentCount : 'Comment'}
                    </span>
                </button>

                <button
                    onClick={handleShare}
                    className='flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group ml-auto'
                    aria-label="Share post"
                >
                    <div className='p-2 rounded-full group-hover:bg-indigo-50 transition-colors'>
                        <Share2 className='w-5 h-5' />
                    </div>
                </button>
            </div>

            {showLikes && <PostLikesList likes={likes} setShowLikes={setShowLikes} />}
            {showComments && <PostCommentsList postId={post._id} setShowComments={setShowComments} onCommentAdded={() => setCommentCount(prev => prev + 1)} />}
        </div>
    )
}

export default PostCard

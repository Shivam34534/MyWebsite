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
    // Shield against orphaned database payloads
    if (!post || !post.user) return null;

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
            title: 'Check out this post on Aura!',
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
        <div className='bg-white sm:border border-gray-200 sm:rounded-lg sm:my-3 transition-shadow duration-250 w-full max-w-[550px] mx-auto overflow-hidden'>
            {/* User Info Header */}
            <div className='px-3 py-3 flex items-center justify-between'>
                <div onClick={() => navigate('/profile/' + post.user._id)} className='flex items-center gap-2.5 cursor-pointer group'>
                    <div className='w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-yellow-400 to-indigo-600 p-[2px]'>
                        <img src={post.user.profile_picture || assets.sample_profile} alt="Profile" className='w-full h-full rounded-full object-cover border-2 border-white' />
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-1'>
                            <span className='font-semibold text-[14px] text-gray-900 leading-tight group-hover:text-gray-600 transition-colors'>
                                {post.user.username}
                            </span>
                            {/* <BadgeCheck className='w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white' /> */}
                        </div>
                    </div>
                </div>
            </div>            {/* Media (Images/Videos) */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className={`grid gap-[1px] w-full bg-black ${post.image_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.image_urls.map((url, index) => {
                        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
                        const isSingle = post.image_urls.length === 1;

                        return isVideo ? (
                            <div key={index} className={`bg-black w-full flex items-center justify-center overflow-hidden ${isSingle ? 'aspect-square' : 'aspect-square'}`}>
                                <video
                                    src={url}
                                    controls
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        ) : (
                            <div key={index} className={`w-full flex items-center justify-center bg-gray-100 overflow-hidden ${isSingle ? 'aspect-square' : 'aspect-square'}`}>
                                <img
                                    src={url}
                                    className='w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer'
                                    alt={`Post media ${index + 1}`}
                                />
                            </div>
                        );
                    })}
                </div>
            )
            }

            {/* Actions Bar */}
            <div className='px-3 py-3 flex items-center justify-between bg-white'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={handleLike}
                        className='group transition-transform active:scale-90 hover:opacity-70'
                        aria-label="Like post"
                    >
                        <Heart className={`w-[26px] h-[26px] transition-colors ${likes.includes(currentUser._id) ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className='group transition-transform active:scale-90 hover:opacity-70'
                        aria-label="Comment on post"
                    >
                        <MessageCircle className='w-[26px] h-[26px] text-gray-900 transition-colors' />
                    </button>

                    <button
                        onClick={handleShare}
                        className='group transition-transform active:scale-90 hover:opacity-70'
                        aria-label="Share post"
                    >
                        <Share2 className='w-[26px] h-[26px] text-gray-900 transition-colors' />
                    </button>
                </div>
            </div>

            {/* Post Data Area (Likes, Caption, Comments) */}
            <div className='px-3 pb-4'>
                {/* Likes String */}
                {likes.length > 0 && (
                    <div
                        onClick={() => setShowLikes(true)}
                        className='font-semibold text-[14px] text-gray-900 cursor-pointer mb-1.5'
                    >
                        {likes.length} {likes.length === 1 ? 'like' : 'likes'}
                    </div>
                )}

                {/* Caption / Content */}
                {post.content && (
                    <div className='text-[14px] text-gray-900 leading-[18px] mb-1.5 inline-block w-full'>
                        <span
                            onClick={() => navigate('/profile/' + post.user._id)}
                            className='font-semibold cursor-pointer mr-2'
                        >
                            {post.user.username}
                        </span>
                        <span
                            className='whitespace-pre-wrap break-words inline'
                            dangerouslySetInnerHTML={{ __html: postWithHashtags }}
                        />
                    </div>
                )}

                {/* Comments Link */}
                {commentCount > 0 && (
                    <div
                        onClick={() => setShowComments(true)}
                        className='text-[14px] text-gray-500 cursor-pointer mb-1.5 hover:underline'
                    >
                        View all {commentCount} comments
                    </div>
                )}

                {/* Timestamp */}
                <div className='text-[10px] text-gray-400 uppercase tracking-wide mt-1'>
                    {moment(post.createdAt).fromNow()}
                </div>
            </div>

            {showLikes && <PostLikesList likes={likes} setShowLikes={setShowLikes} />}
            {showComments && <PostCommentsList postId={post._id} setShowComments={setShowComments} onCommentAdded={() => setCommentCount(prev => prev + 1)} />}
        </div >
    )
}

export default PostCard

import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import React, { use, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../api/axios'
import { useUser, useAuth } from '../../mockClerk'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import PostLikesList from './PostLikesList'
import PostCommentsList from './PostCommentsList'


const PostCard = ({ post }) => {
    // Shield against orphaned database payloads
    if (!post || !post.user) return null;

    const postWithHashtags = post.content?.replace(/(#\w+)/g,
        '<span class="text-indigo-600 font-medium">$1</span>') || ''

    const [likes, setLikes] = useState(post.likes_count || [])
    const [commentCount, setCommentCount] = useState(post.comments_count || 0)
    const [shareCount, setShareCount] = useState(post.shares_count || 0)
    const [showLikes, setShowLikes] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()
    const navigate = useNavigate()

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
            url: window.location.origin
        }

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
            navigator.clipboard.writeText(shareData.url + ' ' + shareData.text)
            toast.success('Link copied to clipboard')
        }
    }

    return (
        <div className='bg-white border border-gray-100 sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 w-full max-w-[550px] mx-auto group/card'>
            {/* User Info Header */}
            <div className='px-5 py-4 flex items-center justify-between'>
                <div onClick={() => navigate('/profile/' + post.user._id)} className='flex items-center gap-3 cursor-pointer group'>
                    <div className='relative'>
                        <div className='w-[48px] h-[48px] rounded-full bg-gradient-to-tr from-yellow-400 via-rose-400 to-indigo-600 p-[2.5px] transition-transform duration-500 group-hover:rotate-12'>
                            <img src={post.user.profile_picture || assets.sample_profile} alt="Profile" className='w-full h-full rounded-full object-cover border-2 border-white' />
                        </div>
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full flex items-center justify-center'>
                            <div className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'></div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <span className='font-bold text-[15px] text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors'>
                            {post.user.username}
                        </span>
                        <span className='text-[11px] text-slate-400 font-medium'>{moment(post.createdAt).fromNow()}</span>
                    </div>
                </div>
                <button className='p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400'>
                    <BadgeCheck className='w-5 h-5 text-indigo-500' />
                </button>
            </div>

            {/* Media (Images/Videos) */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className={`relative w-full bg-slate-50 overflow-hidden ${post.image_urls.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`}>
                    {post.image_urls.map((url, index) => {
                        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
                        return (
                            <div key={index} className='aspect-square overflow-hidden group/media'>
                                {isVideo ? (
                                    <video src={url} controls className='w-full h-full object-cover' />
                                ) : (
                                    <img
                                        src={url}
                                        className='w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-110'
                                        alt=""
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Actions Bar */}
            <div className='px-5 pt-4 pb-3 flex items-center justify-between'>
                <div className='flex items-center gap-6'>
                    <button onClick={handleLike} className='flex items-center gap-1.5 group/btn transition-transform active:scale-90'>
                        <Heart className={`w-7 h-7 transition-all duration-300 ${likes.includes(currentUser._id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-700 group-hover/btn:text-rose-500'}`} />
                        <span className='text-xs font-bold text-slate-600'>{likes.length}</span>
                    </button>

                    <button onClick={() => setShowComments(!showComments)} className='flex items-center gap-1.5 group/btn transition-transform active:scale-90'>
                        <MessageCircle className='w-7 h-7 text-slate-700 group-hover/btn:text-indigo-500 transition-colors' />
                        <span className='text-xs font-bold text-slate-600'>{commentCount}</span>
                    </button>

                    <button onClick={handleShare} className='flex items-center gap-1.5 group/btn transition-transform active:scale-90'>
                        <Share2 className='w-7 h-7 text-slate-700 group-hover/btn:text-emerald-500 transition-colors' />
                        <span className='text-xs font-bold text-slate-600'>{shareCount}</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className='px-5 pb-6'>
                {post.content && (
                    <div className='text-[14px] text-slate-800 leading-relaxed'>
                        <span onClick={() => navigate('/profile/' + post.user._id)} className='font-bold cursor-pointer hover:text-indigo-600 transition-colors mr-2'>
                            {post.user.username}
                        </span>
                        <span className='whitespace-pre-wrap break-words inline text-slate-600' dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                )}

                {commentCount > 0 && (
                    <button onClick={() => setShowComments(true)} className='text-xs font-bold text-indigo-500 mt-3 hover:text-indigo-700 transition-colors'>
                        View all {commentCount} discussions
                    </button>
                )}
            </div>

            {showLikes && <PostLikesList likes={likes} setShowLikes={setShowLikes} />}
            {showComments && <PostCommentsList postId={post._id} setShowComments={setShowComments} onCommentAdded={() => setCommentCount(prev => prev + 1)} />}
        </div>
    )
}

export default PostCard

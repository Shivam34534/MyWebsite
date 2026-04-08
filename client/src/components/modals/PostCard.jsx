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
        <article className="bg-white rounded-[2rem] overflow-hidden border border-stone-200/40 shadow-sm transition-all duration-700 hover:editorial-shadow border-transparent hover:border-stone-200/60 group/card">
            {/* 🏷️ Card Header */}
            <header className="flex items-center justify-between p-5 lg:p-6 pb-4">
                <div onClick={() => navigate('/profile/' + post.user._id)} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full story-ring p-[2px] transition-transform duration-500 group-hover:scale-105">
                        <div className="w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-stone-50">
                            <img 
                                className="w-full h-full object-cover" 
                                src={post.user.profile_picture || assets.sample_profile} 
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt={post.user.username} 
                            />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-1.5'>
                            <h3 className="font-headline font-black text-[15px] leading-tight text-on-surface group-hover:text-primary transition-colors tracking-tight">{post.user.username}</h3>
                            <BadgeCheck className='w-3.5 h-3.5 text-primary-dim fill-primary/10' />
                        </div>
                        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">{post.location || 'Editorial Gallery'}</p>
                    </div>
                </div>
                <button className="text-stone-300 hover:text-on-surface transition-all p-2.5 hover:bg-stone-50 rounded-2xl active:scale-90">
                    <span className="material-symbols-outlined text-[24px]">more_horiz</span>
                </button>
            </header>

            {/* 📽️ Content Canvas */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className="w-full aspect-square bg-stone-50 overflow-hidden relative group/image">
                    <img 
                        className="w-full h-full object-cover group-hover/image:scale-[1.03] transition-transform duration-[2000ms] ease-out cursor-pointer" 
                        src={post.image_urls[0]} 
                        alt="" 
                        onClick={() => navigate('/profile/' + post.user._id)}
                    />
                    {post.image_urls.length > 1 && (
                        <div className="absolute top-6 right-6 bg-white/60 backdrop-blur-xl px-3.5 py-1.5 rounded-full text-stone-900 text-[10px] font-black tracking-[0.2em] uppercase border border-white/40 shadow-sm">
                            Curated Series {post.image_urls.length}
                        </div>
                    )}
                </div>
            )}

            {/* ⚡ Interaction Stage */}
            <div className="p-6 lg:p-8 pt-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={handleLike} className="group/btn transition-transform active:scale-75 flex items-center justify-center">
                            <span 
                                className={`material-symbols-outlined text-[32px] transition-all duration-300 ${likes.includes(currentUser?._id) ? 'text-red-500 scale-110' : 'text-on-surface-variant hover:text-red-500'}`} 
                                style={{ fontVariationSettings: `'FILL' ${likes.includes(currentUser?._id) ? 1 : 0}` }}
                            >
                                favorite
                            </span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="group/btn transition-transform active:scale-75 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all duration-300">
                            <span className="material-symbols-outlined text-[32px] group-hover/btn:scale-110">chat_bubble</span>
                        </button>
                        <button onClick={handleShare} className="group/btn transition-transform active:scale-75 flex items-center justify-center text-on-surface-variant hover:text-emerald-500 transition-all duration-300">
                            <span className="material-symbols-outlined text-[32px] group-hover/btn:scale-110">send</span>
                        </button>
                    </div>
                    <button className="group/btn transition-transform active:scale-75 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all duration-300">
                        <span className="material-symbols-outlined text-[32px] group-hover/btn:scale-110">bookmark</span>
                    </button>
                </div>

                {/* 📝 Narrative Section */}
                <div className="flex flex-col gap-2">
                    <button onClick={() => setShowLikes(true)} className="text-[15px] font-black cursor-pointer hover:text-primary text-on-surface text-left transition-colors tracking-tight">{likes.length.toLocaleString()} Appreciation Points</button>
                    <div className="text-[15px] text-on-surface leading-loose">
                        <span onClick={() => navigate('/profile/' + post.user._id)} className="font-headline font-black mr-2.5 cursor-pointer hover:text-primary transition-colors tracking-tight lowercase">{post.user.username}</span> 
                        <span className="whitespace-pre-wrap break-words text-on-surface font-medium opacity-90" dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                </div>

                {/* 💬 Discussion Feed */}
                <div className="flex flex-col gap-3 mt-1">
                    {commentCount > 0 && (
                        <button onClick={() => setShowComments(true)} className="text-stone-400 text-sm text-left hover:text-primary transition-colors font-bold uppercase tracking-widest text-[11px]">View all {commentCount} comments</button>
                    )}
                    <div className='flex items-center gap-3'>
                        <span className="h-[1px] w-4 bg-stone-200" />
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-black">
                            {moment(post.createdAt).fromNow()}
                        </span>
                    </div>
                </div>
            </div>

            {showLikes && <PostLikesList likes={likes} setShowLikes={setShowLikes} />}
            {showComments && <PostCommentsList postId={post._id} setShowComments={setShowComments} onCommentAdded={() => setCommentCount(prev => prev + 1)} />}
        </article>
    )
}

export default PostCard

import { BadgeCheck, Heart, MessageCircle, MoreHorizontal, Bookmark, Send, Clock, Layers } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../api/axios'
import { useAuth } from '../../mockClerk'
import toast from 'react-hot-toast'
import PostLikesList from './PostLikesList'
import PostCommentsList from './PostCommentsList'

const PostCard = ({ post }) => {
    if (!post || !post.user) return null;

    const navigate = useNavigate()
    const { getToken } = useAuth()
    const currentUser = useSelector((state) => state.user.value)

    const [likes, setLikes] = useState(post.likes_count || [])
    const [commentCount, setCommentCount] = useState(post.comments_count || 0)
    const [showLikes, setShowLikes] = useState(false)
    const [showComments, setShowComments] = useState(false)

    const postWithHashtags = useMemo(() => {
        return post.content?.replace(/(#\w+)/g, '<span class="text-secondary font-black cursor-pointer hover:underline">$1</span>') || ''
    }, [post.content])

    const optimizedImageUrl = useMemo(() => {
        if (!post.image_urls?.[0]) return ''
        const url = post.image_urls[0]
        if (url.includes('ik.imagekit.io')) {
            return url.replace(/\/stories\//, '/stories/tr:h-1000,q-100/')
        }
        return url
    }, [post.image_urls])

    const handleLike = async () => {
        try {
            const token = await getToken()
            const { data } = await api.post('/api/post/like', { postId: post._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                if (likes.includes(currentUser._id)) {
                    setLikes(likes.filter(id => id !== currentUser._id))
                    toast.success("REACTION_REMOVED")
                } else {
                    setLikes([...likes, currentUser._id])
                    toast.success("REACTION_LOGGED")
                }
            }
        } catch (error) {
            console.error('Error liking post:', error)
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: 'NEO_GALLERY_ENTRY',
            text: post.content,
            url: window.location.origin + '/post/' + post._id
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(shareData.url)
            toast.success('LINK_ARCHIVED_TO_CLIPBOARD')
        }
    }

    return (
        <article className="neo-box bg-white overflow-hidden group/card animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ⚡ Segment Header */}
            <header className="flex items-center justify-between p-4 border-b-4 border-black bg-main/10 group-hover/card:bg-main/20 neo-transition">
                <div onClick={() => navigate('/profile/' + post.user._id)} className="flex items-center gap-4 cursor-pointer group/user">
                    <div className="w-12 h-12 neo-box bg-white overflow-hidden -rotate-2 group-hover/user:rotate-0 neo-transition">
                        <img 
                            className="w-full h-full object-cover scale-110 group-hover/user:scale-100 neo-transition" 
                            src={post.user.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} 
                            loading="lazy"
                            alt={post.user.username} 
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-1.5'>
                            <h4 className="italic group-hover/user:underline">@{post.user.username}</h4>
                            <div className="bg-black rounded-full p-0.5">
                                <BadgeCheck className='w-4 h-4 text-main shadow-neo-sm' strokeWidth={3} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-tighter text-black/40">
                            <Clock className="w-3 h-3" strokeWidth={3} />
                            <span>{moment(post.createdAt).fromNow()}</span>
                            <span className="mx-1 opacity-20">|</span>
                            <span>{post.location || 'NEO_DISTRICT'}</span>
                        </div>
                    </div>
                </div>
                <button className="neo-button p-2 bg-white">
                    <MoreHorizontal className="w-5 h-5" strokeWidth={3} />
                </button>
            </header>

            {/* ⚡ Visual Content Segment */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className="w-full aspect-square border-b-4 border-black relative group/image overflow-hidden bg-black">
                    <img 
                        className="w-full h-full object-cover grayscale brightness-90 group-hover/image:grayscale-0 group-hover/image:brightness-100 neo-transition cursor-crosshair scale-100 group-hover/image:scale-105" 
                        src={optimizedImageUrl} 
                        loading="lazy"
                        alt="Visual Entry" 
                        onClick={() => navigate('/profile/' + post.user._id)}
                    />
                    
                    {/* Visual Metadata Overlays */}
                    {post.image_urls.length > 1 && (
                        <div className="absolute top-4 right-4 neo-box bg-accent px-3 py-1 flex items-center gap-2 rotate-2 animate-in slide-in-from-right-4 duration-500">
                            <Layers className="w-4 h-4" />
                            <span className="font-mono text-[10px] font-black uppercase">MULTI_SERIES_ITEM_{post.image_urls.length}</span>
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4">
                        <div className="neo-box bg-white px-3 py-1 font-mono text-[8px] font-black opacity-0 group-hover/image:opacity-100 translate-y-2 group-hover/image:translate-y-0 neo-transition uppercase">
                            RENDER_ENGINE_V4.1 // BUFFER_SUCCESS
                        </div>
                    </div>
                </div>
            )}

            {/* ⚡ Interaction & Data Segment */}
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={handleLike} 
                            className={`neo-button flex items-center gap-3 px-5 py-2.5 ${likes.includes(currentUser?._id) ? 'bg-secondary text-white' : 'bg-white hover:bg-main/40'}`}
                        >
                            <Heart className={`w-5 h-5 ${likes.includes(currentUser?._id) ? 'fill-white' : ''}`} strokeWidth={3} />
                            <span className="font-mono font-black text-sm">{likes.length}</span>
                        </button>
                        <button 
                            onClick={() => setShowComments(!showComments)} 
                            className="neo-button bg-white hover:bg-accent flex items-center gap-3 px-5 py-2.5"
                        >
                            <MessageCircle className="w-5 h-5" strokeWidth={3} />
                            <span className="font-mono font-black text-sm">{commentCount}</span>
                        </button>
                        <button onClick={handleShare} className="neo-button bg-white hover:bg-main/60 p-2.5">
                            <Send className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                    <button className="neo-button bg-white hover:bg-black hover:text-white p-2.5">
                        <Bookmark className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                {/* ⚡ Narrative Context */}
                <div className="flex flex-col gap-6">
                    <div className="text-xl md:text-2xl font-bold leading-tight">
                        <span onClick={() => navigate('/profile/' + post.user._id)} className="font-black italic mr-3 cursor-pointer hover:underline uppercase text-2xl md:text-3xl">@{post.user.username}</span> 
                        <span className="text-black/90" dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                    
                    {/* Status Utility Bar */}
                    <div className='flex items-center justify-between mt-4 pt-6 border-t-[3px] border-black border-dashed'>
                        <button 
                            onClick={() => setShowComments(true)} 
                            className="font-mono font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1 bg-black text-white hover:bg-secondary neo-transition"
                        >
                            ACCESS_REPLIES
                        </button>
                        <div className="flex items-center gap-2 font-mono text-[9px] font-black uppercase text-black/30 italic">
                           <span>LOG_ID_{post._id?.slice(-8)}</span>
                           <div className="flex gap-0.5">
                               <div className="w-1 h-1 bg-main" />
                               <div className="w-1 h-1 bg-secondary" />
                               <div className="w-1 h-1 bg-accent" />
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            {showLikes && <PostLikesList likes={likes} setShowLikes={setShowLikes} />}
            {showComments && <PostCommentsList postId={post._id} setShowComments={setShowComments} onCommentAdded={() => setCommentCount(prev => prev + 1)} />}
        </article>
    )
}

export default PostCard

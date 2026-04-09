import { BadgeCheck, Heart, MessageCircle, MoreHorizontal, Bookmark, Send } from 'lucide-react'
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
                } else {
                    setLikes([...likes, currentUser._id])
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
        <article className="neo-box bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ⚡ Header */}
            <header className="flex items-center justify-between p-4 border-b-4 border-black bg-main">
                <div onClick={() => navigate('/profile/' + post.user._id)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-12 h-12 neo-box bg-white overflow-hidden rotate-2 group-hover:rotate-0 neo-transition">
                        <img 
                            className="w-full h-full object-cover" 
                            src={post.user.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} 
                            loading="lazy"
                            alt="" 
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-1.5'>
                            <h3 className="font-black text-sm tracking-tighter uppercase italic">{post.user.username}</h3>
                            <BadgeCheck className='w-4 h-4 text-black' />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">{post.location || 'NEO_DISTRICT'}</p>
                    </div>
                </div>
                <button className="neo-box bg-white p-2 hover:bg-accent neo-transition">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </header>

            {/* ⚡ Visual Content */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className="w-full aspect-square border-b-4 border-black relative group/image overflow-hidden">
                    <img 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 neo-transition cursor-crosshair scale-100 hover:scale-105" 
                        src={optimizedImageUrl} 
                        loading="lazy"
                        alt="" 
                        onClick={() => navigate('/profile/' + post.user._id)}
                    />
                    {post.image_urls.length > 1 && (
                        <div className="absolute top-4 right-4 neo-box bg-accent px-3 py-1 text-[10px] font-black uppercase rotate-3">
                            MULTIVERSE_ITEM_{post.image_urls.length}
                        </div>
                    )}
                </div>
            )}

            {/* ⚡ Interactions */}
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={handleLike} className={`neo-button flex items-center gap-2 ${likes.includes(currentUser?._id) ? 'bg-secondary text-white' : 'bg-white hover:bg-main'}`}>
                            <Heart className={`w-5 h-5 ${likes.includes(currentUser?._id) ? 'fill-white' : ''}`} strokeWidth={3} />
                            <span className="font-black text-xs">{likes.length}</span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="neo-button bg-white hover:bg-accent flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" strokeWidth={3} />
                            <span className="font-black text-xs">{commentCount}</span>
                        </button>
                        <button onClick={handleShare} className="neo-button bg-white hover:bg-main">
                            <Send className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                    <button className="neo-button bg-white hover:bg-black hover:text-white">
                        <Bookmark className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                {/* ⚡ Caption */}
                <div className="flex flex-col gap-4">
                    <div className="text-sm leading-relaxed">
                        <span onClick={() => navigate('/profile/' + post.user._id)} className="font-black uppercase italic mr-3 cursor-pointer hover:underline text-lg">@{post.user.username}</span> 
                        <span className="font-bold text-black/80" dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                    
                    <div className='flex items-center justify-between mt-4 pt-4 border-t-2 border-black border-dashed'>
                        <button onClick={() => setShowComments(true)} className="font-black uppercase tracking-widest text-[10px] hover:text-secondary underline">READ_PROTOCOLS</button>
                        <span className="text-[10px] font-black uppercase text-black/40">
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

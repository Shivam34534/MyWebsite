import { BadgeCheck, Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../api/axios'
import { useAuth } from '../../mockClerk'
import { assets } from '../../assets/assets'
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

    // Memoized content with highlights
    const postWithHashtags = useMemo(() => {
        return post.content?.replace(/(#\w+)/g, '<span class="text-primary font-bold transition-all hover:opacity-70 cursor-pointer">$1</span>') || ''
    }, [post.content])

    // Optimize ImageKit URLs
    const optimizedImageUrl = useMemo(() => {
        if (!post.image_urls?.[0]) return ''
        const url = post.image_urls[0]
        if (url.includes('ik.imagekit.io')) {
            return url.replace(/\/stories\//, '/stories/tr:h-800,q-80/')
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
            title: 'Curated Excellence - Gallery',
            text: post.content,
            url: window.location.origin + '/post/' + post._id
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
                api.post('/api/post/share', { postId: post._id }, {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(shareData.url)
            toast.success('Gallery link archived to clipboard')
        }
    }

    return (
        <article className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-200/40 shadow-sm transition-all duration-700 hover:editorial-shadow group/card animate-in fade-in duration-700">
            {/* 🏷️ Editorial Header */}
            <header className="flex items-center justify-between p-6 lg:p-7 pb-4">
                <div onClick={() => navigate('/profile/' + post.user._id)} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-11 h-11 rounded-full story-ring p-[2px] transition-all duration-500 group-hover:p-[1px]">
                        <div className="w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-stone-50">
                            <img 
                                className="w-full h-full object-cover" 
                                src={post.user.profile_picture || assets.sample_profile} 
                                loading="lazy"
                                alt="" 
                            />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-1.5'>
                            <h3 className="font-headline font-black text-[14px] leading-none text-on-surface group-hover:text-primary transition-colors tracking-tight uppercase">{post.user.username}</h3>
                            <BadgeCheck className='w-3.5 h-3.5 text-primary-dim fill-primary/10' />
                        </div>
                        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mt-1">{post.location || 'Editorial Studio'}</p>
                    </div>
                </div>
                <button className="text-stone-300 hover:text-on-surface transition-all p-2 rounded-xl active:scale-90">
                    <MoreHorizontal className="w-5 h-5 text-stone-400" />
                </button>
            </header>

            {/* 📽️ Content Stage */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className="w-full aspect-square bg-stone-50 overflow-hidden relative group/image">
                    <img 
                        className="w-full h-full object-cover group-hover/image:scale-[1.04] transition-transform duration-[3000ms] ease-out cursor-pointer" 
                        src={optimizedImageUrl} 
                        loading="lazy"
                        alt="" 
                        onClick={() => navigate('/profile/' + post.user._id)}
                    />
                    {post.image_urls.length > 1 && (
                        <div className="absolute top-6 right-6 bg-white/70 backdrop-blur-2xl px-4 py-2 rounded-full text-stone-900 text-[10px] font-black tracking-widest uppercase border border-white/40 shadow-xl">
                            Curated Series 0{post.image_urls.length}
                        </div>
                    )}
                </div>
            )}

            {/* ⚡ Interaction Stage */}
            <div className="p-7 lg:p-9 pt-7 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button onClick={handleLike} className="flex flex-col items-center gap-1.5 group/btn active:scale-75 transition-transform duration-300">
                            <Heart className={`w-7 h-7 transition-all duration-300 ${likes.includes(currentUser?._id) ? 'fill-red-500 text-red-500 scale-110' : 'text-stone-300 hover:text-red-500'}`} />
                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">{likes.length}</span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="flex flex-col items-center gap-1.5 group/btn active:scale-75 transition-transform duration-300 text-stone-300 hover:text-primary transition-all">
                            <MessageCircle className="w-7 h-7" />
                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">{commentCount}</span>
                        </button>
                        <button onClick={handleShare} className="flex flex-col items-center gap-1.5 group/btn active:scale-75 transition-transform duration-300 text-stone-300 hover:text-emerald-500 transition-all">
                            <Send className="w-7 h-7" />
                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">Share</span>
                        </button>
                    </div>
                    <button className="text-stone-300 hover:text-primary-dim transition-all active:scale-75">
                        <Bookmark className="w-7 h-7" />
                    </button>
                </div>

                {/* 📜 Narrative Stage */}
                <div className="flex flex-col gap-3">
                    <div className="text-[15px] text-on-surface leading-loose">
                        <span onClick={() => navigate('/profile/' + post.user._id)} className="font-headline font-black mr-2.5 cursor-pointer hover:text-primary transition-colors tracking-tight uppercase">{post.user.username}</span> 
                        <span className="whitespace-pre-wrap break-words text-on-surface font-medium opacity-90 tracking-tight" dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                    
                    <div className='flex items-center justify-between mt-2 pt-6 border-t border-stone-100/50'>
                        <button onClick={() => setShowComments(true)} className="text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-70 transition-all">Begin Discussion</button>
                        <span className="text-[9px] text-stone-400 uppercase tracking-[0.4em] font-black">
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

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
        <article className="bg-white neo-border neo-shadow-lg overflow-hidden flex flex-col group animate-in slide-in-from-bottom-4 duration-500">
            {/* 🏷️ Neo Header */}
            <header className="flex items-center justify-between p-4 border-b-[3px] border-black bg-stone-50">
                <div onClick={() => navigate('/profile/' + post.user._id)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-12 h-12 neo-border bg-black p-0.5 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_0px_#A3E635] transition-all">
                        <img 
                            className="w-full h-full object-cover" 
                            src={post.user.profile_picture || assets.sample_profile} 
                            loading="lazy"
                            alt="" 
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-1.5'>
                            <h3 className="font-black text-sm text-black tracking-tighter uppercase leading-none">{post.user.username}</h3>
                            <BadgeCheck className='w-4 h-4 text-primary fill-black' />
                        </div>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">{post.location || 'THE UNIVERSE'}</p>
                    </div>
                </div>
                <button className="w-10 h-10 neo-border bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <MoreHorizontal size={20} />
                </button>
            </header>

            {/* 📽️ Content Stage */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className="w-full aspect-square bg-[#EEE] overflow-hidden border-b-[3px] border-black relative">
                    <img 
                        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500 cursor-pointer" 
                        src={optimizedImageUrl} 
                        loading="lazy"
                        alt="" 
                        onClick={() => navigate('/profile/' + post.user._id)}
                    />
                    {post.image_urls.length > 1 && (
                        <div className="absolute top-4 right-4 bg-tertiary neo-border px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000]">
                            COLLECTION 0{post.image_urls.length}
                        </div>
                    )}
                </div>
            )}

            {/* ⚡ Interaction Stage */}
            <div className="p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={handleLike} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
                            <div className={`p-2 neo-border transition-all ${likes.includes(currentUser?._id) ? 'bg-red-500 text-white shadow-[3px_3px_0px_0px_#000]' : 'bg-white hover:bg-pink-100'}`}>
                                <Heart className={`w-6 h-6 ${likes.includes(currentUser?._id) ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{likes.length} LIKES</span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
                            <div className="p-2 neo-border bg-white hover:bg-lime-100 transition-all">
                                <MessageCircle className="w-6 h-6 text-black" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{commentCount} TIPS</span>
                        </button>
                        <button onClick={handleShare} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
                            <div className="p-2 neo-border bg-white hover:bg-accent transition-all">
                                <Send className="w-6 h-6 text-black" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">SHARE</span>
                        </button>
                    </div>
                    <button className="p-2 neo-border bg-white hover:bg-tertiary transition-all active:scale-90">
                        <Bookmark className="w-6 h-6 text-black" />
                    </button>
                </div>

                {/* 📜 Narrative Stage */}
                <div className="flex flex-col gap-4">
                    <div className="text-sm">
                        <span onClick={() => navigate('/profile/' + post.user._id)} className="font-black mr-2 bg-black text-white px-2 py-0.5 neo-border cursor-pointer hover:bg-primary hover:text-black transition-all uppercase tracking-tight">{post.user.username}</span> 
                        <span className="font-bold text-black" dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                    
                    <div className='flex items-center justify-between mt-2 pt-4 border-t-2 border-dashed border-black/10'>
                        <button onClick={() => setShowComments(true)} className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 neo-border hover:bg-primary transition-all">VIEW DISCUSSION</button>
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/30">
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

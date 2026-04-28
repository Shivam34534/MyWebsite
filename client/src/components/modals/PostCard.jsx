import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send } from 'lucide-react'
import moment from 'moment'

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes_count?.length || 0)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <article className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-primary">
            <img 
              src={post?.user?.profile_picture || '/default-avatar.png'} 
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 leading-none mb-1 hover:underline cursor-pointer">
              {post?.user?.full_name}
            </h3>
            <span className="text-[11px] text-gray-400 font-medium tracking-tight">
              {moment(post?.createdAt).fromNow()} • {post?.user?.location || 'The Web'}
            </span>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {post?.content && (
        <div className="px-5 pb-3">
          <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
            {post.content}
          </p>
        </div>
      )}

      {/* Media */}
      {post?.image_urls && post.image_urls.length > 0 && (
        <div className="px-4 pb-4">
          <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img 
              src={post.image_urls[0]} 
              className="w-full h-full object-cover"
              alt="Post content"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-secondary' : 'text-gray-500 hover:text-secondary'}`}
          >
            <Heart className={`w-6 h-6 transition-transform duration-300 group-active:scale-125 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-bold">{likeCount > 0 ? likeCount : ''}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group">
            <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-bold">{post?.comments_count || ''}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors group">
            <Send className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          </button>
        </div>

        <button className="text-gray-400 hover:text-gray-900 transition-colors">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
    </article>
  )
}

export default PostCard

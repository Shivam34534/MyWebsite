import React from 'react'
import { X, Heart, UserPlus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PostLikesList = ({ likes, onClose }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2">
              <Heart className="text-secondary fill-current w-5 h-5" />
              <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">Likes</h3>
           </div>
           <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-all">
              <X size={20} />
           </button>
        </div>

        {/* Likes List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
           {likes && likes.length > 0 ? (
             likes.map((likeUser, i) => (
               <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all group cursor-pointer"
                  onClick={() => { navigate(`/profile/${likeUser._id}`); onClose(); }}
               >
                  <div className="flex items-center gap-3">
                     <img 
                        src={likeUser.profile_picture || '/default-avatar.png'} 
                        className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" 
                        alt="" 
                     />
                     <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate">{likeUser.full_name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">@{likeUser.username}</span>
                     </div>
                  </div>
                  <button className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                     <UserPlus size={16} />
                  </button>
               </div>
             ))
           ) : (
             <div className="text-center py-16 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                   <Heart className="text-gray-100 w-7 h-7" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No likes yet</p>
             </div>
           )}
        </div>

        <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
            <button onClick={onClose} className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

export default PostLikesList

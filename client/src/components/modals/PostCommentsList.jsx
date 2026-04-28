import React, { useState } from 'react'
import { X, Send, Heart, MoreHorizontal, Sparkles } from 'lucide-react'
import moment from 'moment'

const PostCommentsList = ({ comments, postId, onClose }) => {
  const [text, setText] = useState('')

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2">
              <Sparkles className="text-primary w-5 h-5" />
              <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">Comments</h3>
           </div>
           <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-all">
              <X size={20} />
           </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
           {comments && comments.length > 0 ? (
             comments.map((comment, i) => (
               <div key={i} className="flex gap-4 group">
                  <img src={comment.user?.profile_picture || '/default-avatar.png'} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" alt="" />
                  <div className="flex-1">
                     <div className="bg-gray-50 rounded-2xl p-4 relative">
                        <div className="flex items-center justify-between mb-1">
                           <span className="text-sm font-bold text-gray-900">{comment.user?.full_name}</span>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{moment(comment.createdAt).fromNow()}</span>
                        </div>
                        <p className="text-[14px] text-gray-600 leading-relaxed">{comment.content}</p>
                     </div>
                     <div className="flex items-center gap-4 mt-2 px-2">
                        <button className="text-[10px] font-black text-gray-400 hover:text-secondary uppercase tracking-widest transition-colors">Like</button>
                        <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">Reply</button>
                     </div>
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                   <Sparkles className="text-gray-200 w-8 h-8" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No conversations here yet</p>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-50">
           <form className="flex items-center gap-3">
              <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-gray-100 focus:border-primary outline-none transition-all text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={!text.trim()}
                className={`p-3.5 rounded-xl transition-all shadow-lg ${text.trim() ? 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark' : 'bg-gray-100 text-gray-400'}`}
              >
                <Send size={18} />
              </button>
           </form>
        </div>

      </div>
    </div>
  )
}

export default PostCommentsList

import React, { useState } from 'react'
import { X, Send } from 'lucide-react'
import { useSelector } from 'react-redux'
import { assets } from '../assets/assets'
import api from '../api/axios'
import { useAuth } from '../mockClerk'

const PostCommentsList = ({ setShowComments, postId, onCommentAdded }) => {
    const currentUser = useSelector((state) => state.user.value)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)

    const fetchComments = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get(`/api/comment/get/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setComments(data.comments)
            }
        } catch (error) {
            console.error(error)
        }
    }

    React.useEffect(() => {
        fetchComments()
    }, [postId])

    const handleAddComment = async () => {
        if (!newComment.trim()) return

        try {
            const token = await getToken()
            const { data } = await api.post('/api/comment/add', {
                postId,
                text: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                // Add new comment to list (it comes populated from server)
                setComments([data.comment, ...comments])
                setNewComment('')
                if (onCommentAdded) onCommentAdded()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] flex flex-col'>
                <div className='flex items-center justify-between p-4 border-b border-gray-100'>
                    <h3 className='font-semibold text-lg'>Comments</h3>
                    <button onClick={() => setShowComments(false)} className='p-1 hover:bg-gray-100 rounded-full transition'>
                        <X className='w-5 h-5 text-gray-500' />
                    </button>
                </div>

                <div className='overflow-y-auto p-4 flex flex-col gap-4 flex-1'>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={comment._id || index} className='flex gap-3'>
                                <img src={comment.user?.profile_picture || assets.sample_profile} alt=""
                                    className='w-8 h-8 rounded-full object-cover flex-shrink-0' />
                                <div className='bg-gray-100 p-3 rounded-lg rounded-tl-none'>
                                    <p className='font-semibold text-sm'>{comment.user?.full_name}</p>
                                    <p className='text-sm text-gray-700'>{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 text-center py-4'>No comments yet.</p>
                    )}
                </div>

                <div className='p-4 border-t border-gray-100 flex gap-2'>
                    <img src={currentUser.profile_picture || assets.sample_profile} alt=""
                        className='w-8 h-8 rounded-full object-cover' />
                    <div className='flex-1 relative'>
                        <input
                            type="text"
                            id={`comment-input-${postId}`}
                            name="comment"
                            aria-label="Add a comment"
                            placeholder="Write a comment..."
                            className='w-full bg-gray-100 rounded-full py-2 px-4 pr-10 outline-none text-sm'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button onClick={handleAddComment} className='absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 p-1'>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCommentsList

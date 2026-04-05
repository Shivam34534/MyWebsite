import React, { useState } from 'react'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth, useUser } from '../mockClerk'
import { assets } from '../assets/assets'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const user = useSelector((state) => state.user.value)

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images')
      return
    }

    setLoading(true)
    try {
      const token = await getToken()
      const formData = new FormData()

      let postType = 'text'
      if (images.length > 0 && content.trim()) {
        postType = 'text_with_image'
      } else if (images.length > 0) {
        postType = 'image'
      }

      formData.append('content', content)
      formData.append('post_type', postType)

      images.forEach((image) => {
        formData.append('images', image)
      })

      const { data } = await api.post('/api/post/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success("Post published successfully")
        navigate('/')
      } else {
        throw new Error(data.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error.message || 'Error occurred while publishing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='lg:ml-64 min-h-screen bg-surface flex flex-col items-center justify-center p-6'>
        <div className='w-full max-w-xl bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl flex flex-col gap-10 transition-all hover:shadow-stone-200/40'>
            {/* Header Section */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-3xl font-black font-headline tracking-tighter text-on-surface'>New Story</h1>
                <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40'>Editorial Upload</p>
            </div>

            {/* User Context */}
            <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full story-ring p-[1.5px]'>
                    <div className='w-full h-full rounded-full border border-white overflow-hidden bg-stone-50'>
                        <img 
                            src={user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="" 
                            className='w-full h-full object-cover' 
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h3 className='font-headline font-bold text-sm text-on-surface leading-tight'>{user?.full_name}</h3>
                    <p className='text-xs text-on-surface-variant font-medium'>@{user?.username}</p>
                </div>
            </div>

            {/* Composition Canvas */}
            <div className='flex flex-col gap-6'>
                <textarea 
                    className='w-full min-h-[140px] resize-none text-xl font-medium text-on-surface placeholder:text-on-surface-variant/20 bg-transparent border-none outline-none focus:ring-0 leading-relaxed' 
                    placeholder="What's your story today?"
                    onChange={(e) => setContent(e.target.value)} 
                    value={content} 
                />

                {/* Media Preview Stage */}
                {images.length > 0 && (
                    <div className='grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-500'>
                        {images.map((file, i) => (
                            <div key={i} className='relative aspect-square rounded-2xl overflow-hidden group border border-outline-variant/5 bg-stone-50'>
                                <img src={URL.createObjectURL(file)} className='w-full h-full object-cover transition-transform group-hover:scale-110 duration-700' alt="" />
                                <div 
                                    onClick={() => setImages(images.filter((_, index) => index !== i))} 
                                    className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300'
                                >
                                    <span className="material-symbols-outlined text-white text-3xl">close</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Layer */}
            <div className='flex items-center justify-between pt-8 border-t border-stone-200/10'>
                <div className='flex items-center gap-4'>
                    <label className='p-3.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-on-surface-variant hover:text-primary rounded-2xl cursor-pointer transition-all active:scale-90 flex items-center justify-center shadow-sm'>
                        <span className="material-symbols-outlined text-[26px]">image</span>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => setImages([...images, ...e.target.files])} />
                    </label>
                    <button className='p-3.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-on-surface-variant hover:text-primary rounded-2xl transition-all active:scale-90 flex items-center justify-center shadow-sm'>
                        <span className="material-symbols-outlined text-[26px]">location_on</span>
                    </button>
                </div>

                <button 
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`px-10 py-4 font-bold rounded-2xl shadow-xl transition-all text-sm uppercase tracking-widest ${
                        loading 
                        ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' 
                        : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95'
                    }`}
                >
                    {loading ? 'Processing...' : 'Publish Story'}
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreatePost

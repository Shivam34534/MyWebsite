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
    <div className='w-full min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden'>
        {/* ✨ Editorial Backdrop Mesh */}
        <div className='absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-[#E1306C]/5 rounded-full blur-[120px] pointer-events-none' />
        <div className='absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-[#8037b1]/5 rounded-full blur-[120px] pointer-events-none' />

        <div className='w-full max-w-xl bg-white/80 backdrop-blur-3xl p-10 lg:p-12 rounded-[3.5rem] border border-stone-200/40 shadow-[0_32px_128px_-32px_rgba(0,0,0,0.08)] flex flex-col gap-10 transition-all hover:shadow-[0_48px_160px_-40px_rgba(0,0,0,0.12)] border-transparent hover:border-stone-200/60 z-10'>
            {/* Branding Header */}
            <header className='flex flex-col gap-2'>
                <h1 className='text-4xl font-black font-headline tracking-tighter text-on-surface lowercase'>New Story</h1>
                <p className='text-[10px] font-bold uppercase tracking-[0.5em] text-on-surface-variant/40 pl-1'>Editorial Upload</p>
            </header>

            {/* Curator Identity */}
            <div className='flex items-center gap-5'>
                <div className='w-14 h-14 rounded-full story-ring p-[2.5px] transition-transform duration-500 hover:scale-105'>
                    <div className='w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-stone-50'>
                        <img 
                            src={user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="" 
                            className='w-full h-full object-cover' 
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h3 className='font-headline font-black text-base text-on-surface tracking-tight leading-none'>{user?.full_name}</h3>
                    <p className='text-[11px] text-on-surface-variant/60 font-bold uppercase tracking-widest mt-1.5'>@{user?.username}</p>
                </div>
            </div>

            {/* Creative Canvas */}
            <div className='flex flex-col gap-8'>
                <textarea 
                    className='w-full min-h-[160px] resize-none text-[22px] font-medium text-on-surface placeholder:text-stone-300 bg-transparent border-none outline-none focus:ring-0 leading-[1.6] transition-all' 
                    placeholder="What's your story today?"
                    onChange={(e) => setContent(e.target.value)} 
                    value={content} 
                />

                {/* Media Preview Stage */}
                {images.length > 0 && (
                    <div className='grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-700'>
                        {images.map((file, i) => (
                            <div key={i} className='relative aspect-square rounded-[2rem] overflow-hidden group border border-stone-200/20 bg-stone-50 shadow-md'>
                                <img src={URL.createObjectURL(file)} className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' alt="" />
                                <div 
                                    onClick={() => setImages(images.filter((_, index) => index !== i))} 
                                    className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-500'
                                >
                                    <span className="material-symbols-outlined text-white text-4xl hover:scale-110 transition-transform">close</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tool & Action Layer */}
            <footer className='flex items-center justify-between pt-10 border-t border-stone-100'>
                <div className='flex items-center gap-5'>
                    <label className='group relative p-4 bg-stone-50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/40 text-stone-400 hover:text-primary rounded-2xl cursor-pointer transition-all active:scale-90 border border-transparent hover:border-stone-100/60'>
                        <span className="material-symbols-outlined text-[30px] group-hover:scale-110 transition-transform">add_a_photo</span>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => setImages([...images, ...e.target.files])} />
                    </label>
                    <button className='group p-4 bg-stone-50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/40 text-stone-400 hover:text-emerald-500 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-stone-100/60'>
                        <span className="material-symbols-outlined text-[30px] group-hover:scale-110 transition-transform">location_on</span>
                    </button>
                    <button className='hidden sm:flex group p-4 bg-stone-50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/40 text-stone-400 hover:text-amber-500 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-stone-100/60'>
                        <span className="material-symbols-outlined text-[30px] group-hover:scale-110 transition-transform">loyalty</span>
                    </button>
                </div>

                <button 
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`px-12 py-5 font-headline font-black rounded-3xl transition-all text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_24px_48px_-10px_rgba(var(--primary-rgb),0.3)] active:scale-95 ${
                        loading 
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                        : 'bg-primary text-white hover:scale-[1.03]'
                    }`}
                >
                    {loading ? 'Archiving...' : 'Publish story'}
                </button>
            </footer>
        </div>
    </div>
  )
}

export default CreatePost

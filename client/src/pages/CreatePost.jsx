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
    <div className='w-full min-h-screen bg-[#F2F2F2] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden'>
        <div className='w-full max-w-2xl bg-white p-8 md:p-12 neo-border neo-shadow-lg flex flex-col gap-10 z-10'>
            {/* Branding Header */}
            <header className='flex flex-col gap-2 -rotate-1'>
                <h1 className='text-6xl font-black tracking-tighter text-black uppercase leading-none'>NEW_VIBE.LOG</h1>
                <div className='bg-primary text-black px-3 py-1 neo-border text-[10px] font-black uppercase tracking-widest w-fit'>STORY_PROTO.V3</div>
            </header>

            {/* Curator Identity */}
            <div className='flex items-center gap-5 bg-stone-50 p-4 neo-border shadow-[4px_4px_0px_0px_#000]'>
                <div className='w-16 h-16 neo-border bg-black p-0.5'>
                    <div className='w-full h-full bg-white overflow-hidden'>
                        <img 
                            src={user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="" 
                            className='w-full h-full object-cover grayscale-[0.2]' 
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h3 className='font-black text-xl text-black uppercase leading-none italic'>{user?.full_name}</h3>
                    <p className='text-xs font-black uppercase tracking-widest mt-1 opacity-40'>CURATOR_ID: @{user?.username}</p>
                </div>
            </div>

            {/* Creative Canvas */}
            <div className='flex flex-col gap-8'>
                <textarea 
                    className='w-full min-h-[180px] resize-none text-2xl font-black text-black placeholder:text-black/20 bg-stone-50 p-6 neo-border outline-none focus:bg-white transition-all shadow-inner' 
                    placeholder="ENTER SCRIPT OR LEAVE IT RAW..."
                    onChange={(e) => setContent(e.target.value)} 
                    value={content} 
                />

                {/* Media Preview Stage */}
                {images.length > 0 && (
                    <div className='grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500'>
                        {images.map((file, i) => (
                            <div key={i} className='relative aspect-square neo-border bg-black p-0.5 shadow-[6px_6px_0_0_#A3E635]'>
                                <img src={URL.createObjectURL(file)} className='w-full h-full object-cover' alt="" />
                                <div 
                                    onClick={() => setImages(images.filter((_, index) => index !== i))} 
                                    className='absolute -top-3 -right-3 w-8 h-8 bg-black text-white neo-border flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors'
                                >
                                    <X size={20} strokeWidth={4} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tool & Action Layer */}
            <footer className='flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t-[3px] border-black'>
                <div className='flex items-center gap-4'>
                    <label className='group p-4 bg-white neo-border shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] cursor-pointer transition-all active:scale-95'>
                        <span className="material-symbols-outlined text-[32px] font-black text-black group-hover:text-primary">photo_camera</span>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => setImages([...images, ...e.target.files])} />
                    </label>
                    <button className='group p-4 bg-white neo-border shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#A3E635] transition-all active:scale-95 text-black'>
                        <span className="material-symbols-outlined text-[32px] font-black">location_on</span>
                    </button>
                    <button className='hidden sm:flex group p-4 bg-white neo-border shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#ff90e8] transition-all active:scale-95 text-black'>
                        <span className="material-symbols-outlined text-[32px] font-black">loyalty</span>
                    </button>
                </div>

                <button 
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`neo-button w-full md:w-auto px-12 py-6 text-lg font-black italic translate-y-[-4px] active:translate-y-0 ${
                        loading 
                        ? 'bg-stone-300 text-black/50 cursor-not-allowed shadow-none' 
                        : 'bg-primary text-black'
                    }`}
                >
                    {loading ? 'UPLOADING...' : 'PUBLISH_VIBE'}
                </button>
            </footer>
        </div>
    </div>
  )
}

export default CreatePost

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Image, Video, MapPin, Smile, X, Send, Sparkles } from 'lucide-react'

const CreatePost = () => {
  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && images.length === 0) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('content', content)
    images.forEach(img => formData.append('images', img))

    try {
      const { data } = await api.post('/api/post/add', formData)
      if (data.success) {
        toast.success("Vibe posted!")
        navigate('/')
      }
    } catch (error) {
      toast.error("Failed to post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="text-primary w-6 h-6" />
         </div>
         <div>
            <h1 className="text-3xl font-black text-gray-900">Share a Vibe</h1>
            <p className="text-gray-500 font-medium">What's inspiring you today?</p>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Editor Header */}
          <div className="p-6 flex items-center gap-4 border-b border-gray-50">
            <img src={user?.profile_picture || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">{user?.full_name}</span>
              <span className="text-xs text-gray-500 font-medium tracking-tight">Public • Anyone can see</span>
            </div>
          </div>

          {/* Text Area */}
          <div className="p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your story..."
              className="w-full min-h-[150px] text-lg font-medium text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-300"
            />

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {previews.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    <button 
                      type="button" onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Toolbar */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="p-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all cursor-pointer">
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                <Image size={22} />
              </label>
              <button type="button" className="p-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-accent transition-all">
                <Video size={22} />
              </button>
              <button type="button" className="p-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-orange-500 transition-all">
                <MapPin size={22} />
              </button>
              <button type="button" className="p-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-yellow-500 transition-all">
                <Smile size={22} />
              </button>
            </div>

            <button 
              type="submit" disabled={loading || (!content.trim() && images.length === 0)}
              className="button-primary flex items-center gap-2 px-8 py-3"
            >
              {loading ? 'Posting...' : (
                <>
                  <Send size={18} /> <span>Post Vibe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost

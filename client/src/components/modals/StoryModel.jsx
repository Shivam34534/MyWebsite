import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../mockClerk'
import api from '../../api/axios'

const StoryModel = ({ setShowModel, fetchStories }) => {

    const bgColors = [
        "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "#111827",
        "#374151"
    ]

    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const { getToken } = useAuth()

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleCreateStory = async () => {
        try {
            const token = await getToken()
            let media_type = 'text'
            if (mode === 'media' && media) {
                media_type = media.type.startsWith('image') ? 'image' : 'video'
            }

            if (media_type === 'text' && !text.trim()) {
                throw new Error('Please write something for your text story')
            }

            const formData = new FormData()
            formData.append('content', text)
            formData.append('media_type', media_type)
            formData.append('background_color', background)

            if (media && media_type !== 'text') {
                formData.append('media', media)
            }

            const { data } = await api.post('/api/story/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!data.success) throw new Error(data.message)

            await fetchStories()
            setShowModel(false)
        } catch (error) {
            console.error('Error creating story:', error)
            throw error
        }
    }

    return (
        <div className='fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in'>
            <div className='w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col'>
                <div className='p-6 border-b border-gray-50 flex items-center justify-between'>
                    <button onClick={() => setShowModel(false)} className='p-3 rounded-xl hover:bg-gray-50 text-gray-400 transition-all'>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className='text-xl font-black text-gray-900 tracking-tight'>Create Story</h2>
                    <div className='w-11'></div>
                </div>

                <div className="p-8">
                    <div className='rounded-3xl h-[450px] flex items-center justify-center relative overflow-hidden shadow-inner' style={{ background: background }}>
                        {
                            (mode === 'text' || mode === 'media') && (
                                <textarea
                                    className={`bg-transparent text-white w-full h-full p-10 text-3xl font-bold text-center border-none resize-none focus:outline-none z-10 placeholder:text-white/30 leading-snug flex items-center justify-center ${mode === 'media' && previewUrl ? 'absolute inset-0 bg-black/40' : ''}`}
                                    placeholder="Tap to type..."
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                            )
                        }
                        {
                            mode === 'media' && previewUrl && (
                                media?.type.startsWith('image') ? (
                                    <img src={previewUrl} alt="" className='object-cover w-full h-full absolute inset-0' />
                                ) : (
                                    <video src={previewUrl} className='object-cover w-full h-full absolute inset-0' autoPlay muted loop />
                                )
                            )
                        }
                    </div>

                    <div className='flex items-center justify-between mt-8'>
                        <div className='flex gap-3'>
                            {bgColors.map((color) => (
                                <button 
                                    key={color} 
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${background === color ? 'border-primary' : 'border-white shadow-sm'}`} 
                                    style={{ background: color }} 
                                    onClick={() => setBackground(color)} 
                                />
                            ))}
                        </div>

                        <div className='flex gap-3'>
                            <button 
                                onClick={() => { setMode('text'); setMedia(null); setPreviewUrl(null); }} 
                                className={`p-3 rounded-xl transition-all ${mode === 'text' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                            >
                                <TextIcon size={20} />
                            </button>
                            <label className={`p-3 rounded-xl cursor-pointer transition-all ${mode === 'media' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}>
                                <input onChange={(e) => { handleMediaUpload(e); setMode('media') }} type="file" accept='image/*,video/*' className='hidden' />
                                <Upload size={20} />
                            </label>
                        </div>
                    </div>

                    <button 
                        onClick={() => toast.promise(handleCreateStory(), {
                            loading: 'Creating...',
                            success: <b>Story shared!</b>,
                            error: e => <b>{e.message}</b>,
                        })} 
                        className='w-full button-primary py-4 mt-8'
                    >
                        Share Story
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StoryModel

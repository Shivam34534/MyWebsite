import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../mockClerk'
import api from '../../api/axios'

const StoryModel = ({ setShowModel, fetchStories }) => {

    const bgColors = ["#5733ff", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488", "#ff5733", "#33ff57",
        "#f4f6e5", "#f333ff", "#00bfff", "#ff69b4", "#7fff00", "#1e90ff", "#ff4500", "#8a2be2", "#20b2aa"]


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
            let token
            try {
                token = await getToken()
            } catch (e) {
                // Create or use existing dev user for local testing
                try {
                    const resp = await api.post('/api/dev/create')
                    if (resp.data?.success && resp.data.userId) {
                        localStorage.setItem('dev_user', resp.data.userId)
                    }
                } catch (err) {
                    // ignore
                }
            }

            let media_type = 'text'
            if (mode === 'media' && media) {
                if (media.type.startsWith('image')) {
                    media_type = 'image'
                } else if (media.type.startsWith('video')) {
                    media_type = 'video'
                }
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

            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            const { data } = await api.post('/api/story/add', formData, {
                headers
            })

            if (!data.success) {
                throw new Error(data.message || 'Failed to create story')
            }

            await fetchStories()
            setShowModel(false)
        } catch (error) {
            console.error('Error creating story:', error)
            throw error
        }
    }

    return (
        <div className='fixed inset-0 z-[120] min-h-screen bg-black/80 flex items-center justify-center p-4 animate-in zoom-in-95 duration-300'>
            <div className='w-full max-w-md bg-white neo-border neo-shadow-lg p-8 flex flex-col gap-6'>
                <div className='flex items-center justify-between border-b-[4px] border-black pb-4 -rotate-1'>
                    <button onClick={() => setShowModel(false)} className='w-10 h-10 neo-border bg-white text-black hover:bg-black hover:text-white transition-all flex items-center justify-center font-black'>
                        <ArrowLeft size={18} strokeWidth={4} />
                    </button>
                    <h2 className='text-2xl font-black uppercase tracking-tighter italic'>NEW_STORY.ISO</h2>
                    <div className='w-10'></div>
                </div>

                <div className='neo-border h-[400px] flex items-center justify-center relative shadow-[8px_8px_0_0_#000]' style={{ backgroundColor: background }}>
                    {
                        (mode === 'text' || mode === 'media') && (
                            <textarea
                                className={`bg-transparent text-white w-full h-full p-8 text-xl font-black uppercase tracking-tight resize-none focus:outline-none z-10 placeholder:text-white/40 leading-tight ${mode === 'media' && previewUrl ? 'absolute inset-0 bg-black/40' : ''}`}
                                placeholder="INITIALIZE_NARRATIVE_STREAM..."
                                onChange={(e) => setText(e.target.value)}
                                value={text}
                            />
                        )
                    }
                    {
                        mode === 'media' && previewUrl && (
                            media?.type.startsWith('image') ? (
                                <img src={previewUrl} alt="" className='object-cover max-h-full w-full h-full absolute inset-0 grayscale-[0.2]' />
                            ) : (
                                <video src={previewUrl} className='object-cover max-h-full w-full h-full absolute inset-0' controls />
                            )
                        )
                    }
                </div>

                <div className='flex flex-wrap mt-2 gap-2 p-3 bg-[#EEE] neo-border shadow-inner'>
                    {bgColors.map((color) => (
                        <button key={color} className='w-6 h-6 neo-border cursor-pointer transition-transform hover:scale-110' style={{ backgroundColor: color }} onClick={() =>
                                setBackground(color)} />
                    ))}
                </div>

                <div className='flex gap-4 mt-2'>
                    <button onClick={() => {
                        setMode('text');
                        setMedia(null);
                        setPreviewUrl(null);
                    }} className={`flex-1 flex items-center justify-center gap-3 p-4 neo-border font-black uppercase text-[10px] transition-all ${mode === 'text' ? "bg-[#A3E635] text-black shadow-[4px_4px_0_0_#000]" : "bg-white text-black/40 hover:bg-stone-50"}`}>
                        <TextIcon size={18} strokeWidth={3} /> TEXT_MODE
                    </button>
                    <label className={`flex-1 flex items-center justify-center gap-3 p-4 neo-border font-black uppercase text-[10px] cursor-pointer transition-all ${mode === 'media' ? "bg-[#A3E635] text-black shadow-[4px_4px_0_0_#000]" : "bg-white text-black/40 hover:bg-stone-50"}`}>
                        <input onChange={(e) => { handleMediaUpload(e); setMode('media') }} type="file" accept='image/*,video/*'
                            className='hidden' />
                        <Upload size={18} strokeWidth={3} /> MEDIA_UPLOAD
                    </label>
                </div>

                <button onClick={() => toast.promise(handleCreateStory(), {
                    loading: 'UPLOADING...',
                    success: <b>STORY_INITIALIZED</b>,
                    error: e => <b>{e.message}</b>,
                })} className='neo-button bg-black text-[#A3E635] py-5 mt-2 flex items-center justify-center gap-3 shadow-[6px_6px_0_0_#A3E635] hover:shadow-[10px_10px_0_0_#A3E635]'>
                    <Sparkle size={20} strokeWidth={3} /> BROADCAST_STORY
                </button>
            </div>
        </div>

    )
}

export default StoryModel

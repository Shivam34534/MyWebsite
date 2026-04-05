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
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur
        text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={() => setShowModel(false)} className='text-white 
                    p-2 cursor-pointer'>
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>

                <div className='rounded-lg h-96 flex items-center justify-center
                relative' style={{ backgroundColor: background }}>

                    {
                        (mode === 'text' || mode === 'media') && (
                            <textarea
                                className={`bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none z-10 ${mode === 'media' && previewUrl ? 'absolute inset-0 bg-black/20 placeholder-gray-200' : ''}`}
                                placeholder="What's on your mind?"
                                onChange={(e) => setText(e.target.value)}
                                value={text}
                            />
                        )
                    }
                    {
                        mode === 'media' && previewUrl && (
                            media?.type.startsWith('image') ? (
                                <img src={previewUrl} alt="" className='object-cover 
                                     max-h-full w-full h-full absolute inset-0' />
                            ) : (
                                <video src={previewUrl} className='object-cover
                                    max-h-full w-full h-full absolute inset-0' controls />
                            )
                        )
                    }

                </div>
                <div className='flex mt-4 gap-2'>
                    {bgColors.map((color) => (
                        <button key={color} className='w-6 h-6 rounded-full ring
                        cursor-pointer' style={{ backgroundColor: color }} onClick={() =>
                                setBackground(color)} />
                    ))}
                </div>
                <div className='flex gap-2 mt-4'>
                    <button onClick={() => {
                        setMode('text');
                        setMedia(null);
                        setPreviewUrl(null);
                        // Do not clear text
                    }} className={`flex-1 flex items-center
                        justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'text' ? "bg-white text-black"
                            : "bg-zinc-800"}`}>
                        <TextIcon size={18} /> Text
                    </button>
                    <label className={`flex-1 flex items-center
                        justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'media' ? "bg-white text-black"
                            : "bg-zinc-800"}`}>
                        <input onChange={(e) => { handleMediaUpload(e); setMode('media') }} type="file" accept='image/*,video/*'
                            className='hidden' />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>
                <button onClick={() => toast.promise(handleCreateStory(), {
                    loading: 'Saving...',
                    success: <p>Story Added </p>,
                    error: e => <p>{e.message}</p>,
                })} className='flex items-center justify-center gap-2 text-white
                py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer'>
                    <Sparkle size={18} /> Create Story
                </button>

            </div>

        </div>
    )
}

export default StoryModel

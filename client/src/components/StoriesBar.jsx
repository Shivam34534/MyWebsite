import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import api from '../api/axios'
import { useUser, useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const StoriesBar = () => {

    const [stories, setStories] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [viewStory, setViewStory] = useState(null)
    const { getToken } = useAuth()

    const fetchStories = async () => {
        try {
            let token
            try {
                token = await getToken()
            } catch (e) {
                // If Clerk token is not available (local dev), create a dev user and retry
                try {
                    const resp = await api.post('/api/dev/create')
                    if (resp.data?.success && resp.data.userId) {
                        localStorage.setItem('dev_user', resp.data.userId)
                    }
                } catch (err) {
                    // ignore and proceed — axios will attach x-dev-user if present
                }
            }

            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const { data } = await api.get('/api/story/all', { headers })
            if (data.success) {
                setStories(data.stories)
            } else {
                toast.error(data.message || 'Failed to fetch stories')
            }
        } catch (error) {
            console.error('Error fetching stories:', error)
            toast.error(error.response?.data?.message || 'Failed to fetch stories')
        }
    }

    useEffect(() => {
        fetchStories()
    }, [])

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
        const userId = story.user._id
        if (!acc[userId]) {
            acc[userId] = {
                user: story.user,
                stories: []
            }
        }
        acc[userId].stories.push(story)
        return acc
    }, {})

    const storiesByUser = Object.values(groupedStories).map(group => {
        // Sort stories within the group by date ascending (Oldest first -> Newest last)
        group.stories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        return group
    }).sort((a, b) => {
        // Sort groups by their most recent story (Newest story first)
        const lastStoryA = a.stories[a.stories.length - 1]
        const lastStoryB = b.stories[b.stories.length - 1]
        return new Date(lastStoryB.createdAt) - new Date(lastStoryA.createdAt)
    })

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar
    overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* Add story card */}
                <div onClick={() => setShowModel(true)} className='rounded-lg shadow-sm min-w-[130px] max-w-[130px] min-h-[176px] max-h-[176px] cursor-pointer hover:shadow-lg transition-all duration-200
                border-2 border-dashed border-indigo-300 bg-gradient-to-b 
                from-indigo-50 to-white'>
                    <div className='h-full flex flex-col items-center justify-center
                    p-4'>
                        <div className='size-10 bg-indigo-500 rounded-full flex
                        items-center justify-center mb-3'>
                            <Plus className='w-5 h-5 text-white' />
                        </div>
                        <p className='text-sm font-medium text-slate-700
                        text-center'>Create Story</p>
                    </div>

                </div>
                {/* Story cards */}
                {
                    storiesByUser.map((group, index) => (
                        <div onClick={() => setViewStory(group.stories)} key={index} className={`relative rounded-lg shadow
                        min-w-[130px] max-w-[130px] min-h-[176px] max-h-[176px] cursor-pointer hover:shadow-lg
                        transition-all duration-200 bg-gradient-to-b from-indigo-500
                        to-purple-600 hover:from-indigo-700 hover:to-purple-800
                        active:scale-95 overflow-hidden`}>
                            <img src={group.user.profile_picture || assets.sample_profile} alt=""
                                className='absolute size-8 top-3 left-3 z-10 rounded-full
                            ring ring-gray-100 shadow' />
                            <p className='absolute top-18 left-3 text-white/60 text-sm
                            truncate max-w-24'>{group.stories.length} Stories</p>
                            <p className='text-white absolute bottom-1 right-2 z-10
                            text'>{moment(group.stories[group.stories.length - 1].createdAt).fromNow()}</p>
                            {
                                group.stories[0].media_type !== 'text' && (
                                    <div className='absolute inset-0 z-0 rounded-lg
                                    bg-black overflow-hidden'>
                                        {
                                            group.stories[0].media_type === "image" ?
                                                <img src={group.stories[0].media_url} alt=""
                                                    className='h-full w-full object-cover
                                                hover:scale-110 transition duration-500
                                                opacity-70 hover:opacity-80' />
                                                :
                                                <video src={group.stories[0].media_url}
                                                    className='h-full w-full object-cover
                                                hover:scale-110 transition duration-500
                                                opacity-70 hover:opacity-80' />
                                        }

                                    </div>

                                )
                            }
                        </div>
                    ))
                }
            </div>


            {/* Add Story Model */}
            {
                showModel && <StoryModel setShowModel={setShowModel} fetchStories=
                    {fetchStories} />}
            {/* View Story Modal */}
            {viewStory && <StoryViewer stories={viewStory} setViewStory=
                {setViewStory} />}
        </div>
    )
}

export default StoriesBar

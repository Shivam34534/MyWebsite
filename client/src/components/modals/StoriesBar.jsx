import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import api from '../../api/axios'
import { useUser, useAuth } from '../../mockClerk'
import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'
import { useSelector } from 'react-redux'

const StoriesBar = () => {
    const user = useSelector((state) => state.user.value)
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
                // Handle token fetch error if needed
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
        group.stories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        return group
    }).sort((a, b) => {
        const lastStoryA = a.stories[a.stories.length - 1]
        const lastStoryB = b.stories[b.stories.length - 1]
        return new Date(lastStoryB.createdAt) - new Date(lastStoryA.createdAt)
    })

    return (
        <section className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
            {/* Your Story */}
            <div onClick={() => setShowModel(true)} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className="relative w-16 h-16 rounded-full story-ring transition-transform group-hover:scale-105 duration-300">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-stone-100">
                        <img 
                            className="w-full h-full object-cover opacity-60" 
                            src={user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="Your Story" 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                        <span className="material-symbols-outlined text-[12px] font-bold">add</span>
                    </div>
                </div>
                <span className="text-[11px] font-bold text-on-surface truncate w-16 text-center tracking-tight">Your Story</span>
            </div>

            {/* Other Stories */}
            {
                storiesByUser.map((group, index) => (
                    <div onClick={() => setViewStory(group.stories)} key={index} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                        <div className="w-16 h-16 rounded-full story-ring transition-all group-hover:scale-105 duration-300 p-[2px]">
                            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={group.user.profile_picture || assets.sample_profile} 
                                    onError={(e) => { e.target.src = assets.sample_profile }}
                                    alt={group.user.full_name} 
                                />
                            </div>
                        </div>
                        <span className="text-[11px] font-medium text-on-surface-variant truncate w-16 text-center">{group.user.username}</span>
                    </div>
                ))
            }

            {/* Add Story Model */}
            {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}
            
            {/* View Story Modal */}
            {viewStory && <StoryViewer stories={viewStory} setViewStory={setViewStory} />}
        </section>
    )
}

export default StoriesBar

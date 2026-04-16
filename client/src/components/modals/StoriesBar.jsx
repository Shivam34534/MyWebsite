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
        <section className="flex gap-6 overflow-x-auto no-scrollbar py-2 px-1">
            {/* Your Story */}
            <div onClick={() => setShowModel(true)} className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group">
                <div className="relative w-16 h-16 neo-border bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="w-full h-full overflow-hidden flex items-center justify-center">
                        <img 
                            className="w-full h-full object-cover opacity-60" 
                            src={user?.profile_picture || assets.sample_profile} 
                            onError={(e) => { e.target.src = assets.sample_profile }}
                            alt="Your Story" 
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary neo-border w-7 h-7 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                        <Plus size={16} strokeWidth={4} />
                    </div>
                </div>
                <span className="text-[10px] font-black text-black truncate w-16 text-center tracking-widest uppercase italic">YOU</span>
            </div>

            {/* Other Stories */}
            {
                storiesByUser.map((group, index) => (
                    <div onClick={() => setViewStory(group.stories)} key={index} className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group">
                        <div className="w-16 h-16 neo-border bg-black p-0.5 shadow-[4px_4px_0px_0px_#A3E635] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_#A3E635] transition-all">
                            <div className="w-full h-full overflow-hidden bg-white">
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={group.user.profile_picture || assets.sample_profile} 
                                    onError={(e) => { e.target.src = assets.sample_profile }}
                                    alt={group.user.full_name} 
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-black truncate w-16 text-center uppercase tracking-tighter italic">@{group.user.username}</span>
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

import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import api from '../../api/axios'
import { useAuth } from '../../mockClerk'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const StoriesBar = () => {
    const user = useSelector((state) => state.user.value)
    const [stories, setStories] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [viewStory, setViewStory] = useState(null)
    const { getToken } = useAuth()

    const fetchStories = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/story/all', { 
                headers: { Authorization: `Bearer ${token}` } 
            })
            if (data.success) {
                setStories(data.stories)
            }
        } catch (error) {
            console.error('Error fetching stories:', error)
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
            {/* ⚡ Your Identity Node */}
            <div onClick={() => setShowModel(true)} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className="relative w-16 h-16 neo-box bg-white overflow-hidden rotate-2 group-hover:rotate-0 neo-transition">
                    <img 
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100" 
                        src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                        alt="Your Story" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="neo-box bg-main p-1 rotate-[-10deg] group-hover:rotate-0 neo-transition border-2">
                            <Plus className="w-4 h-4 text-black" strokeWidth={4} />
                        </div>
                    </div>
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-tighter italic">YOU</span>
            </div>

            {/* ⚡ Other Identity Nodes */}
            {
                storiesByUser.map((group, index) => (
                    <div onClick={() => setViewStory(group.stories)} key={index} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                        <div className="w-16 h-16 neo-box bg-white overflow-hidden -rotate-2 group-hover:rotate-0 neo-transition p-1">
                            <div className="w-full h-full bg-accent">
                                <img 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 neo-transition border-2 border-black" 
                                    src={group.user.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${group.user.username}`} 
                                    alt={group.user.full_name} 
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-black uppercase tracking-tighter truncate w-16 text-center italic">@{group.user.username}</span>
                    </div>
                ))
            }

            {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}
            {viewStory && <StoryViewer stories={viewStory} setViewStory={setViewStory} />}
        </section>
    )
}

export default StoriesBar

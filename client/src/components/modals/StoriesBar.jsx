import React from 'react'
import { Plus } from 'lucide-react'

const StoriesBar = ({ user }) => {
  // Mock stories for demonstration
  const stories = [
    { id: 1, name: 'Your Story', image: user?.profile_picture, isUser: true },
    { id: 2, name: 'Alice', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 3, name: 'Bob', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
    { id: 4, name: 'Charlie', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: 5, name: 'Diana', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    { id: 6, name: 'Evan', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  ]

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 mb-8">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
          <div className={`relative p-[3px] rounded-[1.4rem] transition-transform duration-300 group-hover:scale-105 ${story.isUser ? 'bg-gray-100' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-primary'}`}>
            <div className="p-0.5 rounded-[1.2rem] bg-white">
              <img 
                src={story.image || '/default-avatar.png'} 
                className="w-16 h-16 rounded-[1.1rem] object-cover"
                alt={story.name}
              />
            </div>
            {story.isUser && (
              <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <span className={`text-[11px] font-bold ${story.isUser ? 'text-gray-400' : 'text-gray-900'}`}>
            {story.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default StoriesBar

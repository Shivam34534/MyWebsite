import React, { useState, useEffect } from 'react'
import UserCard from '../components/modals/UserCard.jsx'
import PostCard from '../components/modals/PostCard.jsx'
import Loading from '../components/modals/Loading'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Discover = () => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchInitialDiscover = async () => {
      if (!input.trim()) {
        try {
          const token = await getToken();
          const { data } = await api.post('/api/user/discover', { input: '' }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setSuggestedUsers(data.users.slice(0, 8));
          }
        } catch (error) {
          console.error('Initial discover error', error);
        }
      } else {
        setSuggestedUsers([]);
      }
    };
    fetchInitialDiscover();
  }, [input, getToken]);

  useEffect(() => {
    if (!input.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await api.get(`/api/search?query=${input}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setUsers(data.users);
          setPosts(data.posts);
        } else {
          toast.error(data.message || 'Failed to search');
        }
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [input, getToken]);

  return (
    <div className='w-full min-h-screen bg-surface px-4 sm:px-8 py-10 flex flex-col gap-12 overflow-y-auto no-scrollbar'>
      {/* Title Section */}
      <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-black font-headline tracking-tighter text-on-surface uppercase'>Discover</h1>
          <p className='text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant/40'>Explore the global gallery community</p>
      </div>

      {/* Global Search Canvas */}
      <div className='relative w-full max-w-2xl group transition-all'>
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[24px]">search</span>
          <input 
              type="text" 
              placeholder='Search creators or gallery stories...'
              className='w-full pl-14 pr-6 py-4 bg-surface-container rounded-3xl border-none text-base placeholder:text-on-surface-variant/20 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-on-surface shadow-sm' 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
          />
      </div>
        
      {loading ? (
        <div className="py-20 flex justify-center items-center">
            <Loading />
        </div>
      ) : (
        <div className='flex flex-col gap-16 pb-20'>
            {/* Suggested Creators Stage */}
            {suggestedUsers.length > 0 && !input.trim() && (
                <div className='flex flex-col gap-8'>
                    <div className="flex items-center justify-between border-b border-stone-200/20 pb-4">
                        <h2 className='text-sm font-bold uppercase tracking-widest text-on-surface-variant'>Suggested Creators</h2>
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start'>
                        {suggestedUsers.map((user) => (
                            <UserCard user={user} key={user._id} />
                        ))}
                    </div>
                </div>
            )}

            {/* Search Result Creators */}
            {users.length > 0 && (
                <div className='flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                    <div className="flex items-center gap-2 border-b border-stone-200/20 pb-4">
                        <h2 className='text-sm font-bold uppercase tracking-widest text-on-surface-variant'>People</h2>
                        <span className="text-xs font-medium text-primary-dim bg-primary/5 px-2 py-0.5 rounded-full">{users.length} results</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start'>
                        {users.map((user) => (
                            <UserCard user={user} key={user._id} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Search Result Gallery Items */}
            {posts.length > 0 && (
                <div className='flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                    <div className="flex items-center gap-2 border-b border-stone-200/20 pb-4">
                        <h2 className='text-sm font-bold uppercase tracking-widest text-on-surface-variant'>Editorial Stories</h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start'>
                        {posts.map((post) => (
                            <PostCard post={post} key={post._id} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty Context */}
            {input.trim() && users.length === 0 && posts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-6 opacity-30">
                    <span className="material-symbols-outlined text-8xl">sentiment_dissatisfied</span>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-headline font-black text-2xl text-on-surface">No results found</h3>
                        <p className="text-sm font-medium">Try searching for different creators or gallery moments.</p>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  )
}

export default Discover

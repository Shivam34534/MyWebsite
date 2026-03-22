import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard.jsx'
import PostCard from '../components/PostCard.jsx'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'

const Discover = () => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  // Initial discovery fetch (Random/Suggested users when search is empty)
  useEffect(() => {
    const fetchInitialDiscover = async () => {
      if (!input.trim()) {
        try {
          const token = await getToken();
          const { data } = await api.post('/api/user/discover', { input: '' }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setSuggestedUsers(data.users.slice(0, 8)); // Grab top 8
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
    }, 400); // 400ms Debounce

    return () => clearTimeout(timer);
  }, [input, getToken]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your
            network </p>
        </div>

        {/* Search */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2
                text-slate-400 w-5 h-5' />
              <input type="text" id="search-people" name="search" placeholder='Search people or posts...'
                className='pl-10 sm:pl-12 py-2 w-full border
                border-gray-300 rounded-md max-sm:text-sm outline-none' 
                onChange={(e) => setInput(e.target.value)} value={input} 
              />

            </div>
          </div>
        </div>
        
        {loading && <Loading />}

        {!loading && (
            <div className='flex flex-col gap-10'>
                {/* Suggested Users Section (When not searching) */}
                {suggestedUsers.length > 0 && !input.trim() && (
                    <div>
                        <h2 className='text-xl font-semibold mb-4 text-slate-800'>Suggested for You</h2>
                        <div className='flex flex-wrap gap-6'>
                            {suggestedUsers.map((user) => (
                                <UserCard user={user} key={user._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Users Section (Search Results) */}
                {users.length > 0 && (
                    <div>
                        <h2 className='text-xl font-semibold mb-4 text-slate-800'>People</h2>
                        <div className='flex flex-wrap gap-6'>
                            {users.map((user) => (
                                <UserCard user={user} key={user._id} />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Posts Section */}
                {posts.length > 0 && (
                    <div>
                        <h2 className='text-xl font-semibold mb-4 text-slate-800'>Posts</h2>
                        <div className='flex flex-wrap gap-6 max-w-[35rem]'>
                            {posts.map((post) => (
                                <PostCard post={post} key={post._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {input.trim() && users.length === 0 && posts.length === 0 && (
                    <p className='text-slate-500 mt-6'>No results found for "{input}"</p>
                )}
            </div>
        )}

      </div>
    </div>
  )
}

export default Discover

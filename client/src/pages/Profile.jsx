import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModal from '../components/ProfileModal'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useUser, useAuth } from '../mockClerk'
import api from '../api/axios'
import { assets } from '../assets/assets'


const Profile = () => {
  const currentUser = useSelector((state) => state.user.value)

  const { getToken } = useAuth()
  const { profileId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async (profileId) => {
    const token = await getToken()

    try {
      const { data } = await api.post(`api/user/profiles`, { profileId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setUser(data.profile)
        setPosts(data.posts)
        setLikedPosts(data.likedPosts || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId)
    } else {
      fetchUser(currentUser._id)
    }
  }, [profileId, currentUser])

  return user ? (
    <div className='lg:ml-64 relative min-h-screen bg-surface p-4 md:p-8 overflow-y-auto no-scrollbar'>
      <div className='max-w-4xl mx-auto flex flex-col gap-8'>

        <div className='bg-surface-container-lowest rounded-[3rem] overflow-hidden border border-stone-200/10 shadow-xl'>

          {/* Cover Section */}
          <div className='h-52 md:h-72 relative group overflow-hidden'>
            <div className='absolute inset-0 bg-stone-900/10 mix-blend-overlay' />
            {user.cover_picture ? (
              <img src={user.cover_picture} alt="" className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300' />
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
          </div>

          <UserProfileInfo 
            user={user} 
            posts={posts} 
            profileId={profileId}
            setShowEdit={setShowEdit} 
            onUpdate={() => fetchUser(profileId || currentUser._id)} 
          />
        </div>

        {/* Tab System */}
        <div className='flex flex-col gap-8'>
          <div className='flex items-center justify-center gap-10 border-b border-stone-200/20'>
            {["posts", "media", "likes"].map((tab) => (
              <button 
                onClick={() => setActiveTab(tab)} 
                key={tab} 
                className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${
                  activeTab === tab 
                  ? "text-primary scale-110" 
                  : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary animate-in fade-in zoom-in-50" />
                )}
              </button>
            ))}
          </div>

          <div className='pb-20'>
            {activeTab === 'posts' && (
              <div className='flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                ) : (
                  <div className='py-20 text-center flex flex-col items-center gap-4 opacity-40'>
                    <span className="material-symbols-outlined text-6xl">photo_library</span>
                    <p className='text-stone-500 font-headline font-bold text-lg'>No stories captured yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 animate-in fade-in zoom-in-95 duration-700'>
                {posts.filter((post) => post.image_urls?.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <div 
                        onClick={() => window.open(image, '_blank')}
                        key={index} 
                        className='relative group overflow-hidden aspect-square cursor-pointer bg-stone-100'
                      >
                        <img src={image} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' alt="" />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                          <span className="material-symbols-outlined text-white text-3xl">open_in_full</span>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700'>
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <div key={post._id} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between border border-stone-200/10 hover:shadow-lg transition-all group">
                        <div className='flex items-center gap-4'>
                            <img
                              src={post.user.profile_picture || assets.sample_profile}
                              onError={(e) => { e.target.src = assets.sample_profile }}
                              alt=""
                              className='w-12 h-12 rounded-full object-cover transition-transform group-hover:scale-105'
                            />
                            <div className='flex flex-col'>
                              <span onClick={() => navigate(`/profile/${post.user._id}`)} className='font-bold text-stone-900 cursor-pointer hover:text-primary transition-colors'>
                                {post.user.username}
                              </span>
                              <span className='text-[10px] uppercase font-bold text-stone-400 tracking-widest'>{post.user.full_name}</span>
                            </div>
                        </div>
                        <button 
                          onClick={() => navigate(`/profile/${post.user._id}`)}
                          className='p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-primary transition-all'
                        >
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-40'>
                    <span className="material-symbols-outlined text-6xl">favorite</span>
                    <p className='text-stone-500 font-headline font-bold text-lg'>Discover what inspires you.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (<Loading />)
}

export default Profile
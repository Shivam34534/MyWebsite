import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import UserProfileInfo from '../components/modals/UserProfileInfo'
import PostCard from '../components/modals/PostCard'
import Loading from '../components/modals/Loading'
import ProfileModal from '../components/modals/ProfileModal'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useUser, useAuth } from '../mockClerk'
import api from '../api/axios'
import { assets } from '../assets/assets'

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value)
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { profileId } = useParams()
  
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUser = async (targetId) => {
    setLoading(true)
    try {
      const token = await getToken()
      const { data } = await api.post('api/user/profiles', { profileId: targetId }, {
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
      console.error('Profile fetch error:', error)
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const target = profileId || currentUser?._id
    if (target) fetchUser(target)
  }, [profileId, currentUser])

  if (loading && !user) return <Loading />

  return user ? (
    <div className='lg:ml-64 relative min-h-screen bg-surface p-4 md:p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar pb-24'>
      <div className='max-w-4xl mx-auto w-full flex flex-col gap-10'>

        {/* Profile Shell */}
        <div className='bg-surface-container-lowest rounded-[3rem] overflow-hidden border border-stone-200/5 shadow-2xl flex flex-col transition-all hover:shadow-stone-200/40'>
          {/* Cover Section */}
          <div className='h-56 md:h-80 relative group overflow-hidden bg-stone-100'>
            <div className='absolute inset-0 bg-stone-900/5 mix-blend-overlay' />
            {user.cover_picture ? (
              <img 
                src={user.cover_picture} 
                alt="Banner" 
                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300' />
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
          </div>

          {/* User Details & Controls */}
          <UserProfileInfo 
            user={user} 
            posts={posts} 
            profileId={profileId}
            setShowEdit={setShowEdit} 
          />
        </div>

        {/* Content Navigation Area */}
        <div className='flex flex-col gap-12'>
          <div className='flex items-center justify-center gap-12 border-b border-stone-200/10'>
            {["posts", "media", "likes"].map((tab) => (
              <button 
                onClick={() => setActiveTab(tab)} 
                key={tab} 
                className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative ${
                  activeTab === tab 
                  ? "text-primary scale-110" 
                  : "text-on-surface-variant/40 hover:text-on-surface-variant"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Render Active View */}
          <section className='animate-in fade-in slide-in-from-bottom-8 duration-700'>
            {activeTab === 'posts' && (
              <div className='flex flex-col items-center gap-14'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} className="w-full max-w-[600px]">
                         <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <div className='py-24 text-center flex flex-col items-center gap-6 opacity-30'>
                    <span className="material-symbols-outlined text-7xl">photo_library</span>
                    <div className='flex flex-col gap-2'>
                        <h3 className='font-headline font-black text-2xl text-on-surface'>No stories captured</h3>
                        <p className='text-sm font-medium'>Gallery moments shared by {user.username} will appear here.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4'>
                {posts.filter((post) => post.image_urls?.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <div 
                        onClick={() => window.open(image, '_blank')}
                        key={index} 
                        className='relative group overflow-hidden aspect-square cursor-pointer rounded-2xl border border-stone-200/5 bg-stone-50 shadow-sm'
                      >
                        <img src={image} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' alt="Gallery Media" />
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
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <div key={post._id} className="bg-surface-container-lowest p-6 rounded-[2rem] flex items-center justify-between border border-stone-200/5 hover:shadow-xl transition-all group shadow-sm">
                        <div className='flex items-center gap-5'>
                            <div className='w-14 h-14 rounded-full story-ring p-[1.5px]'>
                                <div className='w-full h-full rounded-full border-2 border-surface overflow-hidden bg-stone-50'>
                                    <img
                                      src={post.user.profile_picture || assets.sample_profile}
                                      onError={(e) => { e.target.src = assets.sample_profile }}
                                      alt={post.user.full_name}
                                      className='w-full h-full object-cover transition-transform group-hover:scale-105'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col'>
                              <span onClick={() => navigate(`/profile/${post.user._id}`)} className='font-headline font-black text-on-surface cursor-pointer hover:text-primary transition-colors leading-tight'>
                                {post.user.username}
                              </span>
                              <span className='text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest mt-1'>{post.user.full_name}</span>
                            </div>
                        </div>
                        <button 
                          onClick={() => navigate(`/profile/${post.user._id}`)}
                          className='p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-primary transition-all active:scale-90 border border-stone-200/10'
                        >
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full py-24 text-center flex flex-col items-center gap-6 opacity-30'>
                    <span className="material-symbols-outlined text-7xl">favorite</span>
                    <div className='flex flex-col gap-2'>
                        <h3 className='font-headline font-black text-2xl text-on-surface'>Discover Inspiration</h3>
                        <p className='text-sm font-medium'>Gallery posts liked by the creator will reveal here.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} onUpdate={() => fetchUser(profileId || currentUser?._id)} />}
    </div>
  ) : (<Loading />)
}

export default Profile
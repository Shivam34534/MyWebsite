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
    <div className='w-full relative min-h-screen bg-[#F2F2F2] p-4 md:p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar pb-24'>
      <div className='max-w-5xl mx-auto w-full flex flex-col gap-10'>

        {/* Profile Shell */}
        <div className='bg-white neo-border neo-shadow-lg flex flex-col overflow-hidden'>
          {/* Cover Section */}
          <div className='h-48 md:h-72 relative border-b-[4px] border-black bg-stone-200'>
            {user.cover_picture ? (
              <img 
                src={user.cover_picture} 
                alt="Banner" 
                className='w-full h-full object-cover grayscale-[0.3]' 
              />
            ) : (
              <div className='w-full h-full bg-accent' />
            )}
            <div className='absolute top-4 left-4 bg-black text-white px-4 py-1 neo-border text-xs font-black uppercase tracking-widest -rotate-2'>
              SECURED_PROFILE.SYS
            </div>
          </div>

          {/* User Details & Controls */}
          <div className="relative pt-0 px-6 pb-8 md:px-12">
             <UserProfileInfo 
                user={user} 
                posts={posts} 
                profileId={profileId}
                setShowEdit={setShowEdit} 
              />
          </div>
        </div>

        {/* Content Navigation Area */}
        <div className='flex flex-col gap-8'>
          <div className='flex items-center justify-center gap-4 border-b-[4px] border-black pb-0'>
            {["posts", "media", "likes"].map((tab) => (
              <button 
                onClick={() => setActiveTab(tab)} 
                key={tab} 
                className={`pb-4 px-6 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab 
                  ? "text-black" 
                  : "text-black/30 hover:text-black hover:translate-y-[-2px]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[6px] bg-primary border-t-[3px] border-black" />
                )}
              </button>
            ))}
          </div>

          {/* Render Active View */}
          <section className='animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20'>
            {activeTab === 'posts' && (
              <div className='flex flex-col items-center gap-12'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} className="w-full max-w-[640px]">
                         <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <div className='py-20 text-center flex flex-col items-center gap-6 bg-white neo-border neo-shadow w-full max-w-xl mx-auto'>
                    <div className="w-20 h-20 neo-border bg-stone-100 flex items-center justify-center -rotate-6">
                        <span className="material-symbols-outlined text-5xl">folder_off</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-3xl font-black'>EMPTY ARCHIVE</h3>
                        <p className='text-xs font-bold uppercase tracking-widest opacity-60'>No stories have been curated by this user.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {posts.filter((post) => post.image_urls?.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <div 
                        onClick={() => window.open(image, '_blank')}
                        key={index} 
                        className='relative group overflow-hidden aspect-square cursor-pointer neo-border bg-white shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#A3E635] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all'
                      >
                        <img src={image} className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0' alt="Media" />
                        <div className='absolute bottom-2 right-2 bg-black text-white p-2 neo-border opacity-0 group-hover:opacity-100 transition-opacity'>
                           <span className="material-symbols-outlined text-sm">fullscreen</span>
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
                    <div key={post._id} className="bg-white p-6 neo-border neo-shadow flex items-center justify-between group hover:bg-stone-50 transition-all cursor-pointer" onClick={() => navigate(`/profile/${post.user._id}`)}>
                        <div className='flex items-center gap-5'>
                            <div className='w-16 h-16 neo-border bg-black p-0.5 group-hover:rotate-3 transition-transform'>
                                <div className='w-full h-full bg-stone-100 overflow-hidden'>
                                    <img
                                      src={post.user.profile_picture || assets.sample_profile}
                                      onError={(e) => { e.target.src = assets.sample_profile }}
                                      alt={post.user.full_name}
                                      className='w-full h-full object-cover'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col'>
                              <span className='text-lg font-black uppercase text-black leading-none italic'>
                                @{post.user.username}
                              </span>
                              <span className='text-[10px] uppercase font-bold text-black/40 tracking-widest mt-1'>{post.user.full_name}</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 neo-border flex items-center justify-center bg-primary group-hover:bg-accent transition-colors">
                            <span className="material-symbols-outlined">north_east</span>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full py-20 text-center flex flex-col items-center gap-6 bg-white neo-border neo-shadow w-full max-w-xl mx-auto italic'>
                    <div className="w-16 h-16 neo-border bg-pink-400 rotate-12 flex items-center justify-center">
                        <Heart className="w-8 h-8 fill-black" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-3xl font-black'>NO LIKES DETECTED</h3>
                        <p className='text-xs font-bold uppercase tracking-widest opacity-60'>Discovery is waiting. Heart something.</p>
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
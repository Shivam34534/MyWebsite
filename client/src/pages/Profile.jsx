import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UserProfileInfo from '../components/modals/UserProfileInfo'
import PostCard from '../components/modals/PostCard'
import Loading from '../components/modals/Loading'
import ProfileModal from '../components/modals/ProfileModal'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useAuth } from '../mockClerk'
import api from '../api/axios'
import { Image, Heart, Grid, Archive, ExternalLink } from 'lucide-react'

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
        toast.error('PROFILE_RETRIEVAL_FAILED')
      }
    } catch (error) {
      toast.error("NETWORK_FAILURE")
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
    <div className='w-full relative min-h-screen bg-bg p-4 md:p-8 flex flex-col gap-12 overflow-y-auto no-scrollbar pb-24'>
      <div className='max-w-4xl mx-auto w-full flex flex-col gap-12'>

        {/* ⚡ Profile Shell */}
        <div className='neo-box bg-white overflow-hidden flex flex-col'>
          {/* Banner Section */}
          <div className='h-48 md:h-72 relative border-b-4 border-black bg-main overscroll-none'>
            {user.cover_picture ? (
              <img 
                src={user.cover_picture} 
                alt="Banner" 
                className='w-full h-full object-cover grayscale hover:grayscale-0 neo-transition' 
              />
            ) : (
                <div className='w-full h-full flex items-center justify-center opacity-10 rotate-3'>
                    <Archive className="w-32 h-32" />
                </div>
            )}
            <div className="absolute top-4 left-4 neo-box bg-white px-3 py-1 text-[10px] font-black uppercase rotate-[-2deg]">
                PROFILE_PROTOCOLS_V2
            </div>
          </div>

          {/* Identity Block */}
          <UserProfileInfo 
            user={user} 
            posts={posts} 
            profileId={profileId}
            setShowEdit={setShowEdit} 
          />
        </div>

        {/* ⚡ Tab Navigation Area */}
        <div className='flex flex-col gap-12'>
          <div className='flex items-center justify-center gap-4 md:gap-8'>
            {[
                { id: 'posts', label: 'ENTRIES', icon: Archive },
                { id: 'media', label: 'VISUALS', icon: Image },
                { id: 'likes', label: 'REACTIONS', icon: Heart }
            ].map((tab) => (
              <button 
                onClick={() => setActiveTab(tab.id)} 
                key={tab.id} 
                className={`neo-button flex items-center gap-2 px-6 py-2 ${
                  activeTab === tab.id 
                  ? "bg-secondary text-white -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                  : "bg-white hover:bg-main"
                }`}
              >
                <tab.icon className="w-4 h-4" strokeWidth={3} />
                <span className="text-xs font-black uppercase hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ⚡ Context Viewport */}
          <section className='animate-in fade-in slide-in-from-bottom-8 duration-500'>
            {activeTab === 'posts' && (
              <div className='flex flex-col items-center gap-12'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} className="w-full max-w-[640px]">
                         <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <div className='neo-box bg-white p-12 text-center flex flex-col items-center gap-6 border-dashed'>
                    <Archive className="w-16 h-16 text-black/20" />
                    <div>
                        <h3 className='text-2xl font-black uppercase italic italic'>NO_DATA_ENTRIES</h3>
                        <p className='text-xs font-bold text-black/40 uppercase mt-2 tracking-widest'>Node has not transmitted any visual data.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                {posts.filter((post) => post.image_urls?.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <div 
                        onClick={() => window.open(image, '_blank')}
                        key={index} 
                        className='neo-box bg-white aspect-square group cursor-crosshair overflow-hidden'
                      >
                        <img src={image} className='w-full h-full object-cover grayscale group-hover:grayscale-0 neo-transition group-hover:scale-110' alt="Media" />
                        <div className='absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 neo-transition flex items-center justify-center p-4 text-center'>
                           <div className="neo-box bg-white p-2">
                               <ExternalLink className="w-6 h-6" />
                           </div>
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
                    <div key={post._id} className="neo-box bg-white p-6 flex items-center justify-between hover:bg-main neo-transition group cursor-pointer" onClick={() => navigate(`/profile/${post.user._id}`)}>
                        <div className='flex items-center gap-4'>
                            <div className='w-14 h-14 neo-box bg-accent overflow-hidden -rotate-3 group-hover:rotate-0 neo-transition'>
                                <img
                                    src={post.user.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`}
                                    alt={post.user.full_name}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='flex flex-col'>
                              <span className='font-black uppercase italic text-sm group-hover:underline'>@{post.user.username}</span>
                              <span className='text-[10px] font-bold text-black/40 uppercase tracking-widest'>{post.user.full_name}</span>
                            </div>
                        </div>
                        <div className='neo-box bg-black text-white p-2'>
                            <Grid className="w-4 h-4" />
                        </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full neo-box bg-white p-12 text-center flex flex-col items-center gap-6 border-dashed'>
                    <Heart className="w-16 h-16 text-black/20" />
                    <h3 className='text-2xl font-black uppercase italic'>NO_REACTIONS_LOGGED</h3>
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
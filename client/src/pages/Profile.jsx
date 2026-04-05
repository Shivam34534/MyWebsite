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
    <div className='relative h-full overflow-y-scroll no-scrollbar bg-slate-50/50 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>

        <div className='glass-card rounded-[2.5rem] overflow-hidden border border-white/40 shadow-2xl shadow-indigo-100/50'>

          {/* Enhanced Cover Section */}
          <div className='h-48 md:h-64 relative group'>
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-orange-500/20 mix-blend-overlay' />
            {user.cover_picture ? (
              <img src={user.cover_picture} alt="" className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' />
            ) : (
              <div className='w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 animate-pulse' />
            )}
            <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/80 to-transparent' />
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
        <div className='mt-8'>
          <div className='glass-card rounded-2xl p-1.5 flex max-w-sm mx-auto shadow-sm border-white/60'>
            {["posts", "media", "likes"].map((tab) => (
              <button 
                onClick={() => setActiveTab(tab)} 
                key={tab} 
                className={`flex-1 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-y-[-1px]" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className='mt-10'>
            {activeTab === 'posts' && (
              <div className='flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                ) : (
                  <div className='glass-card p-12 rounded-3xl text-center opacity-60'>
                    <p className='text-slate-500 font-medium'>No posts shared yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in zoom-in-95 duration-500'>
                {posts.filter((post) => post.image_urls?.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <Link 
                        target='_blank' 
                        to={image} 
                        key={index} 
                        className='relative group overflow-hidden rounded-2xl aspect-square glass-card border-none'
                      >
                        <img src={image} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt="" />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                          <p className='text-white text-[10px] font-bold uppercase tracking-widest'>
                            {moment(post.createdAt).fromNow()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className='flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <div key={post._id} className="premium-card flex items-center justify-between p-4 w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className='flex items-center gap-4'>
                            <Link to={`/profile/${post.user._id}`}>
                              <img
                                src={post.user.profile_picture || assets.sample_profile}
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt=""
                                className='w-12 h-12 rounded-full border-2 border-indigo-100 object-cover shadow-sm'
                              />
                            </Link>
                            <div className='flex flex-col'>
                              <Link to={`/profile/${post.user._id}`} className='font-bold text-slate-900 hover:text-indigo-600 transition-colors'>
                                {post.user.full_name}
                              </Link>
                              <span className='text-xs text-slate-500 font-medium'>@{post.user.username}</span>
                            </div>
                        </div>
                        <Link to={`/profile/${post.user._id}`} className='px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all'>
                            View Post
                        </Link>
                    </div>
                  ))
                ) : (
                  <div className='glass-card p-12 rounded-3xl text-center opacity-60'>
                    <p className='text-slate-500 font-medium'>No liked posts to show.</p>
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
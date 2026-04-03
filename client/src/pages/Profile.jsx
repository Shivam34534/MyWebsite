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
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>

        <div className='bg-white rounded-2xl shadow overflow-hidden'>

          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200
            via-purple-200 to-orange-200'>
            {user.cover_picture && <img src={user.cover_picture} alt=""
              className='w-full h-full object-cover' />}
          </div>

          <UserProfileInfo user={user} posts={posts} profileId={profileId}
            setShowEdit={setShowEdit} onUpdate={() => fetchUser(profileId || currentUser._id)} />
        </div>

        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts", "media", "likes"].map((tab) => (
              <button onClick={() => setActiveTab(tab)} key={tab} className={`flex-1 px-4 py-2 text-sm font-medium
                rounded-lg transition-colors cursor-pointer ${activeTab === tab ?
                  "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'posts' && (

            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <p className='text-gray-500'>No posts yet.</p>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className='flex flex-wrap mt-6 max-w-6xl gap-1'>
              {
                posts.filter((post) => post.image_urls?.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <Link target='_blank' to={image} key={index} className='relative group '>
                        <img src={image} className='w-63 aspect-video
                        object-cover' alt="" />
                        <p className='absolute bottom-0 right-0 text-xs p-1 px-3
                        backdrop-blur-xl text-white opacity-0 group-hover:opacity-100
                        transition duration-300'>Posted {moment(post.createdAt).
                            fromNow()}</p>
                      </Link>
                    ))}
                  </React.Fragment>
                ))
              }
            </div>
          )}

          {activeTab === 'likes' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => (
                  <div key={post._id} className="flex items-center gap-3 p-3 w-full bg-white rounded-lg shadow-sm border border-gray-100">
                    <Link to={`/profile/${post.user._id}`}>
                      <img
                        src={post.user.profile_picture || assets.sample_profile}
                        onError={(e) => { e.target.src = assets.sample_profile }}
                        alt=""
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    </Link>
                    <div className='flex flex-col'>
                      <Link to={`/profile/${post.user._id}`} className='font-semibold text-gray-900 hover:underline'>
                        {post.user.full_name}
                      </Link>
                      <span className='text-sm text-gray-500'>@{post.user.username}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>No liked posts yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (<Loading />)
}

export default Profile
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/modals/PostCard'
import { MapPin, Link as LinkIcon, Calendar, Edit3, Grid, Heart, Bookmark, Settings } from 'lucide-react'
import moment from 'moment'

const Profile = () => {
  const { profileId } = useParams()
  const loggedInUser = useSelector((state) => state.user.value)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)

  const isOwnProfile = !profileId || profileId === loggedInUser?._id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = profileId || loggedInUser?._id
        if (!id) return
        const { data } = await api.get(`/api/user/profile/${id}`)
        if (data.success) {
          setProfile(data.profile)
          setPosts(data.posts)
        }
      } catch (error) {
        console.error("Failed to fetch profile", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [profileId, loggedInUser])

  if (loading) return (
    <div className="w-full max-w-4xl mx-auto mt-10 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-[2.5rem] mb-20" />
        <div className="space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />
        </div>
    </div>
  )

  if (!profile) return <div>User not found</div>

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header Card */}
      <div className="relative mb-8">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
          <img 
            src={profile.cover_picture || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop'} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 md:px-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-end gap-6 text-center md:text-left">
            <div className="p-1.5 rounded-[2.2rem] bg-white shadow-xl shadow-gray-200/50 border border-gray-50">
              <img 
                src={profile.profile_picture || '/default-avatar.png'} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-[1.8rem] object-cover"
                alt={profile.full_name}
              />
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-black text-gray-900">{profile.full_name}</h1>
              <p className="text-gray-500 font-semibold mb-2">@{profile.username}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location || 'Everywhere'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {moment(profile.createdAt).format('MMM YYYY')}</span>
              </div>
            </div>
          </div>
          
          <div className="pb-2 flex gap-3">
            {isOwnProfile ? (
              <>
                <button className="button-secondary px-5 py-2.5 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
                <button className="button-secondary p-2.5">
                  <Settings className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button className="button-primary px-8 py-2.5">Follow</button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="glass-card bg-white/60 mb-8 flex items-center justify-around py-6 text-center">
        {[
          { label: 'Posts', value: posts.length },
          { label: 'Followers', value: profile.followers?.length || 0 },
          { label: 'Following', value: profile.following?.length || 0 },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-xl font-black text-gray-900">{stat.value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="px-6 mb-10">
        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
          {profile.bio || "Crafting digital experiences and chasing high-fidelity vibes."}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 mb-8 flex items-center gap-8 px-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'posts', label: 'Posts', icon: Grid },
          { id: 'liked', label: 'Liked', icon: Heart },
          { id: 'saved', label: 'Saved', icon: Bookmark },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 border-b-2 transition-all font-bold text-sm uppercase tracking-widest ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-2">
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center py-20 text-gray-400 font-medium">No posts yet.</div>
            )}
          </div>
        )}
        {activeTab !== 'posts' && (
          <div className="text-center py-20 text-gray-400 font-medium uppercase tracking-widest text-xs">This section is being curated...</div>
        )}
      </div>
    </div>
  )
}

export default Profile
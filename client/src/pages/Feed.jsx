import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'

const Feed = () => {


  const [feeds, setfeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [sponsoredImg, setSponsoredImg] = useState(assets.sponsored_img)
  const [sponsoredTitle, setSponsoredTitle] = useState("Email marketing")
  const [sponsoredDesc, setSponsoredDesc] = useState("Supercharge your marketing with a powerful, easy-to-use platform built for results.")
  const { getToken } = useAuth()


  const fetchFeeds = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/post/feed', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setfeeds(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching feeds:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchFeeds()
  }, [])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex
    items-start justify-center xl:gap-8'>
      {/* Stories and post list */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))

          }
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='max-xl:hidden stickly top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex
        flex-col gap-2 shadow' >
          <h1 className='text-slate-800 font-semibold'>Sponsored</h1>
          <div className='relative group cursor-pointer' onClick={() => document.getElementById('sponsored-upload').click()}>
            <img src={sponsoredImg} className='w-75 h-50 rounded-md object-cover transition-opacity hover:opacity-90' alt="" />
            <div className='absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center rounded-md'>
              <p className='text-white font-medium'>Change Image</p>
            </div>
          </div>
          <input
            type="file"
            id="sponsored-upload"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSponsoredImg(URL.createObjectURL(e.target.files[0]))
              }
            }}
          />
          <input
            type="text"
            value={sponsoredTitle}
            onChange={(e) => setSponsoredTitle(e.target.value)}
            className='text-indigo-950 font-semibold bg-transparent outline-none border-b border-transparent hover:border-gray-200 transition-colors w-full'
          />
          <textarea
            value={sponsoredDesc}
            onChange={(e) => setSponsoredDesc(e.target.value)}
            className='text-slate-700 font-medium bg-transparent outline-none border-b border-transparent hover:border-gray-200 transition-colors w-full resize-none overflow-hidden'
            rows={2}
          />
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}

export default Feed

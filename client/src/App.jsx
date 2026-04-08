import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useUser, useAuth } from './mockClerk'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'

// ⚡ Dynamic Imports (Code Splitting) -> This makes the app load MUCH faster on phones!
const Login = lazy(() => import('./pages/Login'))
const Feed = lazy(() => import('./pages/Feed'))
const Messages = lazy(() => import('./pages/Messages'))
const ChatBox = lazy(() => import('./pages/ChatBox'))
const Connections = lazy(() => import('./pages/Connections'))
const Discover = lazy(() => import('./pages/Discover'))
const Profile = lazy(() => import('./pages/Profile'))
const CreatePost = lazy(() => import('./pages/CreatePost'))
const Layout = lazy(() => import('./pages/Layout'))


const App = () => {
  const { user } = useUser()
  const { getToken, signOut } = useAuth()

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()
        const action = await dispatch(fetchUser(token))
        
        // 🚨 Security: If token is expired (401) or user not found, clear state and redirect to login
        if (fetchUser.rejected.match(action) || (fetchUser.fulfilled.match(action) && !action.payload)) {
          signOut();
        }
      }
    }
    fetchData()

  }, [user, getToken, dispatch, signOut])
  
  // A sleek loading spinner to display while chunks are downloading
  const LoadingScreen = () => (
    <div className='fixed inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-xl z-[200]'>
        <div className='flex flex-col items-center gap-6 animate-in fade-in duration-1000'>
            <div className='relative flex flex-col items-center'>
                <h1 className='text-4xl font-black font-headline tracking-tighter bg-gradient-to-tr from-[#8037b1] via-[#E1306C] to-[#FF8C00] bg-clip-text text-transparent animate-pulse'>
                    Gallery
                </h1>
                <div className='w-16 h-0.5 bg-stone-200/20 rounded-full mt-2 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-primary/40 w-1/2 animate-loading-bar'></div>
                </div>
            </div>
            <p className='text-[10px] font-bold uppercase tracking-[0.5em] text-on-surface-variant/30 animate-pulse'>Gathering your moments</p>
        </div>
    </div>
  )

  return (
    <>
      <Toaster />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path='/' element={!user ? <Login /> : <Layout />}>
            <Route index element={<Feed />} />
            <Route path='messages' element={<Messages />} />
            <Route path='messages/:id' element={<ChatBox />} />
            <Route path='discover' element={<Discover />} />
            <Route path='search' element={<Discover />} />
            <Route path='notifications' element={<Feed />} />
            <Route path='reels' element={<Feed />} />
            <Route path='connections' element={<Connections />} />
            <Route path='profile' element={<Profile />} />
            <Route path='profile/:profileId' element={<Profile />} />
            <Route path='create-post' element={<CreatePost />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App

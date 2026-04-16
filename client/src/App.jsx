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
    <div className='fixed inset-0 flex items-center justify-center bg-yellow-300 z-[200] border-[10px] border-black'>
        <div className='flex flex-col items-center gap-6'>
            <div className='neo-card bg-white rotate-2'>
                <h1 className='text-6xl font-black font-headline tracking-tighter text-black'>
                    AURA
                </h1>
            </div>
            <p className='text-sm font-black uppercase tracking-widest text-black bg-lime-400 px-4 py-1 neo-border neo-shadow -rotate-2'>
                Loading the vibe...
            </p>
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

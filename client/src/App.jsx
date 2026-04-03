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
const Admin = lazy(() => import('./pages/Admin'))


const App = () => {
  const { user } = useUser()
  const { getToken, signOut } = useAuth()

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()
        const action = await dispatch(fetchUser(token))
        // If server returns null (user not found), force logout to clear stale client state
        if (fetchUser.fulfilled.match(action) && !action.payload) {
          signOut();
        }
      }
    }
    fetchData()

  }, [user, getToken, dispatch])
  
  // A sleek loading spinner to display while chunks are downloading
  const LoadingScreen = () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50/50 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 border-l-transparent"></div>
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
            <Route path='connections' element={<Connections />} />
            <Route path='discover' element={<Discover />} />
            <Route path='profile' element={<Profile />} />
            <Route path='profile/:profileId' element={<Profile />} />
            <Route path='create-post' element={<CreatePost />} />
            <Route path='admin' element={<Admin />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App

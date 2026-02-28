import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import { useUser, useAuth } from './mockClerk'
import Layout from './pages/Layout'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'


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
  return (
    <>
      <Toaster />
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
        </Route>

      </Routes>
    </>
  )
}

export default App

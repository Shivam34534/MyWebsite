import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Star, Lock, Mail, ArrowRight, User, PenBox, MapPin } from 'lucide-react'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'

const Login = () => {
  console.log("Login Component Rendered - Version 2.0");
  const { openSignIn, openSignUp } = useClerk()
  const [isSignup, setIsSignup] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState('')

  const [profilePreview, setProfilePreview] = useState(null)
  const [profileBase64, setProfileBase64] = useState('')
  const [profileFile, setProfileFile] = useState(null)

  const [coverPreview, setCoverPreview] = useState(null)
  const [coverBase64, setCoverBase64] = useState('')
  const [coverFile, setCoverFile] = useState(null)

  const [loading, setLoading] = useState(false)
  const { resetPassword } = useClerk()

  const handleProfileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileFile(file)
      setProfilePreview(URL.createObjectURL(file))
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileBase64(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverBase64(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isForgotPassword) {
        const success = resetPassword({ email, newPassword })
        if (success) {
          toast.success("Password reset successfully! Please sign in.")
          setIsForgotPassword(false)
        } else {
          toast.error("User not found with this email.")
        }
      } else if (isSignup) {
        const res = await openSignUp({
          email,
          fullName,
          username,
          location,
          password,
          profile_picture: profileBase64,
          profileFile: profileFile,
          cover_picture: coverBase64,
          coverFile: coverFile
        })
        if (res.success) {
          toast.success("Account created successfully!")
        } else {
          toast.error(res.message || "Failed to create account")
        }
      } else {
        const res = await openSignIn({ email, password })
        if (res.success) {
          toast.success("Successfully logged in!")
        } else {
          toast.error(res.message || "Account not found. Please sign up first!")
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast.error("An error occurred during authentication.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row relative bg-white'>
      {/* Background Image */}
      <img
        src={assets.bgImage}
        alt="Background"
        className='absolute top-0 left-0 z-0 w-full h-full object-cover opacity-10 md:opacity-100'
      />

      {/* Left Section - Hero (Hidden on Mobile) */}
      <div className='hidden md:flex flex-1 flex-col items-start justify-between p-6 md:p-12 lg:pl-32 z-10'>
        <img src={assets.logo} alt="Logo" className='h-12 object-contain' />

        <div className='mt-20 md:mt-0'>
          <h1 className='text-7xl font-bold leading-tight'>
            <span className='bg-gradient-to-r from-indigo-950 to-indigo-700 bg-clip-text text-transparent'>
              Aura evolution
            </span>
          </h1>
          <p className='text-4xl text-indigo-900 font-light mt-2 max-w-lg'>
            Illuminate your digital presence on Aura
          </p>

          <div className='flex items-center gap-4 mt-8'>
            <div className='flex -space-x-3'>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className='w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden'>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} className='w-full h-full object-cover' alt="" />
                </div>
              ))}
            </div>
            <div>
              <div className='flex gap-0.5'>
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className='size-4 fill-amber-400 text-amber-400' />
                ))}
              </div>
              <p className='text-sm text-gray-600 font-medium'>Trusted by 12k+ developers</p>
            </div>
          </div>
        </div>
        <div></div>
      </div>

      {/* Right Section - Login Form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-12 z-10'>
        <div className='w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50'>

          {/* Mobile Logo */}
          <div className='md:hidden flex justify-center mb-6'>
            <img src={assets.logo} alt="Logo" className='h-8 object-contain' />
          </div>

          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-800'>
              {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Welcome Back')}
            </h2>
            <p className='text-gray-500 text-sm mt-1'>
              {isForgotPassword ? 'Enter your email and new password' : (isSignup ? 'Join our community today' : 'Please sign in to your account')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {isSignup && (
              <div className="flex flex-col gap-4 mb-4">
                {/* Cover Photo */}
                <div className='relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
                  {coverPreview ? (
                    <img src={coverPreview} className='w-full h-full object-cover' alt="Cover" />
                  ) : (
                    <div className='flex items-center justify-center h-full text-gray-400 text-xs'>Cover Photo</div>
                  )}
                  <label htmlFor="coverPhoto" className='absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded-full cursor-pointer hover:bg-black/70 transition'>
                    <PenBox className='w-3 h-3' />
                    <input
                      type="file"
                      id="coverPhoto"
                      hidden
                      accept="image/*"
                      onChange={handleCoverChange}
                    />
                  </label>
                </div>

                {/* Profile Photo */}
                <div className='flex flex-col items-center -mt-12'>
                  <div className='relative group'>
                    <div className='w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 flex items-center justify-center shadow-md'>
                      {profilePreview ? (
                        <img src={profilePreview} className='w-full h-full object-cover' alt="Preview" />
                      ) : (
                        <User className='w-12 h-12 text-gray-400' />
                      )}
                    </div>
                    <label htmlFor="profilePhoto" className='absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg'>
                      <PenBox className='w-4 h-4' />
                      <input
                        type="file"
                        id="profilePhoto"
                        hidden
                        accept="image/*"
                        onChange={handleProfileChange}
                      />
                    </label>
                  </div>
                  <p className='text-xs text-gray-500 mt-2 font-medium'>Upload Profile</p>
                </div>
              </div>
            )}

            {isSignup && (
              <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
                <label htmlFor="fullName" className='block text-sm font-medium text-gray-700 mb-1.5'>Full Name</label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    required={isSignup}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                  />
                </div>
              </div>
            )}

            {isSignup && (
              <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
                <label htmlFor="username" className='block text-sm font-medium text-gray-700 mb-1.5'>Username</label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                  />
                </div>
              </div>
            )}

            {isSignup && (
              <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
                <label htmlFor="location" className='block text-sm font-medium text-gray-700 mb-1.5'>Location</label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location"
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1.5'>Email Address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                  />
                </div>
                {!isSignup && (
                  <div className='flex justify-end mt-1'>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className='text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-transparent border-none cursor-pointer'
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {isForgotPassword && (
              <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
                <label htmlFor="newPassword" className='block text-sm font-medium text-gray-700 mb-1.5'>New Password</label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type="password"
                    id="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className='w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {loading ? (
                <span className='animate-pulse'>Processing...</span>
              ) : (
                <>
                  {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Sign In')}
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </form>

          <div className='mt-8 pt-6 border-t border-gray-100 text-center'>
            <p className='text-sm text-gray-500'>
              {isForgotPassword ? (
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className='font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer'
                >
                  Back to sign in
                </button>
              ) : (
                <>
                  {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className='font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer'
                  >
                    {isSignup ? 'Sign in' : 'Create account'}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
import React, { useState } from 'react'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'
import { Eye, EyeOff, AtSign, User, Mail, Lock, MapPin, Sparkles } from 'lucide-react'

const Login = () => {
  const { openSignIn, openSignUp } = useClerk()
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    location: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignup) {
        const res = await openSignUp(formData)
        if (res.success) toast.success("Welcome to Aura!")
        else toast.error(res.message || "Signup failed")
      } else {
        const res = await openSignIn({ email: formData.email, password: formData.password })
        if (res.success) toast.success("Welcome back!")
        else toast.error(res.message || "Invalid credentials")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        {/* Left: Branding & Inspiration */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-primary to-primary-dark p-12 flex-col justify-between relative overflow-hidden">
          {/* Abstract pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Connect with<br />the next vibe.
            </h1>
            <p className="text-primary-foreground/80 text-lg font-medium leading-relaxed max-w-xs">
              Aura is where modern creators share, connect, and inspire. Join the movement.
            </p>
          </div>

          <div className="relative z-10">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
              <p className="text-white/90 italic font-medium">"Finally, a social space that feels as good as it looks."</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <span className="text-white text-sm font-bold">@alex_studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Area */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 font-medium">
              {isSignup ? 'Start your journey with Aura today.' : 'Please enter your details to continue.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      name="fullName" placeholder="John Doe" 
                      className="input-field pl-12" required value={formData.fullName} onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      name="username" placeholder="johndoe" 
                      className="input-field pl-12" required value={formData.username} onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" name="email" placeholder="you@example.com" 
                  className="input-field pl-12" required value={formData.email} onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" 
                  className="input-field pl-12" required value={formData.password} onChange={handleChange} 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Location (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    name="location" placeholder="New York, NY" 
                    className="input-field pl-12" value={formData.location} onChange={handleChange} 
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full button-primary py-4 mt-4"
            >
              {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isSignup ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
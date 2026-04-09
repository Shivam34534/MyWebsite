import React, { useState } from 'react'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'
import { Eye, EyeOff, MapPin, AtSign, ArrowRight, Github, Twitter } from 'lucide-react'

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
        const res = await openSignUp({
          email: formData.email,
          fullName: formData.fullName,
          username: formData.username || formData.email.split('@')[0], 
          location: formData.location || "Neo City",
          password: formData.password,
        })
        if (res.success) {
          toast.success("WELCOME TO THE VOID")
        } else {
          toast.error(res.message || "ENTRY DENIED")
        }
      } else {
        const res = await openSignIn({ 
            email: formData.email, 
            password: formData.password 
        })
        if (res.success) {
          toast.success("ACCESS GRANTED")
        } else {
          toast.error(res.message || "INVALID KEY")
        }
      }
    } catch (error) {
      toast.error("SYSTEM ERROR")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row">
      
      {/* ⚡ LEFT SECTION: LOUD BRANDING */}
      <div className="lg:w-1/2 bg-main border-r-[10px] border-black flex flex-col justify-between p-8 lg:p-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary border-b-[8px] border-l-[8px] border-black -rotate-12 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent border-t-[8px] border-r-[8px] border-black rotate-45 -translate-x-10 translate-y-10" />
        
        <div className="z-10">
          <div className="neo-box bg-black inline-block px-4 py-2 rotate-2 mb-8">
            <h2 className="text-white font-black italic tracking-widest text-xl">VERSION 2.0</h2>
          </div>
          <h1 className="text-8xl lg:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase italic select-none">
            GAL<br />LERY
          </h1>
          <p className="mt-8 text-2xl font-bold max-w-md uppercase tracking-tight">
            THE MOST BRUTAL SOCIAL EXPERIENCE ON THE WEB. RAW. LOUD. UNFILTERED.
          </p>
        </div>

        <div className="z-10 flex gap-4 mt-12 lg:mt-0">
          <div className="neo-box bg-white p-4 -rotate-3 hover:rotate-0 neo-transition cursor-pointer">
            <Github className="w-8 h-8" />
          </div>
          <div className="neo-box bg-accent p-4 rotate-6 hover:rotate-0 neo-transition cursor-pointer">
            <Twitter className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* ⚡ RIGHT SECTION: BOLD FORM */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-xl">
          
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-4 bg-secondary border-2 border-black" />
               <span className="font-black uppercase tracking-widest text-sm">Authentication Protocol</span>
            </div>
            <h2 className="text-6xl font-black uppercase tracking-tighter">
                {isSignup ? 'CREATE IDENTITY' : 'RESTORE ACCESS'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">Full Name</label>
                  <input 
                    name="fullName" placeholder="JOHN DOE" type="text" required 
                    className="neo-input" value={formData.fullName} onChange={handleChange} 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">Alias</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input 
                      name="username" placeholder="NEO_USER" type="text" required 
                      className="neo-input pl-12" value={formData.username} onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-black uppercase text-sm">Digital Mail</label>
              <input 
                name="email" placeholder="YOU@EXAMPLE.COM" type="email" required 
                className="neo-input" value={formData.email} onChange={handleChange} 
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="font-black uppercase text-sm">Security Key</label>
                {!isSignup && <span className="font-bold text-xs underline cursor-pointer">LOST KEY?</span>}
              </div>
              <div className="relative">
                <input 
                  name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} required 
                  className="neo-input w-full" value={formData.password} onChange={handleChange} 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignup && (
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">Home Base</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input 
                      name="location" placeholder="TOKYO, NEO DISTRICT" type="text" required 
                      className="neo-input pl-12 w-full" value={formData.location} onChange={handleChange} 
                    />
                  </div>
                </div>
            )}

            <div className="pt-4">
              <button 
                disabled={loading}
                type="submit"
                className="neo-button-primary w-full py-6 text-2xl group"
              >
                {loading ? 'PROCESSING...' : isSignup ? 'INITIALIZE IDENTITY' : 'EXECUTE LOGIN'}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 neo-transition" />
              </button>
            </div>
          </form>

          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="mt-8 w-full neo-button-accent py-4 font-black"
          >
            {isSignup ? 'ALREADY HAVE AN IDENTITY? LOGIN' : 'NEW HERE? CREATE IDENTITY'}
          </button>

          <div className="mt-12 flex flex-wrap gap-8 justify-center opacity-50 font-black uppercase text-[10px] tracking-widest">
            <span>© 2026 GALLERY_SYSTEM</span>
            <span>PRIVACY_PROTOCOL</span>
            <span>TERMS_OF_SERVICE</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
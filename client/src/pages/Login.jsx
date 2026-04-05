import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'

const Login = () => {
  const { openSignIn, openSignUp } = useClerk()
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    location: '',
    profileFile: null,
    coverFile: null,
    profilePreview: null,
    coverPreview: null
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      const file = files[0]
      const preview = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        [name]: file,
        [`${name.replace('File', '')}Preview`]: preview
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignup) {
        const res = await openSignUp({
          email: formData.email,
          fullName: formData.fullName,
          username: formData.username,
          location: formData.location,
          password: formData.password,
          profileFile: formData.profileFile,
          coverFile: formData.coverFile
        })
        if (res.success) {
          toast.success("Welcome to the Gallery!")
        } else {
          toast.error(res.message || "Failed to curate account")
        }
      } else {
        const res = await openSignIn({ 
            email: formData.email, 
            password: formData.password 
        })
        if (res.success) {
          toast.success("Access granted")
        } else {
          toast.error(res.message || "Invalid credentials")
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast.error("An authentication error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-stone-950 flex flex-col lg:flex-row font-sans selection:bg-primary/20 overflow-hidden'>
      
      {/* Visual Identity Layer - Left Side */}
      <div className='hidden lg:flex lg:w-[45%] p-16 flex-col justify-between relative overflow-hidden'>
        {/* Cinematic Backdrop */}
        <div className='absolute inset-0 opacity-40 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-1000 scale-105'>
             <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" className='w-full h-full object-cover' alt="Gallery Aesthetic" />
        </div>
        <div className='absolute inset-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950 opacity-60' />

        <div className='z-10 flex flex-col gap-8'>
             <div className="flex flex-col">
                <h1 className='text-7xl font-black font-headline tracking-tighter text-white leading-[0.85] uppercase'>
                    Gallery<br/><span className='text-primary drop-shadow-[0_0_30px_rgba(128,55,177,0.3)]'>Curator</span>
                </h1>
                <p className='text-white/30 text-[10px] font-bold uppercase tracking-[0.6em] mt-6 ml-1'>Global Creative Registry — v2.0</p>
             </div>
        </div>

        <div className='z-10 flex flex-col gap-6 max-w-sm'>
            <div className='h-px w-12 bg-primary/40' />
            <p className='text-white/60 text-lg font-medium leading-relaxed tracking-tight'>
                A curated ecosystem where visual storytelling meets high-fidelity digital interaction.
            </p>
            <div className='flex items-center gap-4 mt-2'>
                <div className='flex -space-x-3'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='w-10 h-10 rounded-full border-2 border-stone-800 bg-stone-900 overflow-hidden'>
                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} className='w-full h-full object-cover' alt="" />
                        </div>
                    ))}
                </div>
                <span className='text-[10px] font-bold text-white/40 uppercase tracking-widest'>Join 4k+ Curators</span>
            </div>
        </div>
      </div>

      {/* Authentication Stage - Right Side */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-container-low'>
        <div className='w-full max-w-md bg-white p-10 sm:p-12 rounded-[3.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-stone-200/20 animate-in fade-in zoom-in-95 duration-1000 relative overflow-hidden'>
          
          {/* Brand Mark (Mobile Only) */}
          <div className='lg:hidden flex flex-col items-center mb-10'>
              <h2 className='text-3xl font-black font-headline text-primary tracking-tighter uppercase'>Gallery</h2>
              <div className='h-0.5 w-8 bg-primary/20 mt-2' />
          </div>

          <div className='text-center mb-12 flex flex-col gap-2'>
            <h2 className='text-4xl font-black font-headline text-on-surface tracking-tighter uppercase'>
                {isSignup ? 'New Account' : 'Welcome Back'}
            </h2>
            <p className='text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-[0.3em]'>
                {isSignup ? 'Register your creative studio' : 'Resume your curation process'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            {isSignup && (
              <div className="flex flex-col gap-8 mb-4 animate-in slide-in-from-top-4 duration-500">
                {/* Media Uploads */}
                <div className="grid grid-cols-1 gap-4">
                    <label className='relative group h-32 rounded-3xl overflow-hidden bg-stone-50 border border-stone-200/10 cursor-pointer shadow-inner'>
                        <img 
                            src={formData.coverPreview || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                            className={`w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 ${!formData.coverPreview && 'opacity-20 grayscale'}`}
                            alt="" 
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                             <span className="text-[8px] text-white font-bold uppercase tracking-widest mt-1">Banner</span>
                        </div>
                        <input type="file" name="coverFile" hidden accept="image/*" onChange={handleChange} />
                    </label>

                    <div className="flex items-center gap-6 -mt-10 px-4">
                        <label className='relative group w-20 h-20 rounded-full border-4 border-white shadow-2xl bg-white cursor-pointer overflow-hidden'>
                            <img 
                                src={formData.profilePreview || assets.sample_profile} 
                                className='w-full h-full object-cover' 
                                alt="" 
                            />
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="material-symbols-outlined text-white text-xl">edit</span>
                            </div>
                            <input type="file" name="profileFile" hidden accept="image/*" onChange={handleChange} />
                        </label>
                        <div className="mt-6">
                            <h4 className="text-xs font-headline font-black text-on-surface uppercase tracking-tight">Profile Canvas</h4>
                            <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-0.5">Upload your mark</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="FULL NAME"
                      value={formData.fullName}
                      onChange={handleChange}
                      className='w-full p-4 bg-stone-50 border border-stone-200/10 rounded-2xl text-[11px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-stone-300'
                    />
                    <input
                      type="text"
                      name="username"
                      required
                      placeholder="ALIAS"
                      value={formData.username}
                      onChange={handleChange}
                      className='w-full p-4 bg-stone-50 border border-stone-200/10 rounded-2xl text-[11px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-stone-300'
                    />
                </div>
                <input
                    type="text"
                    name="location"
                    placeholder="STUDIO LOCATION"
                    value={formData.location}
                    onChange={handleChange}
                    className='w-full p-4 bg-stone-50 border border-stone-200/10 rounded-2xl text-[11px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-stone-300'
                />
              </div>
            )}

            <div className="flex flex-col gap-4">
                <div className='relative'>
                    <input
                        type="text"
                        name="email"
                        required
                        placeholder="IDENTIFIER (EMAIL/USER)"
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full p-5 bg-stone-50 border border-stone-200/10 rounded-[1.5rem] text-[11px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-stone-300 pl-14'
                    />
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 text-[22px]">alternate_email</span>
                </div>

                <div className='relative'>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="ACCESS KEY"
                        value={formData.password}
                        onChange={handleChange}
                        className='w-full p-5 bg-stone-50 border border-stone-200/10 rounded-[1.5rem] text-[11px] font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-stone-300 pl-14 pr-14'
                    />
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 text-[22px]">lock</span>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-primary transition-colors h-full flex items-center"
                    >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className='w-full p-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-primary/30 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 group overflow-hidden relative'
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">{loading ? 'Processing Agent...' : isSignup ? 'Curate Account' : 'Request Access'}</span>
              {!loading && <span className="material-symbols-outlined relative z-10 text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <div className='mt-12 text-center'>
            <button
                onClick={() => setIsSignup(!isSignup)}
                className='text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] hover:text-primary transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center gap-3 w-full group'
            >
                <div className='h-px flex-1 bg-stone-100 group-hover:bg-primary/10 transition-colors' />
                <span>{isSignup ? 'Return To Registry' : 'Establish Studio'}</span>
                <div className='h-px flex-1 bg-stone-100 group-hover:bg-primary/10 transition-colors' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
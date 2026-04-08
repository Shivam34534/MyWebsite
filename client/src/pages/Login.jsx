import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'
import { X, Eye, EyeOff, Camera, MapPin, AtSign } from 'lucide-react'

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
          location: formData.location || "Gallery Resident",
          password: formData.password,
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
    <div className="bg-white font-body text-on-surface antialiased min-h-screen selection:bg-primary/20">
      
      <style>{`
        .signature-gradient {
            background: linear-gradient(135deg, #8037b1 0%, #b6004f 50%, #ffb147 100%);
        }
        .editorial-input {
            background-color: #f4f2f1;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .editorial-input:focus {
            background-color: #ffffff;
            box-shadow: 0 0 0 2px rgba(128, 55, 177, 0.1);
        }
      `}</style>

      {/* 🖼️ FULL PAGE SPLIT LAYOUT */}
      <main className="flex flex-col lg:flex-row min-h-screen w-full">
            
            {/* Left Section: Cinematic Visual Stage */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-[#b9bcad]">
                <img 
                    alt="Gallery Editorial" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-105" 
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                
                {/* Brand Overlay */}
                <div className='absolute top-12 left-12 z-20'>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 signature-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/20">
                            <Camera className="w-5 h-5" />
                        </div>
                        <span className="font-headline text-3xl font-black italic tracking-tighter text-white drop-shadow-sm">Gallery</span>
                    </div>
                </div>

                {/* Editorial Quote Card (Full Page Style) */}
                <div className="absolute bottom-16 left-16 p-10 bg-white/90 backdrop-blur-3xl rounded-[2.5rem] max-w-md shadow-[0_32px_128px_rgba(0,0,0,0.1)] border border-white/40 animate-in slide-in-from-bottom-12 duration-1000">
                    <span className="font-headline font-black text-[11px] tracking-[0.5em] text-[#8037b1] uppercase mb-4 block">Editorial Volume 01</span>
                    <p className="font-headline text-2xl font-bold leading-tight text-on-surface mb-6">"The essence of light is the frame of the moment."</p>
                    <div className='flex items-center gap-4 opacity-40'>
                        <div className='w-8 h-[1px] bg-on-surface' />
                        <span className='text-[10px] font-black uppercase tracking-widest'>Museum of Digital Curacy</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Focused Form Canvas */}
            <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto no-scrollbar">
                
                {/* Mobile Identity */}
                <div className="lg:hidden mb-12 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 signature-gradient rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-headline text-3xl font-black italic tracking-tighter text-on-surface">Gallery</span>
                </div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="mb-12">
                        <h1 className="font-headline text-5xl font-black tracking-tighter mb-4 text-on-surface">
                            {isSignup ? 'Begin Curation' : 'Resume Entry'}
                        </h1>
                        <p className="text-stone-400 font-medium text-base">
                            {isSignup ? "Establish your presence in the world's most curated gallery." : "Return to your personal archive of visual storytelling."}
                        </p>
                    </div>

                    {/* Social Logic */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <button className="flex items-center justify-center gap-3 py-4 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-all font-bold text-xs uppercase tracking-widest text-stone-600">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-60" alt="" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-all font-bold text-xs uppercase tracking-widest text-stone-600">
                            <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                            Apple
                        </button>
                    </div>

                    <div className="relative mb-10 flex items-center">
                        <div className="flex-grow border-t border-stone-100"></div>
                        <span className="px-5 text-[10px] font-black text-stone-200 uppercase tracking-[0.5em]">or registry email</span>
                        <div className="flex-grow border-t border-stone-100"></div>
                    </div>

                    {/* Registration/Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSignup && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-4 duration-500'>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1" htmlFor="fullName">Full Name</label>
                                    <input 
                                        className="w-full editorial-input border-none rounded-2xl px-6 py-4 outline-none font-medium text-sm text-stone-600" 
                                        id="fullName" name="fullName" placeholder="Evelyn Thorne" type="text" required value={formData.fullName} onChange={handleChange} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1" htmlFor="username">Alias</label>
                                    <div className="relative">
                                        <AtSign className='absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300' />
                                        <input 
                                            className="w-full editorial-input border-none rounded-2xl px-6 py-4 pl-12 outline-none font-medium text-sm text-stone-600" 
                                            id="username" name="username" placeholder="curator01" type="text" required value={formData.username} onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1" htmlFor="location">Studio Location</label>
                                    <div className="relative">
                                        <MapPin className='absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300' />
                                        <input 
                                            className="w-full editorial-input border-none rounded-2xl px-6 py-4 pl-12 outline-none font-medium text-sm text-stone-600" 
                                            id="location" name="location" placeholder="Paris, Digital Art District" type="text" required value={formData.location} onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1" htmlFor="email">Email Identifier</label>
                            <input 
                                className="w-full editorial-input border-none rounded-2xl px-6 py-4 outline-none font-medium text-sm text-stone-600" 
                                id="email" name="email" placeholder="evelyn@gallery.art" type="email" required value={formData.email} onChange={handleChange} 
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400" htmlFor="password">Access Key</label>
                                {!isSignup && <a className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-60" href="#">Forgot?</a>}
                            </div>
                            <div className="relative">
                                <input 
                                    className="w-full editorial-input border-none rounded-2xl px-6 py-4 outline-none font-medium text-sm text-stone-600" 
                                    id="password" name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} 
                                />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400" type="button">
                                   <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="pt-6">
                            <button 
                                disabled={loading}
                                className="w-full signature-gradient text-white font-headline font-black py-5 rounded-3xl shadow-[0_20px_40px_-10px_rgba(128,55,177,0.4)] hover:shadow-[0_24px_48px_-10px_rgba(128,55,177,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all text-xs uppercase tracking-[0.2em]" 
                                type="submit"
                            >
                                {loading ? 'Processing Registry...' : isSignup ? 'Confirm Entry' : 'Request Registry Access'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-12 text-center text-sm font-medium text-stone-400">
                        {isSignup ? 'Previously established?' : "Haven't curated yet?"}
                        <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-black ml-2 hover:underline underline-offset-8 transition-all px-2 uppercase tracking-widest text-[11px]">
                            {isSignup ? 'Login instead' : 'Join the Gallery'}
                        </button>
                    </p>

                    <footer className="mt-16 flex items-center justify-center gap-10 text-[10px] font-black text-stone-200 tracking-[0.3em] uppercase">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Archives</a>
                    </footer>
                </div>
            </div>
      </main>
    </div>
  )
}

export default Login
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'
import { X, Eye, EyeOff, LayoutPanelTop, GalleryHorizontalEnd, Camera } from 'lucide-react'

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
          username: formData.fullName.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000),
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
    <div className="bg-[#f0f0f0] font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary/20">
      
      <style>{`
        .signature-gradient {
            background: linear-gradient(135deg, #8037b1 0%, #b6004f 50%, #ffb147 100%);
        }
        .ghost-border {
            border: 1px solid rgba(175, 172, 172, 0.2);
        }
      `}</style>

      {/* 📝 SIGN UP VIEW */}
      {isSignup ? (
        <main className="relative w-full max-w-5xl bg-white rounded-[1rem] overflow-hidden flex flex-col md:flex-row shadow-[0_32px_64px_rgba(0,0,0,0.06)] min-h-[640px] animate-in fade-in zoom-in-95 duration-500">
            {/* Close toggle */}
            <button onClick={() => setIsSignup(false)} className="absolute top-5 right-5 z-50 p-1.5 rounded-full hover:bg-stone-50 transition-all text-stone-400">
                <X className="w-5 h-5" />
            </button>

            {/* Left Column: Editorial Image */}
            <div className="relative w-full md:w-[50%] min-h-[300px] md:min-h-full overflow-hidden bg-[#b9bcad]">
                <img 
                    alt="Abstract Art" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" 
                    src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                />
                
                {/* Quote Card (Bottom Left) */}
                <div className="absolute bottom-6 left-6 p-6 bg-[#f0f0f0]/90 backdrop-blur-md rounded-xl max-w-[280px] shadow-sm border border-white/20">
                    <span className="font-headline font-black text-[9px] tracking-[0.2em] text-[#8037b1] uppercase mb-2 block">Curated Volume I</span>
                    <p className="font-headline text-[15px] font-bold leading-tight text-on-surface">"The essence of light is the frame of the moment."</p>
                </div>
            </div>

            {/* Right Column: Sign Up Form */}
            <div className="w-full md:w-[50%] p-10 md:p-12 flex flex-col justify-center">
                {/* Brand Identity */}
                <div className="mb-8 flex items-center gap-2.5">
                    <div className="w-9 h-9 signature-gradient rounded-xl flex items-center justify-center text-white shadow-md">
                        <Camera className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-headline text-2xl font-black italic tracking-tighter text-on-surface">Gallery</span>
                </div>

                <div className="mb-8">
                    <h1 className="font-headline text-[28px] font-black tracking-tight mb-2 text-stone-800">Create Account</h1>
                    <p className="text-stone-500 font-medium text-[13px] leading-relaxed">Join the world's most curated digital space for visual storytelling.</p>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="ghost-border flex items-center justify-center gap-2.5 py-3 rounded-lg hover:bg-stone-50 transition-all font-bold text-xs text-stone-700">
                        <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5 grayscale" alt="" />
                        Google
                    </button>
                    <button className="ghost-border flex items-center justify-center gap-2.5 py-3 rounded-lg hover:bg-stone-50 transition-all font-bold text-xs text-stone-700">
                        <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                        Apple
                    </button>
                </div>

                <div className="relative mb-6 flex items-center">
                    <div className="flex-grow border-t border-stone-100"></div>
                    <span className="px-3 text-[9px] font-black text-stone-300 uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-stone-100"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest ml-0.5" htmlFor="fullName">Full Name</label>
                        <input 
                            className="w-full bg-[#f4f2f1] border-none rounded-lg px-4 py-3 placeholder:text-stone-300 outline-none font-medium text-sm text-stone-600 focus:ring-1 focus:ring-primary/10 transition-all" 
                            id="fullName" 
                            name="fullName"
                            placeholder="Evelyn Thorne" 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest ml-0.5" htmlFor="email">Email Address</label>
                        <input 
                            className="w-full bg-[#f4f2f1] border-none rounded-lg px-4 py-3 placeholder:text-stone-300 outline-none font-medium text-sm text-stone-600 focus:ring-1 focus:ring-primary/10 transition-all" 
                            id="email" 
                            name="email"
                            placeholder="evelyn@gallery.art" 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest ml-0.5" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-[#f4f2f1] border-none rounded-lg px-4 py-3 placeholder:text-stone-300 outline-none font-medium text-sm text-stone-600 focus:ring-1 focus:ring-primary/10 transition-all" 
                                id="password" 
                                name="password"
                                placeholder="••••••••" 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors" 
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            disabled={loading}
                            className="w-full signature-gradient text-white font-headline font-black py-4 rounded-full shadow-lg hover:opacity-90 active:scale-[0.98] transition-all text-sm" 
                            type="submit"
                        >
                            {loading ? 'Archiving...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-[13px] font-medium text-stone-500">
                    Already have an account? 
                    <button onClick={() => setIsSignup(false)} className="text-[#8037b1] font-bold ml-1.5 hover:underline underline-offset-4">Log In</button>
                </p>

                <div className="mt-10 flex items-center justify-center gap-6 text-[9px] font-black text-stone-300 tracking-widest uppercase">
                    <a href="#" className="hover:text-stone-400">Privacy</a>
                    <a href="#" className="hover:text-stone-400">Terms</a>
                    <a href="#" className="hover:text-stone-400">Contact</a>
                </div>
            </div>
        </main>
      ) : (
        /* 🔑 LOGIN VIEW */
        <div className="relative w-full max-w-md bg-white p-12 rounded-[1.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            {/* Brand Mark */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black italic tracking-tighter text-on-surface font-headline mb-2">Gallery</h1>
                <p className="text-stone-800 font-headline text-2xl font-bold tracking-tight">Welcome Back</p>
                <div className="h-0.5 w-6 bg-primary/20 mx-auto mt-4" />
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 px-0.5" htmlFor="email">Email</label>
                    <input 
                        className="w-full h-12 px-4 bg-[#f4f2f1] border-none rounded-lg text-sm font-medium text-stone-600 outline-none focus:ring-1 focus:ring-primary/10 transition-all" 
                        id="email" 
                        name="email"
                        placeholder="name@example.com" 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-0.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400" htmlFor="password">Password</label>
                        <a className="text-[9px] font-black text-primary uppercase tracking-widest" href="#">Forgot?</a>
                    </div>
                    <div className="relative">
                        <input 
                            className="w-full h-12 px-4 bg-[#f4f2f1] border-none rounded-lg text-sm font-medium text-stone-600 outline-none focus:ring-1 focus:ring-primary/10 transition-all" 
                            id="password" 
                            name="password"
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"} 
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" 
                            type="button"
                        >
                           <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full h-12 mt-4 signature-gradient text-white font-black rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-md text-sm" 
                    type="submit"
                >
                    {loading ? 'Verifying...' : 'Log In'}
                </button>
            </form>

            <div className="relative w-full flex items-center justify-center my-10">
                <div className="w-full h-[1px] bg-stone-100"></div>
                <span className="absolute bg-white px-3 text-[9px] font-black text-stone-300 uppercase tracking-widest">or</span>
            </div>

            <div className="text-center">
                <p className="text-sm font-medium text-stone-500">
                    Don't have an account? 
                    <button onClick={() => setIsSignup(true)} className="font-bold text-[#8037b1] ml-1.5 hover:underline underline-offset-4">Sign Up</button>
                </p>
            </div>
        </div>
      )}
    </div>
  )
}

export default Login
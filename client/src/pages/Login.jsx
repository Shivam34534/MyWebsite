import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'
import { X, Eye, EyeOff, LayoutPanelTop, GalleryHorizontalEnd } from 'lucide-react'

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
          username: formData.fullName.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000), // Auto-generate username for simplicity in this UI
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
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary/20">
      
      <style>{`
        .signature-gradient {
            background: linear-gradient(135deg, #8037b1 0%, #b6004f 50%, #ffb147 100%);
        }
        .ghost-border {
            border: 1px solid rgba(175, 172, 172, 0.15);
        }
        .backdrop-dim {
            background-color: rgba(14, 14, 14, 0.6);
            backdrop-filter: blur(8px);
        }
      `}</style>

      {/* 📝 SIGN UP VIEW */}
      {isSignup ? (
        <main className="relative w-full max-w-6xl bg-surface-container-lowest rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_32px_128px_rgba(92,91,91,0.1)] min-h-[700px] animate-in fade-in zoom-in-95 duration-700">
            {/* Close / Toggle Action */}
            <button onClick={() => setIsSignup(false)} className="absolute top-6 right-6 z-50 p-3 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant active:scale-90">
                <X className="w-6 h-6" />
            </button>

            {/* Left Column: Editorial Image Content */}
            <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-full overflow-hidden">
                <img 
                    alt="Editorial Aesthetic" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105" 
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                />
                
                {/* Floating Editorial Badge */}
                <div className="absolute bottom-8 left-8 p-8 bg-surface-container-lowest/80 backdrop-blur-2xl rounded-[2rem] max-w-xs hidden lg:block shadow-xl border border-white/40">
                    <span className="font-headline font-black text-[10px] tracking-[0.4em] text-primary uppercase mb-3 block">Curated Volume I</span>
                    <p className="font-headline text-xl font-bold leading-tight text-on-surface">"The essence of light is the frame of the moment."</p>
                </div>
            </div>

            {/* Right Column: Focused Sign Up Form */}
            <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center">
                {/* Branding Anchor */}
                <div className="mb-12 flex items-center gap-3">
                    <div className="w-10 h-10 signature-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <GalleryHorizontalEnd className="w-5 h-5" />
                    </div>
                    <span className="font-headline text-2xl font-black italic tracking-tighter text-on-surface">Gallery</span>
                </div>

                <div className="mb-10">
                    <h1 className="font-headline text-4xl font-black tracking-tight mb-3 text-on-surface">Create Account</h1>
                    <p className="text-on-surface-variant font-medium text-sm leading-relaxed">Join the world's most curated digital space for visual storytelling.</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] ml-1" htmlFor="fullName">Full Name</label>
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 placeholder:text-stone-300 transition-all outline-none font-medium text-on-surface" 
                            id="fullName" 
                            name="fullName"
                            placeholder="Evelyn Thorne" 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] ml-1" htmlFor="email">Email Address</label>
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 placeholder:text-stone-300 transition-all outline-none font-medium text-on-surface" 
                            id="email" 
                            name="email"
                            placeholder="evelyn@gallery.art" 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] ml-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 placeholder:text-stone-300 transition-all outline-none font-medium text-on-surface" 
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
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors" 
                                type="button"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-6">
                        <button 
                            disabled={loading}
                            className="w-full signature-gradient text-white font-headline font-black py-5 rounded-full shadow-[0_16px_32px_-8px_rgba(128,55,177,0.3)] hover:opacity-90 active:scale-[0.97] transition-all uppercase tracking-widest text-xs" 
                            type="submit"
                        >
                            {loading ? 'Curating...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {/* Footer Link */}
                <p className="mt-10 text-center text-sm font-medium text-on-surface-variant/60">
                    Already have an account? 
                    <button onClick={() => setIsSignup(false)} className="text-primary font-black ml-2 hover:underline underline-offset-8 transition-all px-1">Log In</button>
                </p>
            </div>
        </main>
      ) : (
        /* 🔑 LOGIN VIEW */
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Content (Simulated Gallery View) */}
            <div className="fixed inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6 opacity-10 grayscale pointer-events-none scale-110">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                    <div key={i} className="aspect-[3/4] bg-surface-container-highest rounded-3xl overflow-hidden shadow-sm">
                        <img 
                            className="w-full h-full object-cover" 
                            src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&w=400&q=20`} 
                            alt="" 
                        />
                    </div>
                ))}
            </div>

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col items-center border border-stone-100 animate-in fade-in zoom-in-95 duration-1000">
                {/* Brand Identity */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter text-on-surface font-headline mb-4">Gallery</h1>
                    <p className="text-on-surface font-headline text-2xl font-bold tracking-tight">Welcome Back</p>
                    <div className="h-0.5 w-8 bg-primary/20 mx-auto mt-4" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 px-1" htmlFor="email">Email</label>
                        <input 
                            className="w-full h-14 px-6 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl text-on-surface placeholder:text-stone-300 transition-all outline-none font-medium" 
                            id="email" 
                            name="email"
                            placeholder="name@example.com" 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40" htmlFor="password">Password</label>
                            <a className="text-[10px] font-black text-primary hover:opacity-70 transition-all uppercase tracking-widest" href="#">Forgot?</a>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full h-14 px-6 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl text-on-surface placeholder:text-stone-300 transition-all outline-none font-medium" 
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
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors" 
                                type="button"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full h-14 mt-4 bg-gradient-to-r from-primary to-primary-dim text-white font-black rounded-full hover:opacity-90 active:scale-[0.97] transition-all duration-300 shadow-xl shadow-primary/20 uppercase tracking-widest text-xs" 
                        type="submit"
                    >
                        {loading ? 'Verifying...' : 'Request Access'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative w-full flex items-center justify-center my-12">
                    <div className="w-full h-[1.5px] bg-stone-100"></div>
                    <span className="absolute bg-white px-4 text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">or</span>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm font-medium text-on-surface-variant/60">
                        Don't have an account? 
                        <button onClick={() => setIsSignup(true)} className="font-black text-primary ml-2 hover:underline underline-offset-8 decoration-2 transition-all px-1">Establish Studio</button>
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Login
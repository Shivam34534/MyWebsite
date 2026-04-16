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
    <div className="bg-[#F2F2F2] font-sans text-black min-h-screen selection:bg-black selection:text-white p-4 md:p-8 flex items-center justify-center">
      
      {/* 🏁 MAIN BOX */}
      <main className="w-full max-w-6xl neo-border bg-white neo-shadow-lg flex flex-col md:flex-row overflow-hidden min-h-[600px]">
            
            {/* Left Section: Loud Branding & Visuals */}
            <div className="md:w-[50%] bg-tertiary p-8 md:p-12 flex flex-col justify-between border-b-[4px] md:border-b-0 md:border-r-[4px] border-black">
                <div>
                   <div className="inline-block bg-black text-white px-4 py-2 neo-border mb-8 -rotate-2">
                        <Camera className="w-8 h-8" />
                   </div>
                   <h1 className="text-7xl md:text-9xl font-black font-headline leading-[0.8] mb-6 tracking-tighter italic">
                     AURA<br/><span className="text-secondary outline-text-black">SOCIAL</span>
                   </h1>
                   <p className="text-xl font-bold uppercase tracking-tight bg-white neo-border px-4 py-2 inline-block -rotate-1">
                     Raw. Bold. Expressive.
                   </p>
                </div>

                <div className="mt-12">
                    <div className="neo-card bg-lime-400 rotate-1 max-w-sm">
                        <p className="font-black text-lg">"The world is too soft. Let's make it brutal."</p>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="w-6 h-1 bg-black" />
                            <span className="text-xs font-black uppercase">The Aura Team</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Form Container */}
            <div className="flex-1 bg-white p-8 md:p-12 lg:p-16 flex flex-col">
                <div className="mb-10 flex justify-between items-start">
                    <h2 className="text-5xl font-black tracking-tighter">
                        {isSignup ? 'NEW ENTRY' : 'RETURN'}
                    </h2>
                    <div className="w-12 h-12 bg-accent neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                        <AtSign className="w-6 h-6" />
                    </div>
                </div>

                {/* Registration/Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignup && (
                        <div className='grid grid-cols-1 gap-5'>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest" htmlFor="fullName">Full Name</label>
                                <input 
                                    className="w-full bg-white neo-border px-4 py-4 text-lg font-bold outline-none focus:bg-lime-50 transition-colors" 
                                    id="fullName" name="fullName" placeholder="SHIVAM ART" type="text" required value={formData.fullName} onChange={handleChange} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest" htmlFor="username">Username</label>
                                <input 
                                    className="w-full bg-white neo-border px-4 py-4 text-lg font-bold outline-none focus:bg-lime-50 transition-colors" 
                                    id="username" name="username" placeholder="shivam_345" type="text" required value={formData.username} onChange={handleChange} 
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest" htmlFor="email">Email</label>
                        <input 
                            className="w-full bg-white neo-border px-4 py-4 text-lg font-bold outline-none focus:bg-pink-50 transition-colors" 
                            id="email" name="email" placeholder="shivam@aura.xyz" type="email" required value={formData.email} onChange={handleChange} 
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black uppercase tracking-widest" htmlFor="password">Secret Key</label>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full bg-white neo-border px-4 py-4 text-lg font-bold outline-none focus:bg-pink-50 transition-colors" 
                                id="password" name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} 
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors" type="button">
                               {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            disabled={loading}
                            className={`w-full py-5 text-xl font-black uppercase tracking-widest transition-all
                                ${loading ? 'bg-stone-200 cursor-not-allowed' : 'bg-primary neo-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none'}`} 
                            type="submit"
                        >
                            {loading ? 'WAITING...' : isSignup ? 'JOIN CLUB' : 'ENTER AURA'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm font-bold">
                    {isSignup ? 'OLD MEMBER?' : "NOT A MEMBER?"}
                    <button onClick={() => setIsSignup(!isSignup)} className="ml-2 text-primary hover:bg-black hover:text-white px-2 py-0.5 border-2 border-transparent hover:border-black transition-all uppercase underline">
                        {isSignup ? 'LOGIN' : 'SIGN UP'}
                    </button>
                </p>

                <div className="mt-auto pt-10 flex flex-wrap justify-center gap-6">
                    <button className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:translate-y-[-2px] transition-transform">
                        <div className="w-2 h-2 bg-pink-500 rounded-full" /> Google
                    </button>
                    <button className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:translate-y-[-2px] transition-transform">
                        <div className="w-2 h-2 bg-black rounded-full" /> Github
                    </button>
                </div>
            </div>
      </main>
    </div>

  )
}

export default Login
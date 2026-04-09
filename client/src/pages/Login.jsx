import React, { useState } from 'react'
import { useClerk } from '../mockClerk'
import toast from 'react-hot-toast'
import { Eye, EyeOff, MapPin, AtSign, ArrowRight, Github, Twitter, Zap, Fingerprint, ShieldCheck, Globe } from 'lucide-react'

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
          toast.success("IDENTITY_SYNCHRONIZED")
        } else {
          toast.error(res.message || "SYNCHRONIZATION_FAILED")
        }
      } else {
        const res = await openSignIn({ 
            email: formData.email, 
            password: formData.password 
        })
        if (res.success) {
          toast.success("SESSION_ESTABLISHED")
        } else {
          toast.error(res.message || "ACCESS_DENIED")
        }
      }
    } catch (error) {
      toast.error("PROTOCOL_ERROR")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden selection:bg-black selection:text-white">
      
      {/* ⚡ BRAND SECTOR (LOUD & BRUTAL) */}
      <div className="w-full lg:w-3/5 bg-main p-8 md:p-16 flex flex-col justify-between relative border-b-8 lg:border-b-0 lg:border-r-8 border-black">
        
        {/* Top Meta */}
        <div className="z-10 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-white shadow-neo-sm">
                <Zap className="text-main w-6 h-6" />
             </div>
             <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-black">GALLERY_OS_v2.0.4</span>
           </div>
           <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="font-mono text-[10px] font-black uppercase">Core_System_Online</span>
             </div>
           </div>
        </div>

        {/* Hero Message */}
        <div className="z-10 my-16 lg:my-0">
          <h1 className="mb-8 select-none">
             RADICAL<br />
             <span className="bg-black text-white px-6 py-2 rotate-2 inline-block">EXPRESSION</span><br />
             STUDIO_
          </h1>
          <p className="max-w-lg text-2xl md:text-3xl font-black leading-tight uppercase mb-12 tracking-tight">
            The next generation of high-fidelity social curation. Raw, loud, and decrypted for the modern node.
          </p>
          
          <div className="flex flex-wrap gap-4">
             <div className="neo-box bg-white px-6 py-3 flex items-center gap-3 rotate-[-1deg] hover:rotate-0 neo-transition cursor-help">
                <ShieldCheck className="w-6 h-6 text-black" />
                <span className="font-black text-sm uppercase tracking-tighter">Encrypted_Archive</span>
             </div>
             <div className="neo-box bg-accent px-6 py-3 flex items-center gap-3 rotate-[1deg] hover:rotate-0 neo-transition cursor-help">
                <Globe className="w-6 h-6 text-black" />
                <span className="font-black text-sm uppercase tracking-tighter">Global_Network_ID</span>
             </div>
          </div>
        </div>

        {/* Footer Technical Meta (Bento Style) */}
        <div className="z-10 grid grid-cols-2 lg:grid-cols-3 gap-8 border-t-[6px] border-black pt-12">
           <div>
              <span className="font-mono text-[10px] font-black uppercase text-black/40 block mb-2">SYSTEM_UPTIME</span>
              <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">99.9%_STABLE</span>
           </div>
           <div>
              <span className="font-mono text-[10px] font-black uppercase text-black/40 block mb-2">ACTIVE_NODES</span>
              <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">1.2M_SYNC</span>
           </div>
           <div className="hidden lg:block">
              <span className="font-mono text-[10px] font-black uppercase text-black/40 block mb-2">ENCRYPTION</span>
              <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">RSA_4096_BIT</span>
           </div>
        </div>

        {/* Decorative Background (Brutalist Shapes) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary border-l-8 border-b-8 border-black -translate-y-20 translate-x-20 rotate-12 flex items-end justify-start p-8">
            <span className="font-black text-white text-6xl opacity-20">01</span>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent border-r-8 border-t-8 border-black translate-y-10 -translate-x-10 rotate-45" />
      </div>

      {/* 🔐 AUTH SECTOR (CLEAN & BOLD) */}
      <div className="w-full lg:w-2/5 p-8 md:p-16 flex items-center justify-center bg-white relative overflow-y-auto">
        <div className="w-full max-w-md">
          
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4">
               <Fingerprint className="w-8 h-8 text-secondary" strokeWidth={3} />
               <span className="font-mono text-[10px] font-black uppercase text-secondary tracking-widest">Awaiting_Identification...</span>
            </div>
            <h2 className="mb-4">
               {isSignup ? 'ESTABLISH_ID' : 'IDENTITY_AUTH'}
            </h2>
            <p className="font-bold text-black/50 uppercase tracking-tighter text-base">
               {isSignup ? 'Initialize a new node in the radical expression network' : 'Restore access to your private curation stage'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {isSignup && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest pl-1">FULL_NAME_STRING</label>
                  <input 
                    name="fullName" 
                    type="text" 
                    placeholder="EX: JOHN_DOE"
                    className="neo-input w-full uppercase"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest pl-1">UNIQUE_ALIAS</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <input 
                      name="username" 
                      type="text" 
                      placeholder="CURATOR_X"
                      className="neo-input w-full uppercase pl-12"
                      required
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest pl-1">DIGITAL_MAIL_KEY</label>
              <input 
                name="email" 
                type="email" 
                placeholder="USER@SYSTEM.COM"
                className="neo-input w-full uppercase"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 relative">
               <div className="flex justify-between items-center pr-1">
                 <label className="text-xs font-black uppercase tracking-widest pl-1">SECURITY_KEY</label>
                 {!isSignup && <button type="button" className="text-[10px] font-black uppercase underline hover:text-secondary">Forgot_Key?</button>}
               </div>
               <div className="relative">
                 <input 
                   name="password" 
                   type={showPassword ? "text" : "password"} 
                   placeholder="••••••••••••"
                   className="neo-input w-full"
                   required
                   value={formData.password}
                   onChange={handleChange}
                 />
                 <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black neo-transition"
                 >
                   {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                 </button>
               </div>
            </div>

            {isSignup && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest pl-1">PHYSICAL_LOCATION_NODE</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                  <input 
                    name="location" 
                    type="text" 
                    placeholder="TOKYO, NEO DISTRICT"
                    className="neo-input w-full uppercase pl-12"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="neo-button-primary w-full py-5 text-2xl mt-4 group"
            >
               <span className="uppercase">{loading ? 'PROCESING_AUTH...' : (isSignup ? 'INITIALIZE_IDENTITY' : 'EXECUTE_ENTRY')}</span>
               <ArrowRight className="w-7 h-7 group-hover:translate-x-3 neo-transition" strokeWidth={3} />
            </button>
          </form>

          {/* Social Auth Alternative (UX) */}
          <div className="mt-12 pt-8 border-t-[5px] border-black border-dashed flex flex-col gap-6">
             <div className="flex items-center gap-4">
               <button onClick={() => toast.error("GITHUB_NODE_OFFLINE")} className="flex-1 neo-button bg-white py-3 hover:bg-gray-soft">
                  <Github className="w-6 h-6" />
                  <span className="font-black text-xs uppercase">GITHUB_ID</span>
               </button>
               <button onClick={() => toast.error("X_API_REJECTED")} className="flex-1 neo-button bg-white py-3 hover:bg-gray-soft">
                  <Twitter className="w-6 h-6" />
                  <span className="font-black text-xs uppercase">X_NODE</span>
               </button>
             </div>

             <button 
                onClick={() => setIsSignup(!isSignup)}
                className="neo-button-secondary w-full py-4 text-xs font-black uppercase tracking-wider"
             >
                {isSignup ? 'ACCESS_EXISTING_IDENTITY' : 'CREATE_NEW_STATION_NODE'}
             </button>
          </div>

          <div className="mt-12 text-center">
             <p className="font-mono text-[10px] font-black uppercase text-black/30 tracking-[0.3em]">
               © 2026 GALLERY_SYSTEM_NETWORK // ALL_RIGHTS_RESERVED
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
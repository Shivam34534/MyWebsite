import React, { useState } from 'react';
import { useClerk } from '../mockClerk';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await openSignIn({ email, password });
    if (res.success) {
      toast.success('Welcome to Astra Social!');
      navigate('/');
    } else {
      toast.error(res.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full primary-gradient opacity-10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary opacity-10 blur-[100px] animate-pulse delay-500"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-2">
            <span className="text-xl font-black text-primary tracking-widest uppercase font-headline">Astra Social</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-on-surface leading-none font-headline">
              The Digital <br/>
              <span className="text-transparent bg-clip-text editorial-gradient">Curator.</span>
            </h1>
          </div>
          <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
            Welcome to the intersection of brutalist architecture and organic minimalism. Share what matters.
          </p>
          <div className="flex items-center gap-6 pt-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-surface bg-surface-container-low overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                 </div>
               ))}
             </div>
             <p className="font-bold text-on-surface/60 text-sm">Joined by 12k curators weekly</p>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="bg-surface-container-lowest p-10 md:p-14 rounded-[40px] shadow-2xl shadow-primary/10 border border-white/20 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black font-headline text-on-surface mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant font-medium">Continue your curation journey.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <input 
                className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all font-medium outline-hidden" 
                placeholder="nina@astrasocial.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                <a href="#" className="text-primary text-xs font-bold hover:underline">Forgot?</a>
              </div>
              <input 
                className="w-full bg-surface-container-low border-0 rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all font-medium outline-hidden" 
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full primary-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>


            <div className="relative flex items-center justify-center py-6">
              <div className="w-full border-t border-surface-container-high"></div>
              <span className="absolute bg-surface-container-lowest px-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Or Continue With</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white border border-surface-container-high hover:bg-surface-container-low transition-colors font-bold text-sm shadow-sm group">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white border border-surface-container-high hover:bg-surface-container-low transition-colors font-bold text-sm shadow-sm group">
                <img src="https://www.svgrepo.com/show/448203/apple.svg" className="w-5 h-5" alt="Apple"/>
                Apple ID
              </button>
            </div>
          </form>

          <p className="text-center mt-10 text-on-surface-variant font-medium">
            New to the circles? <a href="#" className="text-primary font-bold hover:underline">Apply for Invite</a>
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed bottom-10 left-10 text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest pointer-events-none">
        © 2024 Astra Social Circles
      </div>
      <div className="fixed bottom-10 right-10 flex gap-4 text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest pointer-events-none">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </div>
  );
};

export default Login;
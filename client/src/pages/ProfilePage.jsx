import React from 'react';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import BottomNavBar from '../components/layout/BottomNavBar';

const ProfilePage = () => {
  return (
    <div className="bg-surface min-h-screen">
      <TopNavBar />
      <SideNavBar />
      <main className="pt-16 lg:ml-64 min-h-screen">
        {/* Profile Header Section */}
        <section className="relative">
          {/* Banner */}
          <div className="h-48 md:h-72 w-full primary-gradient overflow-hidden">
            <div 
              className="w-full h-full opacity-30 mix-blend-overlay" 
              style={{ 
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGd0JUPncsC7-fBdfuCjku0fYUW5LT_pOJbA0tfd_iKc3mrxqqKGCIFTkrSjADpT1s7J-sMD6lgs3FuQTD2ASdMrnECJN7kEoK7wMHzoGAFCf4vhOLi103xuaOurs12NacrQZ_VHj7Yql-wdpstsl6YdSxJCaHPre6z3OZVFgWBxj9QNoCVe_xdoIH7tJhKZb43ycuQCUKNw_UszmkXYfcv9MBInffE4pybh3sXn9PyEybC2_lRW9dqVCicTX9__RZJsychDIBRk-N')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }} 
            />
          </div>
          {/* Profile Info Overlap */}
          <div className="max-w-5xl mx-auto px-6 -mt-16 md:-mt-24 relative z-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <div className="p-1.5 bg-surface rounded-full shadow-xl">
                  <img alt="Eleanor Vance" className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZLPzTGJ-vOLN6VORZWCP-zdyJEKMhvWbhOI-mLDX8aZTpMU_CPUx8RiPzzZFizTkZgxeFJ54hFh0NNj-Y72he_1F2rTB4kAM_siLSXR76nNluNVHc8vwjutLIsaBIz5LaijMJBzrDWmRJMvkLD1-fRHnxZzkpwaj58FBH8c6Brg6oHbusmIRMDF__AyLUBnS5su39ftIk53uZsXirc4y4bQ8BVoYFCYRWt5mG22V1lsDacPonqJPVqqMjRUV_Aeszw0JguJEk1QrU"/>
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-on-surface">Eleanor Vance</h1>
                  <p className="text-on-surface-variant text-lg font-medium mt-1">Interior Architect & Digital Curator</p>
                </div>
              </div>
              <div className="flex gap-4 pb-4">
                <button className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-colors">Edit Profile</button>
                <button className="px-6 py-2.5 rounded-full primary-gradient text-white font-bold shadow-lg hover:brightness-105 transition-all">Share</button>
              </div>
            </div>
            {/* Bio & Stats Bento Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="md:col-span-2 p-8 bg-surface-container-lowest rounded-2xl shadow-sm">
                <h3 className="text-xs uppercase tracking-widest text-outline font-bold mb-4">Biography</h3>
                <p className="text-on-surface leading-relaxed text-lg italic">
                  "Exploring the intersection of brutalist architecture and organic minimalism. Curating spaces that breathe and stories that resonate in the digital void."
                </p>
                <div className="flex gap-3 mt-6">
                  <span className="perspective-chip">#ArchDaily</span>
                  <span className="perspective-chip">#Minimalism</span>
                  <span className="perspective-chip">#DigitalSpace</span>
                </div>
              </div>
              <div className="p-8 bg-surface-container-low rounded-2xl flex flex-col justify-center gap-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-black font-headline text-primary">128</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Posts</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">grid_view</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-black font-headline text-primary">12.4k</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Followers</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">group</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-black font-headline text-primary">842</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Following</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person_add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feed Section */}
        <section className="max-w-5xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-12 mb-8 border-b-0">
            <button className="pb-4 text-primary font-bold border-b-2 border-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">grid_on</span>
              <span className="font-headline uppercase tracking-widest text-sm">Posts</span>
            </button>
            <button className="pb-4 text-slate-500 font-semibold hover:text-primary transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">perm_media</span>
              <span className="font-headline uppercase tracking-widest text-sm">Media</span>
            </button>
            <button className="pb-4 text-slate-500 font-semibold hover:text-primary transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">bookmark</span>
              <span className="font-headline uppercase tracking-widest text-sm">Saved</span>
            </button>
          </div>

          {/* Post Grid (Asymmetric Editorial Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            {/* Post Card 1 */}
            <article className="bg-surface-container-lowest rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square w-full overflow-hidden">
                <img alt="Interior design post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkJ7NtwmVG-faIsfqUibaoLaH-Bw4Y_wuNg_nm2KJFCwkMCrS0N30etGqaXZyA33TzzKll7nln5lfAzCQEoDJA_DWDtuLWeDkhiRM-5evX2EZxtd-h-SAGtnAG5vAFLNoI6p7bzHzZQjZriQo8RHvlDOvbWsyqym1MyjHlEJ9lnYzlN5SRWJgoELX0SK00ZN7AIC3bK9hqnw8-KGrIADPNFnmOpvJEbT9RUGVJtE21wnsUik5C-xwhJff4zF54jgSzF2H54aTpEoC-"/>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline font-bold text-xl text-on-surface">The Light Within</h3>
                    <p className="text-on-surface-variant text-sm mt-1 font-label">Posted 2 days ago</p>
                  </div>
                  <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <p className="text-on-surface-variant mb-6 line-clamp-2">Exploring how natural light interacts with raw concrete surfaces in my latest project. Minimalism is not about lack, it's about essence.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined filled">favorite</span>
                      <span className="text-sm font-bold">1.2k</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">chat_bubble</span>
                      <span className="text-sm font-bold">48</span>
                    </button>
                  </div>
                  <span className="perspective-chip uppercase">Design</span>
                </div>
              </div>
            </article>

            {/* Post Card 2 */}
            <article className="bg-surface-container-lowest rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square w-full overflow-hidden">
                <img alt="Architecture post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk4DW5bHT3PiH-dFUbj3TK4bjbTTAbJ_0gsZSSKZJWBiaVCVPF6ndnb0H0k6DqZHCHbMMO7ockZSGYbbnPQt2xzX1pQjVxIa9XaBxk1NJQ3fC7hSjqA2W3vHE7Nn9xGena0Mg0acEph6RcafsuIn42QfPRoQPggJNsL1JpiMu0O8fThU88nnM2YGnRqTWfQY3N5lMUBhYtPPsCkpi1nSZr_wtSgATl-UBmMWrXDkG_VjY5TWZ4HwGwZep2kPD73IHjuIYgywLkEQfn"/>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline font-bold text-xl text-on-surface">Geometric Echoes</h3>
                    <p className="text-on-surface-variant text-sm mt-1 font-label">Posted 5 days ago</p>
                  </div>
                  <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <p className="text-on-surface-variant mb-6 line-clamp-2">Architecture is the learned game, correct and magnificent, of forms assembled in the light. Today's find in the financial district.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">favorite</span>
                      <span className="text-sm font-bold">856</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">chat_bubble</span>
                      <span className="text-sm font-bold">32</span>
                    </button>
                  </div>
                  <span className="perspective-chip uppercase">Brutalism</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default ProfilePage;

import React from 'react';

const CreatePostModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-on-surface/20 glass-header" onClick={onClose}></div>
      
      {/* Create Post Modal Container */}
      <div className="relative z-50 w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300">
        {/* Modal Header */}
        <header className="glass-header px-8 py-6 flex items-center justify-between">
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">Create New Post</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </header>

        {/* Modal Content */}
        <div className="px-8 py-4 space-y-6">
          {/* User Context */}
          <div className="flex items-center gap-3">
            <img alt="User Profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPG8WOR_t2257EpHhZVaiN1Jx02G-d0hNy1a84OfC4UbA8Qd7DtlzwD3icFvJUPs4lwvzQWVVQ_jIi6Bo2_rvt4bGELIFCsn0iXcNotMjaYa3P3G5HLs4dJyaNeY1b1Y6ru2nlEDuiLMZSUlfNYy7_9EdKuAKn7tYqzHWu9VIQqp9davUhMbsInqhHtzf9X5wSPsPtBqAeIREAoCaid-A2ffLj-ldp7fLsR6MGk8QtrF0V_huZFvdpmAxO0vGSdtAQffT8lwGcSmpQ"/>
            <div>
              <p className="text-on-surface font-semibold text-sm">Alex Rivera</p>
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-[14px]">public</span>
                <span>Everyone can see this</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <textarea className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 text-lg placeholder-on-surface-variant/50 resize-none font-body leading-relaxed" placeholder="What's on your mind? Capture the moment..."></textarea>
          </div>

          <div className="space-y-3">
            <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-70">Theme</p>
            <div className="flex flex-wrap gap-3">
              <button className="w-8 h-8 rounded-lg bg-surface-container-high border-2 border-primary ring-2 ring-primary/20 flex items-center justify-center transition-transform hover:scale-110">
                <span className="w-4 h-4 rounded-full border border-on-surface/10 bg-white"></span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-fuchsia-400 transition-transform hover:scale-110"></button>
              <button className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-400 to-rose-400 transition-transform hover:scale-110"></button>
              <button className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 transition-transform hover:scale-110"></button>
              <button className="w-8 h-8 rounded-lg bg-on-surface transition-transform hover:scale-110"></button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-on-surface/5">
            <div className="flex items-center gap-1">
              <button className="p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform filled">image</span>
              </button>
              <button className="p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
                <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">gif_box</span>
              </button>
              <button className="p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:scale-110 transition-transform">location_on</span>
              </button>
              <button className="p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:scale-110 transition-transform">sentiment_satisfied</span>
              </button>
            </div>
            <button className="primary-gradient px-8 py-3 rounded-full text-on-primary font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

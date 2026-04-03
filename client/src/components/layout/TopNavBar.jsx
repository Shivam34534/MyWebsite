import React from 'react';

const TopNavBar = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-3 glass-header transition-all duration-200">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text editorial-gradient font-headline">Astra Social</span>
        <div className="hidden md:flex items-center gap-6">
          <a className="text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors py-1" href="/">Home</a>
          <a className="text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors py-1" href="/discover">Explore</a>
          <a className="text-primary font-bold border-b-2 border-primary pb-1 py-1" href="/profile">Profile</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex bg-surface-container-low rounded-full px-4 py-1.5 items-center gap-2">
          <span className="material-symbols-outlined text-outline text-sm">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Search curated content" type="text"/>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100/50 transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100/50 transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">settings</span>
        </button>
        <img alt="User profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOFIUValOYrlTWu8nq4ap0A9azcZKuEGohJjblu_dmNfhHyTodtCU4DTRAd5IV8YR1dPKpLGJ7Na_pRYSqhLyYsSblyx2HEevasBj4g19D94nzIi57B7J_w0PiKIQJRCeOv6GqxggJvXCjPNgZDrLgHrrqy6gTrkHFMSf7mQ6jF7UH9a4h8KR6a8HxfPJt_UEdOtXz3ckaigMsoic1_NvuqanN0tePwLXpKEYBsTYxhMZX5UZ4qsm3GJNff3GaGn6Sw_02w3Kagsgf"/>
      </div>
    </header>
  );
};

export default TopNavBar;

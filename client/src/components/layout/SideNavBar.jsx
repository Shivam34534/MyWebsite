import React from 'react';

const SideNavBar = ({ onOpenCreatePost }) => {
  return (
    <aside className="fixed left-0 top-0 h-full hidden lg:flex flex-col p-6 gap-8 bg-surface-container-low dark:bg-slate-900 w-64 z-40 mt-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <a className="flex items-center gap-4 p-3 text-slate-500 dark:text-slate-400 hover:text-primary hover:translate-x-1 transition-transform duration-200" href="/">
            <span className="material-symbols-outlined">home</span>
            <span className="font-headline font-semibold">Home</span>
          </a>
          <a className="flex items-center gap-4 p-3 text-slate-500 dark:text-slate-400 hover:text-primary hover:translate-x-1 transition-transform duration-200" href="/messages">
            <span className="material-symbols-outlined">mail</span>
            <span className="font-headline font-semibold">Messages</span>
          </a>
          <a className="flex items-center gap-4 p-3 text-slate-500 dark:text-slate-400 hover:text-primary hover:translate-x-1 transition-transform duration-200" href="/connections">
            <span className="material-symbols-outlined">group</span>
            <span className="font-headline font-semibold">Connections</span>
          </a>
          <a className="flex items-center gap-4 p-3 text-slate-500 dark:text-slate-400 hover:text-primary hover:translate-x-1 transition-transform duration-200" href="/discover">
            <span className="material-symbols-outlined">explore</span>
            <span className="font-headline font-semibold">Discover</span>
          </a>
          <a className="flex items-center gap-4 p-3 text-primary dark:text-violet-400 font-bold bg-white dark:bg-slate-800 rounded-2xl shadow-sm" href="/profile">
            <span className="material-symbols-outlined filled">person</span>
            <span className="font-headline font-semibold">Profile</span>
          </a>
        </div>
        <button onClick={onOpenCreatePost} className="mt-4 py-3 px-6 rounded-2xl primary-gradient text-white font-bold shadow-lg hover:brightness-105 transition-all outline-hidden">
          Create Post
        </button>
      </div>
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 p-3 bg-surface-container rounded-2xl">
          <img alt="Astra Social Logo" className="w-10 h-10 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhpw905nnqm3ghwjBjLyFOMe9hSveWYhd5dHF3lVbzW7-SZZMvSSHQS7NdWbhyn2wzrCPvn3EY5OfL_W4UR5yTq9-lBQaT3qCcoNmdDutbHb46RGFZ2kj3PDCtOY6Qlsm33uKxGVPo-OgwCkKn2cTnTr95Ao4Vh-eKoPPYuGGzwbGY3SqgxWSC_CNTVkZpOA0o1LBHSngF_EFFuWrg0emALpU6E5GWFQcFbjeNtFzkn_gLVbqNVYSs3ha0hZQHgOfNouPat7kbMa8i"/>
          <div>
            <p className="text-sm font-bold text-on-surface">Astra Social</p>
            <p className="text-xs text-on-surface-variant font-label">The Digital Curator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;

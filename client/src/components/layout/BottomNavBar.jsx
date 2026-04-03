import React from 'react';

const BottomNavBar = ({ onOpenCreatePost }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden glass-header flex justify-around items-center py-3 px-6 z-50">
      <button className="flex flex-col items-center gap-1 text-slate-500">
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] font-bold uppercase">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-slate-500">
        <span className="material-symbols-outlined">mail</span>
        <span className="text-[10px] font-bold uppercase">Inbox</span>
      </button>
      <div className="relative -top-6">
        <button onClick={onOpenCreatePost} className="w-14 h-14 rounded-full primary-gradient text-white shadow-xl flex items-center justify-center outline-hidden">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
      <button className="flex flex-col items-center gap-1 text-slate-500">
        <span className="material-symbols-outlined">group</span>
        <span className="text-[10px] font-bold uppercase">Connect</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-primary">
        <span className="material-symbols-outlined filled">person</span>
        <span className="text-[10px] font-bold uppercase">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNavBar;

import React from 'react';

const Messages = () => {
  return (
    <div className="bg-surface h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Left Column: Recent Chats */}
      <aside className="w-full md:w-1/3 bg-surface-container-low flex flex-col border-r border-surface-container">
        <div className="p-6 pb-2">
          <h1 className="text-3xl font-black tracking-tighter text-on-surface">Inbox</h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">3 unread messages</p>
        </div>
        <div className="flex-grow overflow-y-auto px-3 py-4 space-y-2">
          {/* Active Chat */}
          <div className="p-4 rounded-2xl bg-white shadow-sm flex gap-4 cursor-pointer">
            <div className="relative flex-shrink-0">
              <img className="w-12 h-12 rounded-2xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmS0d5SW3WMNXUJLutKiPfLa92zfsWH8oxQ8Pi0b-T7IrW_Zdakx_miKxD6DH9LqeQfz01EbdrDNgkHR4LJimsBf8S8EqkaCAZn96zmzExK0wbGhOiOPYbGfO3QHKPgETUsNKpwDJ2mlOWcqZ19PnHj3OpNWG8BbLsiEuo3fsnekHTqr6l1gsKxE9glZls8d8iq0nMQRYkflOuEEOjB8ABvc2AaYTJG5CuagonEFQO7MA_RaagOtf2qu2iznYagTlTfomnz5kp7hxz" alt="Elena Vance"/>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-on-surface truncate">Elena Vance</span>
                <span className="text-[10px] font-bold text-primary uppercase">2m ago</span>
              </div>
              <p className="text-sm text-on-surface-variant truncate font-medium">The editorial layout looks stunning! Just saw the...</p>
            </div>
          </div>
          
          {/* Other Chat */}
          <div className="p-4 rounded-2xl hover:bg-white/50 transition-colors flex gap-4 cursor-pointer">
            <img className="w-12 h-12 rounded-2xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1hdcbpHr7ByDSNWAvgdkw24hIGyfwNIGn4qHzSPp3V1-AJgEoWtRD6FeeEmTM686EcERmDo3sGn-A9tSmgiWskJ7M_JkRic7k5eOEMKtX7_chL0SgoVKfDLjkhUta9o1xxlRRtaS6vbQiltV2nAxOIwW3-GF7gLF8bHkaMDPPanXLsK72KX_HFBGxNduXVJani5ATKJvsHSh-ASVrDgt35VrYOipMAyr43IaW4cVUMpT7KA7GhTLR1K9JTzsqwla_l6GpIXeNhHYv" alt="Marcus Chen"/>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-on-surface truncate">Marcus Chen</span>
                <span className="text-[10px] font-medium text-on-surface-variant uppercase">1h ago</span>
              </div>
              <p className="text-sm text-on-surface-variant/70 truncate">Did you receive the brief for the Astra rebranding project?</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Column: Active Chat Window */}
      <section className="hidden md:flex flex-col w-2/3 bg-surface relative">
        <header className="p-6 bg-white/40 backdrop-blur-md flex justify-between items-center z-10 border-b border-surface-container">
          <div className="flex items-center gap-4">
            <img className="w-10 h-10 rounded-2xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClEnuEkj_NAIvahkX7xt75DPqI7CnlvOa5OQsA3o7OBKUy7ijCMA9qJZ4b4oW0FHIrpEUKxULz_RGhOWqMoHifxjFOWHSXqamimirWBDjjLF7-bdfzpyRFC2yF_jGnn6Jd56Sl1yqzxV0FUUa3rWMUIVZB2iXtKGQXvz9iIrAEbjG-QgxFquwwrd25UXkcKoGh8saYzdLNKy-htCcbsZzaq18tBz0JburKxU_2V0RYdvTVyeGFSdrc7EaWK-n9faCk-zG6lGgLKbwk" alt="Elena Vance"/>
            <div>
              <h2 className="text-lg font-black text-on-surface">Elena Vance</h2>
              <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-8 space-y-6">
          <div className="flex justify-center">
            <span className="px-4 py-1 rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Today</span>
          </div>
          <div className="flex gap-4 max-w-lg">
            <img className="w-8 h-8 rounded-xl flex-shrink-0 self-end" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzpkiMgkGc_e7PKKFqXa30-MbGwmTb0eKO5is8SSyeyOK7Fhhq0rjo8Uy6rkf-9yhiCZIUzw-R9VOtOK3n4dSJ8fbFiIK0EDXuZ_GY24qkec8y0LnaBHQAfgzWSudfLFfYkeEgjxjiNWIbAXMRbGaxp8V-ACWZzw9oKgKSzE8tGVAFhaZQF2dc6cS0cauQco3Z57SzIx6pyUM6J9QFtdGs94SiHpQTv-2naLQ26RSXoUMpnE_vwxZheFZvHxOa3yXu3_p7NEC5jUj2" alt="Small profile thumb"/>
            <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-bl-none shadow-sm">
              <p className="text-sm leading-relaxed text-on-surface">Hey! I just reviewed the new design system components. The "Digital Curator" theme is exactly what we needed for the upcoming launch.</p>
              <span className="text-[10px] text-on-surface-variant/50 mt-2 block">10:42 AM</span>
            </div>
          </div>
          <div className="flex gap-4 max-w-lg ml-auto justify-end">
            <div className="primary-gradient p-4 rounded-2xl rounded-br-none shadow-lg text-white">
              <p className="text-sm leading-relaxed">Glad you like it! I focused on that editorial vibe. Have you looked at the message interface yet? We're aiming for zero-border sectioning.</p>
              <span className="text-[10px] opacity-70 mt-2 block text-right">10:45 AM</span>
            </div>
          </div>
        </div>

        <footer className="p-6 bg-surface border-t border-surface-container">
          <div className="bg-surface-container-lowest rounded-2xl p-2 shadow-sm flex items-center gap-2 group border border-transparent focus-within:border-primary/20 transition-all">
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">image</span>
            </button>
            <input className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2 px-2" placeholder="Type a message..." type="text"/>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </button>
            <button className="primary-gradient text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined filled">send</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Messages;

import React from 'react';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import BottomNavBar from '../components/layout/BottomNavBar';

const ConnectionsPage = () => {
  const connections = [
    { name: 'Elena Vance', handle: '@elena_creates', role: 'Designer', bio: 'Visual storyteller focused on brutalist architecture and minimalist digital experiences.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_pklmRLtC87AneOXFWYGO6nRJBGCE02UI6pzXTw1DfQjuUo47r7v_4Tedpqq_hJ_yXzAzkOp26S3o-vBy5XrVp7M3Wq6dM5Kg4WUR61enVuWePp_DK1W68a1yR3O7Ws-NZzZtc2leZwq8QpszN8ILLf5rXPOfU4VE9SwwFORjQIFLg_a1bgRTUkdip1AoZpMvdN-V-hg0XCy4tmTZZrsFribg3cJZHYbL0kWiXkeDKALaokGf8wG0ldI_uaBDG39PMPrs8ldqcxTN' },
    { name: 'Marcus Thorne', handle: '@mthorne_edits', role: 'Editor', bio: 'Curation specialist for high-end tech journals. Always looking for the next big shift.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCljrReiq_1YaSMXrS7tWGOr-XN4LdCPa3h72rAJ2M_ZMS2P-kdZxz_8pdvhK3H3ZOvrNTMKj8S-nUGQOETFeMDOucV7mIUkBoMei44O7GI-rbWqBT5DS7q2XtSMdDH1Hydjp0HcGXjp74Ut8fZzFPkkzPFQ72oWADG6o5pzHj-3TE1voTdIFDOR4iLjQz8OaVfeODidoKkwi7-HUI4I-O9AlG9SMgMAj7X-qRgiNkrageyvJc2GtNJILLk-wDsKzJyrSAYmopo3zOS' },
    { name: 'Sia Nakamura', handle: '@sianak_arch', role: 'Architect', bio: 'Designing spaces that breathe. Exploring the intersection of digital and physical form.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHnWfXE9lgBNwNlHc8jcqes-996ATVlwGG5iEY5onqVSYGuKZZbXnBKSVXles260DScJE38SArr3d4YEoVcrvPhSvS5sREaa533uTommn-XAjZ0sNn7k3zUQgKrqy3NKfHj-kUN8kfzF9G4extCTdan07Bss5KwfppdMkoDoosv6odnQtwnvJS1gMbAgQ1zm1asxZoSnNBf3SZVfQQnuCyIEliz1UVDsHlrKW1k_oEprbpT9qn5eWUZ-4GOy7VEPOzJzfKCxw729X6' },
  ];

  return (
    <div className="bg-surface min-h-screen">
      <TopNavBar />
      <SideNavBar />
      <main className="lg:ml-64 pt-24 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface">Connections</h1>
              <p className="text-on-surface-variant mt-2 max-w-md">Curate your network of digital storytellers and visionaries.</p>
            </div>
            {/* Tabbed Interface */}
            <div className="flex bg-surface-container-low p-1.5 rounded-2xl">
              <button className="px-8 py-2.5 rounded-xl bg-white shadow-sm font-bold text-primary transition-all text-sm">
                Followers
              </button>
              <button className="px-8 py-2.5 rounded-xl font-bold text-on-surface-variant hover:text-on-surface transition-all text-sm">
                Following
              </button>
            </div>
          </div>

          {/* Bento Grid of UserCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((user, i) => (
              <div key={i} className="group bg-surface-container-lowest p-6 rounded-2xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <img alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-surface-container-low group-hover:ring-primary/20 transition-all" src={user.img}/>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>
                  <span className="perspective-chip uppercase tracking-wider text-[10px]">{user.role}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline text-on-surface">{user.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-3">{user.handle}</p>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{user.bio}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 primary-gradient text-white py-2.5 rounded-xl text-sm font-bold hover:scale-[0.98] transition-transform">
                    Follow Back
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default ConnectionsPage;

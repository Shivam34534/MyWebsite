import React from 'react';

const Discover = () => {
  const curators = [
    { name: 'Elena Rostova', handle: '@elena_curates', bio: 'Digital anthropologist exploring the intersection of AI and human creativity.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_pklmRLtC87AneOXFWYGO6nRJBGCE02UI6pzXTw1DfQjuUo47r7v_4Tedpqq_hJ_yXzAzkOp26S3o-vBy5XrVp7M3Wq6dM5Kg4WUR61enVuWePp_DK1W68a1yR3O7Ws-NZzZtc2leZwq8QpszN8ILLf5rXPOfU4VE9SwwFORjQIFLg_a1bgRTUkdip1AoZpMvdN-V-hg0XCy4tmTZZrsFribg3cJZHYbL0kWiXkeDKALaokGf8wG0ldI_uaBDG39PMPrs8ldqcxTN', tag: 'Top 1%' },
    { name: 'Marcus Thorne', handle: '@m_thorne', bio: 'Architectural minimalist and urban photographer. Focusing on the quiet moments.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB18kjzGhkbAtBuQ3kueBjdJB0sbsbDp1vAKLBUV-Kd0Uqd93C2OJygjaRodetwcRASgfsSxhQpAlAusm6mmzogODFM1OzkHNQVB9V3CRAggsXoN_x5tOt3gBZzfKv4xay6s9Xp7hatGnhXqktQKWULa8-YWlaPTatxw8piKv2wkwB5kKQJglInhRGk7njBjE1XTqflk68WUUiSdWQD5W1pNbuOedGs2wDWDkZUTOPY2137LqIuVASh8bklYUNhQ4pUDGcKF8AxnCFj', tag: 'New' },
    { name: 'Sienna Blue', handle: '@siennastudio', bio: 'Exploring the future of generative art. Weekly drops of curated ethereal landscapes.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBggRv1U6SpTH216wuxG9Kp4oFkYryxL_ZLZsWf8ImdZjr-yXN1B-nqZ8qFSHwq17d-O4_Cum4YeJgMeH1uA-17xz2HXg8fBue9LqerJB5n6u29o7rBBIYlr9nlqLrDNAc5oYTSxj2SWB6GZFqzTVihl30Ay2NRyE826LnIPgbmJhZG4YbMCx4mZi2bNuG1fSKs5kdj_ga1QsxSb0mZ3XxLPW3Xh03JCfLolGpEXU746j6_rR5WrH7whDx7Iubrdgc-NPbKl7EapnZH', tag: 'Featured' },
  ];

  return (
    <div className="bg-surface px-6 md:px-12 py-8">
      <section className="max-w-5xl mx-auto mb-16 pt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 font-headline text-on-surface">
          Discover <span className="text-transparent bg-clip-text editorial-gradient">Curators.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
          Connect with the minds shaping digital culture. Find experts across design, technology, and art who curate the future.
        </p>
        <div className="relative group max-w-3xl">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary text-3xl">search</span>
          </div>
          <input className="w-full pl-16 pr-8 py-6 rounded-2xl border-none bg-surface-container-low focus:ring-4 ring-primary/20 text-xl font-medium transition-all shadow-sm outline-hidden" placeholder="Who are you looking for?" type="text"/>
          <div className="absolute inset-y-2 right-2 hidden md:block">
            <button className="h-full px-8 rounded-xl primary-gradient text-white font-bold tracking-wide">
              Search
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-6 flex-wrap">
          <span className="perspective-chip">Design</span>
          <span className="perspective-chip">Web3</span>
          <span className="perspective-chip">Fine Arts</span>
          <span className="perspective-chip">Philosophy</span>
          <span className="perspective-chip">AI Architecture</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mb-20 text-on-surface">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold font-headline">Recommended For You</h2>
            <div className="h-1 w-12 editorial-gradient mt-2 rounded-full"></div>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all <span className="material-symbols-outlined">trending_flat</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {curators.map((curator, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-8 transition-all hover:-translate-y-1 group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-surface-container-low overflow-hidden">
                    <img alt="Curator Avatar" className="w-full h-full object-cover" src={curator.img}/>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 editorial-gradient rounded-full flex items-center justify-center border-2 border-white">
                    <span className="material-symbols-outlined text-[12px] text-white filled">verified</span>
                  </div>
                </div>
                {curator.tag && <span className="perspective-chip bg-surface-container-high">{curator.tag}</span>}
              </div>
              <h3 className="text-xl font-bold font-headline mb-1">{curator.name}</h3>
              <p className="text-primary text-sm font-semibold mb-4">{curator.handle}</p>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                {curator.bio}
              </p>
              <button className="w-full py-3 rounded-xl primary-gradient text-white font-bold transition-all active:scale-95">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Discover;

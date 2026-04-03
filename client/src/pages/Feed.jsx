import React from 'react';

const Feed = () => {
  const posts = [
    {
      title: "The Light Within",
      time: "2 days ago",
      author: "Eleanor Vance",
      content: "Exploring how natural light interacts with raw concrete surfaces in my latest project. Minimalism is not about lack, it's about essence.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkJ7NtwmVG-faIsfqUibaoLaH-Bw4Y_wuNg_nm2KJFCwkMCrS0N30etGqaXZyA33TzzKll7nln5lfAzCQEoDJA_DWDtuLWeDkhiRM-5evX2EZxtd-h-SAGtnAG5vAFLNoI6p7bzHzZQjZriQo8RHvlDOvbWsyqym1MyjHlEJ9lnYzlN5SRWJgoELX0SK00ZN7AIC3bK9hqnw8-KGrIADPNFnmOpvJEbT9RUGVJtE21wnsUik5C-xwhJff4zF54jgSzF2H54aTpEoC-",
      likes: "1.2k",
      comments: "48",
      tag: "Design"
    },
    {
      title: "Geometric Echoes",
      time: "5 days ago",
      author: "Marcus Thorne",
      content: "Architecture is the learned game, correct and magnificent, of forms assembled in the light. Today's find in the financial district.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk4DW5bHT3PiH-dFUbj3TK4bjbTTAbJ_0gsZSSKZJWBiaVCVPF6ndnb0H0k6DqZHCHbMMO7ockZSGYbbnPQt2xzX1pQjVxIa9XaBxk1NJQ3fC7hSjqA2W3vHE7Nn9xGena0Mg0acEph6RcafsuIn42QfPRoQPggJNsL1JpiMu0O8fThU88nnM2YGnRqTWfQY3N5lMUBhYtPPsCkpi1nSZr_wtSgATl-UBmMWrXDkG_VjY5TWZ4HwGwZep2kPD73IHjuIYgywLkEQfn",
      likes: "856",
      comments: "32",
      tag: "Brutalism"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface">Curated Feed</h1>
        <p className="text-on-surface-variant font-medium mt-1">Discover what's trending in your curated circle.</p>
      </header>

      <div className="space-y-12">
        {posts.map((post, i) => (
          <article key={i} className="bg-surface-container-lowest rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 border border-surface-container">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                <img alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={post.img}/>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="perspective-chip mb-3">{post.tag}</span>
                    <h3 className="font-headline font-extrabold text-2xl text-on-surface leading-tight">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-on-surface-variant text-sm font-semibold">{post.author}</span>
                       <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                       <span className="text-on-surface-variant/60 text-xs">{post.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant leading-relaxed mb-8 flex-grow">{post.content}</p>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group/btn">
                      <span className="material-symbols-outlined filled group-hover/btn:scale-120 transition-transform">favorite</span>
                      <span className="text-sm font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group/btn">
                      <span className="material-symbols-outlined group-hover/btn:scale-120 transition-transform">chat_bubble</span>
                      <span className="text-sm font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Feed;

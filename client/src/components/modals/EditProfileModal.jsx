import React from 'react';

const EditProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-md z-40" onClick={onClose}></div>
      
      {/* Edit Profile Modal */}
      <div className="relative z-50 w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        {/* Modal Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">Edit Profile</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <form className="px-8 pb-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Cover Banner Upload */}
          <div className="relative group">
            <div className="h-48 w-full bg-surface-container-low rounded-2xl overflow-hidden relative">
              <img className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ12Piln-jY4m42KYS0YaUmdzIYIp1ochq6_r9jRpRnvWGBPpQJBngk-LYha5EQ6sNWghklVN2NAsjx6He45g1OwARoKh8ZrbRMt_kJihNpjaDd2Xfc7zurdJE1PIZyhBiIAH6WO9CeHe8w6nvlJeTnJMNmDZLFEMAFubX6N74rxr5-D3AElsZG46zkmwX373WuoFqZB_Nug1zehJ80sGHTCGyP96g_OvAA7Mw-0QreuFASKAKG1karMqaJOmXMu76WZNpYOC2O11f" alt="Cover"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <label className="cursor-pointer bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-primary">add_a_photo</span>
                  <span className="text-sm font-semibold text-on-surface">Upload Cover</span>
                  <input className="hidden" type="file"/>
                </label>
              </div>
            </div>
            {/* Profile Image Upload (Overlapping) */}
            <div className="absolute -bottom-12 left-8">
              <div className="relative group/avatar">
                <div className="h-28 w-28 rounded-full border-4 border-surface-container-lowest bg-surface-container-low overflow-hidden shadow-lg">
                  <img className="h-full w-full object-cover group-hover/avatar:opacity-60 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRcaQeic9HdRvnsC-_eSuVluiP9tczoR9rrNxt_Qy9jkL13tUn6VslZt1FvP0N0SuzaPZUm4HbRLp72jeucWJPSNWKr7vKoHuyxfTRRYZl2-MebHXTJ5FAR4k7deNG5_0WXhD97gqn4DAeLyfx4i1vrDP1ed_pSHLhDWnsXk3OkVWc8F4aErHfX2LKLXjhQhnsosuw4PgbArR0UEHUh0nbE67tbYSbfX9T6gMDgRF99icaNabT5ndl_cFpEhx1Q4ZLibiSL3wWBmXh" alt="Profile"/>
                </div>
                <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <div className="bg-primary/80 backdrop-blur-sm p-2 rounded-full text-white">
                    <span className="material-symbols-outlined">edit</span>
                  </div>
                  <input className="hidden" type="file"/>
                </label>
              </div>
            </div>
          </div>
          {/* Spacer for overlapping avatar */}
          <div className="h-8"></div>
          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Name</label>
              <input className="w-full bg-surface-container-low border-0 rounded-2xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline-variant font-medium outline-hidden" id="name" type="text" defaultValue="Alex Rivera"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="location">Location</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant">location_on</span>
                <input className="w-full bg-surface-container-low border-0 rounded-2xl pl-12 pr-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline-variant font-medium outline-hidden" id="location" placeholder="e.g. San Francisco, CA" type="text"/>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="bio">Bio</label>
              <textarea className="w-full bg-surface-container-low border-0 rounded-2xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline-variant font-medium resize-none outline-hidden" id="bio" rows="4" defaultValue="Digital curator & design enthusiast. Exploring the intersection of tech and social connection." />
              <p className="text-[10px] text-right text-on-surface-variant pr-2">102 / 160 characters</p>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-3 rounded-full text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors" type="button">
              Cancel
            </button>
            <button className="px-10 py-3 rounded-full primary-gradient text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

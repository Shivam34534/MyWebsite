import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/axios'
import { useAuth, useUser } from '../../mockClerk'
import toast from 'react-hot-toast'
import { fetchUser } from '../../features/user/userSlice'
import { assets } from '../../assets/assets'

const ProfileModal = ({ setShowEdit }) => {
    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [editForm, setEditForm] = useState({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name || '',
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const token = await getToken()
            const formData = new FormData()
            formData.append('username', editForm.username)
            formData.append('bio', editForm.bio)
            formData.append('location', editForm.location)
            formData.append('full_name', editForm.full_name)

            if (editForm.profile_picture) {
                formData.append('profile', editForm.profile_picture)
            }
            if (editForm.cover_photo) {
                formData.append('cover', editForm.cover_photo)
            }

            const { data } = await api.post('/api/user/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                toast.success('Studio updated successfully')
                dispatch(fetchUser(token))
                setShowEdit(false)
            } else {
                toast.error(data.message || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 overflow-hidden'>
            <div className='w-full max-w-2xl bg-surface-container-lowest rounded-[2.5rem] shadow-2xl border border-outline-variant/10 overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col'>
                {/* Header Section */}
                <div className="p-8 border-b border-stone-200/10 flex items-center justify-between bg-stone-50/50">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black font-headline text-on-surface tracking-tighter uppercase">Edit Studio</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">Personalize your creator space</p>
                    </div>
                    <button 
                        onClick={() => setShowEdit(false)}
                        className="p-2.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full text-on-surface-variant transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                <form className='p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar bg-surface-container-lowest' onSubmit={handleSaveProfile}>
                    {/* Visual Media Section */}
                    <div className="flex flex-col gap-6">
                        <div className="relative">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3 block">Gallery Banner</span>
                            <label className="relative group block h-40 md:h-48 rounded-3xl overflow-hidden cursor-pointer border border-stone-200/5 bg-stone-50 shadow-inner">
                                <img 
                                    src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : (user.cover_picture || assets.sample_cover)} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                                    alt="Cover Preview"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                                     <span className="material-symbols-outlined text-white text-3xl mb-1">add_a_photo</span>
                                     <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Update Banner</span>
                                </div>
                                <input type="file" hidden accept="image/*" onChange={(e) => setEditForm({...editForm, cover_photo: e.target.files[0]})} />
                            </label>

                            {/* Avatar Float */}
                            <label className="absolute -bottom-6 left-8 group cursor-pointer">
                                <div className="w-24 h-24 rounded-full border-4 border-surface shadow-2xl overflow-hidden bg-white relative">
                                    <img 
                                        src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : (user.profile_picture || assets.sample_profile)} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                                        alt="Profile Preview"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                         <span className="material-symbols-outlined text-white text-[20px]">edit</span>
                                    </div>
                                </div>
                                <input type="file" hidden accept="image/*" onChange={(e) => setEditForm({...editForm, profile_picture: e.target.files[0]})} />
                            </label>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Creator Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter full name"
                                className="w-full p-4 bg-stone-50 border border-stone-200/10 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-primary/20 transition-all text-on-surface"
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} 
                                value={editForm.full_name} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Unique Alias</label>
                            <input 
                                type="text" 
                                placeholder="Edit username"
                                className="w-full p-4 bg-stone-50 border border-stone-200/10 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-primary/20 transition-all text-on-surface"
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} 
                                value={editForm.username} 
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Editorial Bio</label>
                            <textarea 
                                rows={3}
                                placeholder="Tell your gallery story..."
                                className="w-full p-4 bg-stone-50 border border-stone-200/10 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-primary/20 transition-all text-on-surface resize-none leading-relaxed"
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} 
                                value={editForm.bio} 
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Studio Location</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[20px]">location_on</span>
                                <input 
                                    type="text" 
                                    placeholder="City, Country"
                                    className="w-full p-4 pl-12 bg-stone-50 border border-stone-200/10 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-primary/20 transition-all text-on-surface"
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                                    value={editForm.location} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Controls */}
                    <div className='flex items-center justify-end gap-4 pt-4 pb-2'>
                        <button 
                            onClick={() => setShowEdit(false)} 
                            type='button'
                            className='px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors active:scale-95'
                        > 
                            Discard
                        </button>

                        <button 
                            type='submit' 
                            disabled={loading} 
                            className={`px-10 py-3.5 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                                loading 
                                ? 'bg-surface-container text-on-surface-variant cursor-not-allowed shadow-none' 
                                : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02]'
                            }`}
                        > 
                            {loading ? 'Finalizing...' : 'Update Studio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal
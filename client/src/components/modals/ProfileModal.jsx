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
        <div className='fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-none p-4 overflow-hidden'>
            <div className='w-full max-w-2xl bg-white neo-border neo-shadow-lg overflow-hidden animate-in slide-in-from-bottom-8 duration-500 flex flex-col'>
                {/* Header Section */}
                <div className="p-8 border-b-[4px] border-black flex items-center justify-between bg-stone-50">
                    <div className="flex flex-col gap-1 -rotate-1">
                        <h2 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">STUDIO_CONFIG.EXE</h2>
                        <div className="bg-primary text-black px-2 py-0.5 neo-border text-[8px] font-black uppercase tracking-widest w-fit">VERSION_4.0.1</div>
                    </div>
                    <button 
                        onClick={() => setShowEdit(false)}
                        className="w-12 h-12 neo-border bg-white text-black hover:bg-black hover:text-white transition-all flex items-center justify-center font-black"
                    >
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>

                <form className='p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar bg-white' onSubmit={handleSaveProfile}>
                    {/* Visual Media Section */}
                    <div className="flex flex-col gap-8">
                        <div className="relative">
                            <span className="text-xs font-black uppercase tracking-widest text-black mb-3 block">BANNER_STREAM</span>
                            <label className="relative group block h-40 md:h-48 neo-border overflow-hidden cursor-pointer bg-black p-0.5">
                                <img 
                                    src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : (user.cover_picture || assets.sample_cover)} 
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" 
                                    alt="Cover Preview"
                                />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                     <div className="bg-black text-white px-4 py-2 neo-border rotate-3">
                                        <span className="text-xs font-black uppercase tracking-widest">REPLACE_BANNER</span>
                                     </div>
                                </div>
                                <input type="file" hidden accept="image/*" onChange={(e) => setEditForm({...editForm, cover_photo: e.target.files[0]})} />
                            </label>

                            {/* Avatar Float */}
                            <label className="absolute -bottom-10 left-8 group cursor-pointer z-20">
                                <div className="w-28 h-28 neo-border bg-black p-0.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_#A3E635] transition-all">
                                    <div className="w-full h-full neo-border border-white overflow-hidden bg-white">
                                        <img 
                                            src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : (user.profile_picture || assets.sample_profile)} 
                                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0" 
                                            alt="Profile Preview"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-black text-white w-8 h-8 neo-border flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors shadow-[2px_2px_0_0_#A3E635]">
                                         <span className="material-symbols-outlined text-sm font-black">edit</span>
                                    </div>
                                </div>
                                <input type="file" hidden accept="image/*" onChange={(e) => setEditForm({...editForm, profile_picture: e.target.files[0]})} />
                            </label>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 italic">CREATOR_TAG</label>
                            <input 
                                type="text" 
                                placeholder="FULL NAME"
                                className="w-full p-4 bg-stone-50 neo-border text-sm font-black placeholder:text-black/20 focus:bg-white focus:shadow-[4px_4px_0_0_#000] outline-none transition-all uppercase"
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} 
                                value={editForm.full_name} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 italic">STATION_ALIAS</label>
                            <input 
                                type="text" 
                                placeholder="USERNAME"
                                className="w-full p-4 bg-stone-50 neo-border text-sm font-black placeholder:text-black/20 focus:bg-white focus:shadow-[4px_4px_0_0_#000] outline-none transition-all uppercase"
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} 
                                value={editForm.username} 
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 italic">MISSION_STATEMENT</label>
                            <textarea 
                                rows={2}
                                placeholder="BIOGRAPHY DATA..."
                                className="w-full p-4 bg-stone-50 neo-border text-sm font-black placeholder:text-black/20 focus:bg-white focus:shadow-[4px_4px_0_0_#000] outline-none transition-all uppercase resize-none leading-tight"
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} 
                                value={editForm.bio} 
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1 italic">GEOGRAPHIC_COORDINATES</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-[20px] font-black">location_on</span>
                                <input 
                                    type="text" 
                                    placeholder="CITY, REGION"
                                    className="w-full p-4 pl-12 bg-stone-50 neo-border text-sm font-black placeholder:text-black/20 focus:bg-white focus:shadow-[4px_4px_0_0_#000] outline-none transition-all uppercase"
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                                    value={editForm.location} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Controls */}
                    <div className='flex flex-col md:flex-row items-center justify-end gap-6 pt-4 pb-4'>
                        <button 
                            onClick={() => setShowEdit(false)} 
                            type='button'
                            className='w-full md:w-auto px-10 py-4 text-xs font-black uppercase tracking-widest text-black hover:italic transition-all'
                        > 
                            DISCARD_CHANGES
                        </button>

                        <button 
                            type='submit' 
                            disabled={loading} 
                            className={`neo-button w-full md:w-auto px-12 py-5 text-sm font-black italic shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                                loading 
                                ? 'bg-stone-200 text-black/30 cursor-not-allowed shadow-none' 
                                : 'bg-primary text-black'
                            }`}
                        > 
                            {loading ? 'UPLOADING_DATA...' : 'COMMIT_CHANGES'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default ProfileModal
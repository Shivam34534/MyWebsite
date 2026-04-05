import logo from './Oaura4.svg'
import sample_cover from './sample_cover.jpg'
import sample_profile from './sample_profile.jpg'
import bgImage from './bgImage.png'
import group_users from './group_users.png'
import { Home, MessageCircle, Search, UserIcon, Users } from 'lucide-react'
import sponsored_img from './sponsored_img.png'

export const assets = {
    logo,
    sample_cover,
    sample_profile,
    bgImage,
    group_users,
    sponsored_img
}

export const menuItemsData = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/search', label: 'Search', icon: 'search' },
    { to: '/discover', label: 'Explore', icon: 'explore' },
    { to: '/reels', label: 'Reels', icon: 'movie' },
    { to: '/messages', label: 'Messages', icon: 'chat_bubble' },
    { to: '/notifications', label: 'Notifications', icon: 'favorite' },
    { to: '/profile', label: 'Profile', icon: 'account_circle' },
];
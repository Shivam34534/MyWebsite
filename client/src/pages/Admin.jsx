import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { LayoutGrid, Users, FileText, Settings, Shield, ArrowUpRight, TrendingUp } from 'lucide-react'
import moment from 'moment'

const Admin = () => {
  const user = useSelector((state) => state.user.value)
  const [stats, setStats] = useState({ users: 0, posts: 0, stories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/stats')
        if (data.success) setStats(data.stats)
      } catch (error) {
        console.error("Admin stats failed")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (user?.role !== 'admin') return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
       <Shield className="w-20 h-20 text-red-100 mb-6" />
       <h2 className="text-3xl font-black text-gray-900">Access Denied</h2>
       <p className="text-gray-500 font-medium mt-2">This terminal is restricted to administrators only.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
         <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="text-primary w-8 h-8" />
         </div>
         <div>
            <h1 className="text-4xl font-black text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">System overview and management portal.</p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-primary' },
          { label: 'Feed Posts', value: stats.posts, icon: FileText, color: 'bg-secondary' },
          { label: 'Active Stories', value: stats.stories, icon: TrendingUp, color: 'bg-accent' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 group hover:scale-[1.02] transition-transform">
             <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 shadow-lg shadow-gray-200`}>
                <item.icon className="text-white w-7 h-7" />
             </div>
             <div className="flex items-end justify-between">
                <div>
                   <span className="text-4xl font-black text-gray-900">{item.value}</span>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{item.label}</p>
                </div>
                <ArrowUpRight className="text-gray-200 group-hover:text-primary transition-colors" />
             </div>
          </div>
        ))}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">User Management</h3>
               <button className="button-secondary px-4 py-2 text-xs">View All</button>
            </div>
            <div className="p-8 space-y-4">
               {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-gray-900">Mock User {i}</span>
                           <span className="text-[10px] text-gray-400 font-bold uppercase">user_id: {i*1234}</span>
                        </div>
                     </div>
                     <button className="text-xs font-black text-red-500 hover:underline">SUSPEND</button>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">System Logs</h3>
               <button className="button-secondary px-4 py-2 text-xs">Download</button>
            </div>
            <div className="p-8 space-y-4">
               {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-4 text-xs font-medium text-gray-500 border-l-2 border-primary pl-4 py-1">
                     <span className="font-bold text-gray-900">{moment().subtract(i, 'hours').format('HH:mm')}</span>
                     <span>System backup completed successfully.</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

export default Admin

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { Users, UserPlus, Check, X, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Connections = () => {
  const user = useSelector((state) => state.user.value)
  const [pendingRequests, setPendingRequests] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchConnections = async () => {
    try {
      const { data } = await api.get('/api/user/connections')
      if (data.success) {
        // In this mock, connections/followers might need population, assuming basic ID array for now
        setConnections(data.connections || [])
        // Pending requests usually come from the server as well
        setPendingRequests(data.pendingConnections || [])
      }
    } catch (error) {
      console.error("Failed to fetch connections", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
         <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Users className="text-secondary w-8 h-8" />
         </div>
         <div>
            <h1 className="text-4xl font-black text-gray-900 mb-1">Connections</h1>
            <p className="text-gray-500 font-medium">Build your network and grow your tribe.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pending Requests Section */}
        <div className="md:col-span-1 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending ({pendingRequests.length})</h2>
           </div>

           <div className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((reqId) => (
                  <div key={reqId} className="glass-card bg-white p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 mb-4 overflow-hidden border-2 border-white shadow-sm">
                        <img src="/default-avatar.png" className="w-full h-full object-cover" alt="" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 mb-4 truncate w-full">User {reqId.slice(-4)}</span>
                    <div className="flex gap-2 w-full">
                       <button className="flex-1 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all">Accept</button>
                       <button className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-400 font-bold text-xs hover:bg-gray-100 transition-all"><X size={14} className="mx-auto" /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 text-center">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No new requests</p>
                </div>
              )}
           </div>
        </div>

        {/* Mutual Connections Grid */}
        <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Network ({connections.length})</h2>
              <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                 Manage <ArrowRight size={10} />
              </button>
           </div>

           {loading ? (
             <div className="grid grid-cols-2 gap-4">
               {[1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[2rem] animate-pulse" />)}
             </div>
           ) : connections.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connections.map((connId) => (
                   <div key={connId} className="bg-white rounded-[2rem] border border-gray-100 p-5 flex items-center gap-4 hover:shadow-lg transition-all group cursor-pointer" onClick={() => navigate(`/profile/${connId}`)}>
                      <img 
                        src="/default-avatar.png" 
                        className="w-14 h-14 rounded-[1.2rem] object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" 
                        alt="" 
                      />
                      <div className="flex-1 min-w-0">
                         <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">Connection {connId.slice(-4)}</h3>
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight truncate">Product Designer</p>
                      </div>
                   </div>
                ))}
             </div>
           ) : (
             <div className="p-20 bg-white rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <Sparkles className="text-primary/20 w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Start Connecting</h3>
                <p className="text-gray-500 font-medium mt-2">Browse the discovery feed to find people you know.</p>
                <button className="button-primary mt-8 px-8" onClick={() => navigate('/discover')}>Discover People</button>
             </div>
           )}
        </div>

      </div>
    </div>
  )
}

export default Connections

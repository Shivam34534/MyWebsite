import React from 'react'

const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-6 animate-pulse">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-100" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-2 w-32 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="px-5 pb-3">
        <div className="h-4 w-full bg-gray-50 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-50 rounded" />
      </div>
      <div className="px-4 pb-4">
        <div className="aspect-[4/3] rounded-2xl bg-gray-50" />
      </div>
      <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/30 flex justify-between">
         <div className="flex gap-6">
            <div className="w-6 h-6 rounded-full bg-gray-100" />
            <div className="w-6 h-6 rounded-full bg-gray-100" />
            <div className="w-6 h-6 rounded-full bg-gray-100" />
         </div>
         <div className="w-6 h-6 rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

export default PostSkeleton

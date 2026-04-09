import React from 'react'

const PostSkeleton = () => {
    return (
        <div className='neo-box bg-white w-full max-w-[640px] mx-auto overflow-hidden animate-pulse'>
            {/* Header Skeleton */}
            <div className='p-4 flex items-center justify-between border-b-4 border-black bg-main/20'>
                <div className="flex items-center gap-3">
                    <div className='w-12 h-12 neo-box bg-black/10' />
                    <div className='flex flex-col gap-2'>
                        <div className='w-24 h-4 bg-black/10' />
                        <div className='w-16 h-3 bg-black/5' />
                    </div>
                </div>
            </div>

            {/* Media Skeleton */}
            <div className='aspect-square w-full bg-black/5 border-b-4 border-black' />

            {/* Content Skeleton */}
            <div className='p-6 flex flex-col gap-6'>
                <div className='flex gap-4'>
                    <div className='w-10 h-10 neo-box bg-black/10' />
                    <div className='w-10 h-10 neo-box bg-black/10' />
                    <div className='w-10 h-10 neo-box bg-black/10' />
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='w-3/4 h-5 bg-black/10' />
                    <div className='w-full h-4 bg-black/5' />
                    <div className='w-1/2 h-4 bg-black/5' />
                </div>
                <div className='pt-4 border-t-2 border-dashed border-black/10'>
                    <div className='w-20 h-3 bg-black/5' />
                </div>
            </div>
        </div>
    )
}

export default PostSkeleton

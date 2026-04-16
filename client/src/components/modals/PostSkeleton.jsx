import React from 'react'

const PostSkeleton = () => {
    return (
        <div className='bg-white neo-border neo-shadow w-full max-w-[640px] mx-auto overflow-hidden animate-pulse'>
            {/* Header Skeleton */}
            <div className='p-4 flex items-center gap-3 border-b-[3px] border-black bg-stone-50'>
                <div className='w-12 h-12 neo-border bg-stone-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' />
                <div className='flex flex-col gap-2'>
                    <div className='w-24 h-4 bg-stone-200 neo-border' />
                    <div className='w-16 h-3 bg-stone-100 neo-border' />
                </div>
            </div>

            {/* Media Skeleton */}
            <div className='aspect-square w-full bg-stone-200 border-b-[3px] border-black' />

            {/* Actions Skeleton */}
            <div className='p-5 flex items-center justify-between'>
                <div className='flex items-center gap-6'>
                    <div className='w-10 h-10 neo-border bg-stone-200 shadow-[3px_3px_0px_0px_#000]' />
                    <div className='w-10 h-10 neo-border bg-stone-200 shadow-[3px_3px_0px_0px_#000]' />
                    <div className='w-10 h-10 neo-border bg-stone-200 shadow-[3px_3px_0px_0px_#000]' />
                </div>
                <div className='w-10 h-10 neo-border bg-stone-200 shadow-[3px_3px_0px_0px_#000]' />
            </div>

            {/* Content Skeleton */}
            <div className='px-5 pb-6 flex flex-col gap-3'>
                <div className='w-20 h-5 bg-stone-200 neo-border' />
                <div className='w-full h-4 bg-stone-100 neo-border' />
                <div className='w-3/4 h-4 bg-stone-100 neo-border' />
            </div>
        </div>
    )
}

export default PostSkeleton

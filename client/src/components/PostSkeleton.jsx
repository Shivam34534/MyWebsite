import React from 'react'

const PostSkeleton = () => {
    return (
        <div className='bg-white sm:border border-gray-200 sm:rounded-lg sm:my-3 w-full max-w-[550px] mx-auto overflow-hidden animate-pulse'>
            {/* Header Skeleton */}
            <div className='px-3 py-3 flex items-center gap-2.5'>
                <div className='w-[42px] h-[42px] rounded-full bg-gray-200' />
                <div className='flex flex-col gap-1.5'>
                    <div className='w-24 h-3 bg-gray-200 rounded' />
                    <div className='w-16 h-2 bg-gray-100 rounded' />
                </div>
            </div>

            {/* Media Skeleton */}
            <div className='aspect-square w-full bg-gray-200' />

            {/* Actions Skeleton */}
            <div className='px-3 py-4 flex items-center gap-4'>
                <div className='w-7 h-7 bg-gray-200 rounded-full' />
                <div className='w-7 h-7 bg-gray-200 rounded-full' />
                <div className='w-7 h-7 bg-gray-200 rounded-full' />
            </div>

            {/* Content Skeleton */}
            <div className='px-3 pb-4 flex flex-col gap-2'>
                <div className='w-20 h-3 bg-gray-200 rounded' />
                <div className='w-full h-3 bg-gray-100 rounded' />
                <div className='w-3/4 h-3 bg-gray-100 rounded' />
                <div className='w-32 h-2 bg-gray-50 rounded mt-1' />
            </div>
        </div>
    )
}

export default PostSkeleton

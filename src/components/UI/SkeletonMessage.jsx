import React from 'react'

export default function SkeletonMessage({ side='left' }){
  return (
    <div className={`flex items-start space-x-3 ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
      {side === 'left' && (
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse flex-shrink-0"></div>
      )}
      <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm animate-pulse ${
        side === 'right'
          ? 'bg-blue-200 dark:bg-blue-800 rounded-br-md'
          : 'bg-gray-200 dark:bg-gray-700 rounded-bl-md'
      }`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
      {side === 'right' && (
        <div className="w-8 h-8 bg-blue-300 dark:bg-blue-700 rounded-full animate-pulse flex-shrink-0"></div>
      )}
    </div>
  )
}

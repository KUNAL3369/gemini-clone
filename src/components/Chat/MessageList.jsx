import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import toast from 'react-hot-toast'

export default function MessageList({ messages = [], typing }) {
  const ref = useRef()
  const pageSize = 20
  const [page, setPage] = useState(1)

  // Determine messages to display for current page
  const displayed = messages.slice(-page * pageSize)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, typing])

  // Reverse infinite scroll: load older messages when scroll to top
  const onScroll = (e) => {
    const el = e.target
    if (el.scrollTop < 60 && displayed.length < messages.length) {
      const oldHeight = el.scrollHeight
      setPage((p) => p + 1)
      setTimeout(() => {
        // Maintain scroll position after prepending older messages
        el.scrollTop = el.scrollHeight - oldHeight
      }, 0)
    }
  }

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="flex-1 overflow-auto px-4 py-3 flex flex-col space-y-4"
    >
      {displayed.map((m) => (
        <div
          key={m.id}
          className={`flex items-start space-x-3 group ${
            m.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {m.role === 'assistant' && (
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">🤖</span>
            </div>
          )}
          <div
            className={`max-w-[70%] p-4 rounded-2xl shadow-sm break-words relative ${
              m.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
            }`}
          >
            {m.image && (
              <img
                src={m.image}
                alt="Uploaded image"
                className="mb-3 w-48 h-auto rounded-lg"
              />
            )}
            <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
            <div className={`text-xs mt-2 flex items-center justify-between ${
              m.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span>{dayjs(m.createdAt).format('HH:mm')}</span>
              <button
                onClick={() => {
                  copy(m.text || '')
                  toast.success('Copied to clipboard')
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black hover:bg-opacity-10 ${
                  m.role === 'user' ? 'hover:bg-white hover:bg-opacity-20' : ''
                }`}
                title="Copy message"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                </svg>
              </button>
            </div>
          </div>
          {m.role === 'user' && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">👤</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

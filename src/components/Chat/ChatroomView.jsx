import React, { useRef, useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { simulateAIReply } from '../../utils/aiSimulator'
import SkeletonMessage from '../UI/SkeletonMessage'
import toast from 'react-hot-toast'

export default function ChatroomView() {
  const { chatrooms, selectedChatId, sendMessage, pushAIMessage, toggleSidebar } = useStore()
  const chat = chatrooms.find(c => c.id === selectedChatId)
  const [typing, setTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages, typing, selectedChatId])

  // Simulate loading on chat switch
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [selectedChatId])

  const onSend = (message) => {
    if (!chat) return

    sendMessage(chat.id, message)
    toast.success('Message sent!')

    setTyping(true)
    const aiTypingTimeout = setTimeout(() => {
      simulateAIReply(message.text, (reply) => {
        pushAIMessage(chat.id, reply)
        setTyping(false)
      })
    }, 1500)

    return () => clearTimeout(aiTypingTimeout)
  }

  if (!chat) return <div className="p-4">No chat selected</div>

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-100 dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🤖</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {chat.title}
            </h1>
          </div>
          <div></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900">
          {loading ? (
            <div className="space-y-4">
              <SkeletonMessage side="left" />
              <SkeletonMessage side="right" />
              <SkeletonMessage side="left" />
            </div>
          ) : (
            <>
              <MessageList messages={chat.messages} />
              {typing && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">🤖</span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                        Gemini is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-4 bg-gray-100 dark:bg-gray-900">
          <MessageInput onSend={onSend} />
        </div>
      </div>
    </div>
  )
}

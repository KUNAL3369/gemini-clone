import React, { useEffect } from 'react'
import useStore from '../store/useStore'
import ChatroomList from '../components/Dashboard/ChatroomList'
import ChatroomView from '../components/Chat/ChatroomView'
import { Toaster } from 'react-hot-toast'

export default function ChatLayout() {
  const { user, dark, setDark, logout, sidebarVisible } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        document.getElementById('chat-search')?.focus()
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('open-create-chat'))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Toaster />

      {/* Sidebar */}
      <div className={`w-80 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col ${sidebarVisible ? '' : 'hidden'}`}>
        {/* Sidebar Header */}
        <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div className="font-bold uppercase text-lg">Chatrooms</div>
          <button onClick={() => setDark(!dark)} className="btn" aria-pressed={dark}>
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Chatroom list */}
        <div className="flex-1 overflow-auto">
          <ChatroomList />
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium">{user?.phone}</span>
          <button className="btn btn-sm bg-red-500 hover:bg-red-600" onClick={() => { logout(); window.location.reload(); }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        <ChatroomView />
      </div>
    </div>
  )
}

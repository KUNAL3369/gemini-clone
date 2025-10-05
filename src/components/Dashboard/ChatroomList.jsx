import React, { useState, useMemo, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

export default function ChatroomList() {
  const { chatrooms, selectedChatId, selectChat, createChatroom, deleteChatroom } = useStore()
  const [q, setQ] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [newName, setNewName] = useState('')
  const searchRef = useRef()

  // Listen for create chat event (Ctrl+N)
  useEffect(() => {
    const openCreate = () => setShowCreate(true)
    document.addEventListener('open-create-chat', openCreate)
    return () => document.removeEventListener('open-create-chat', openCreate)
  }, [])

  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase()
    if (!v) return chatrooms
    return chatrooms.filter(c => c.title.toLowerCase().includes(v))
  }, [chatrooms, q])

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createChatroom(title.trim())
    setTitle('')
    setShowCreate(false)
    toast.success('Chatroom created!')
  }

  const handleRename = (id, name) => {
    setEditingId(id)
    setNewName(name)
  }

  const saveRename = (id) => {
    if (!newName.trim()) return
    useStore.setState({
      chatrooms: useStore.getState().chatrooms.map(c =>
        c.id === id ? { ...c, title: newName } : c
      )
    })
    toast.success('Chatroom renamed!')
    setEditingId(null)
  }

  const handleDelete = (id) => {
    deleteChatroom(id)
    toast.success('Chatroom deleted!')
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chatrooms
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your conversations
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              id="chat-search"
              ref={searchRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search chatrooms..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-none"
              aria-label="search chats"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => setShowCreate(s => !s)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center space-x-2"
            aria-expanded={showCreate}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chatroom</span>
          </button>

          {showCreate && (
            <form onSubmit={submit} className="space-y-3">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter chatroom title"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2" role="list">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {q ? 'No chatrooms found' : 'No chatrooms yet'}
            </p>
          </div>
        ) : (
          filtered.map(c => (
            <div
              key={c.id}
              role="listitem"
              tabIndex={0}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                c.id === selectedChatId
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
              onClick={() => selectChat(c.id)}
              onKeyDown={e => { if (e.key === 'Enter') selectChat(c.id) }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    c.id === selectedChatId ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    <span className="text-white text-sm font-semibold">
                      {c.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {editingId === c.id ? (
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onBlur={() => saveRename(c.id)}
                      onKeyDown={e => e.key === 'Enter' && saveRename(c.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${
                        c.id === selectedChatId ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`}>
                        {c.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {c.messages?.length || 0} messages
                      </p>
                    </div>
                  )}
                </div>

                <div className={`flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  c.id === selectedChatId ? 'opacity-100' : ''
                }`}>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    onClick={e => { e.stopPropagation(); handleRename(c.id, c.title) }}
                    title="Rename"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    onClick={e => { e.stopPropagation(); handleDelete(c.id) }}
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

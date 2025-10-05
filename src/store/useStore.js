import create from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

const useStore = create(persist((set,get) => ({
  user: null,
  chatrooms: [{ id: 'inbox', title: 'General', createdAt: Date.now(), messages: [] }],
  selectedChatId: 'inbox',
  dark: false,
  setDark: (d) => set({ dark: d }),
  sidebarVisible: true,
  toggleSidebar: () => set(state => ({ sidebarVisible: !state.sidebarVisible })),
  login: (u) => set({ user: u }),
  logout: () => set({ user: null }),
  createChatroom: (title) => {
    const id = uuidv4()
    set(state => ({ chatrooms: [{ id, title, createdAt: Date.now(), messages: [] }, ...state.chatrooms], selectedChatId: id }))
  },
  deleteChatroom: (id) => {
    set(state => {
      const chatrooms = state.chatrooms.filter(c => c.id !== id)
      const selectedChatId = state.selectedChatId === id ? (chatrooms[0]?.id ?? null) : state.selectedChatId
      return { chatrooms, selectedChatId }
    })
  },
  selectChat: (id) => set({ selectedChatId: id }),
  sendMessage: (chatId, message) => {
    const msg = { id: uuidv4(), role: 'user', text: message.text || '', createdAt: Date.now(), image: message.image || null }
    set(state => ({ chatrooms: state.chatrooms.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c) }))
    return msg
  },
  pushAIMessage: (chatId, text) => {
    const msg = { id: uuidv4(), role: 'ai', text, createdAt: Date.now() }
    set(state => ({ chatrooms: state.chatrooms.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c) }))
  }
}), { name: 'gemini-storage' }))

export default useStore

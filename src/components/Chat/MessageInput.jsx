import React, { useState, useRef, useEffect } from 'react'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleImage = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(f)
  }

  const submit = (e) => {
    e?.preventDefault()
    if (!text.trim() && !image) return
    onSend({ text: text.trim(), image })
    setText('')
    setImage(null)
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {image && (
        <div className="mb-3 flex items-center space-x-2">
          <img
            src={image}
            alt="Image preview"
            className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
            title="Remove image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <form
        onSubmit={submit}
        className="flex items-end space-x-3"
        aria-label="message form"
      >
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            aria-label="message input"
          />
          <label
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-label="upload image"
            title="Upload image"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>
        </div>
        <button
          type="submit"
          disabled={!text.trim() && !image}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  )
}

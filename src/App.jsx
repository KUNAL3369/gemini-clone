import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore'
import OTPForm from './components/Auth/OTPForm'
import ChatLayout from './layouts/ChatLayout'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const { user, login } = useStore()
  const [countries, setCountries] = useState([])

  useEffect(() => {
    let mounted = true
    async function fetchCountries() {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all')
        const data = await res.json()
        const mapped = data
          .map((c) => {
            const root = c.idd?.root ?? ''
            const suf =
              Array.isArray(c.idd?.suffixes) && c.idd.suffixes.length
                ? c.idd.suffixes[0]
                : ''
            const dial = root + suf || ''
            return {
              code: c.cca2,
              dial: dial ? `+${dial}` : '+91',
              label: `${dial ? `+${dial}` : '+91'} ${c.name.common}`,
            }
          })
          .sort((a, b) => a.label.localeCompare(b.label))
        if (mounted) setCountries(mapped)
      } catch {
        if (mounted)
          setCountries([
            { code: 'IN', dial: '+91', label: '+91 India' },
            { code: 'US', dial: '+1', label: '+1 USA' },
            { code: 'GB', dial: '+44', label: '+44 UK' },
          ])
      }
    }
    fetchCountries()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/chat" />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
              <OTPForm countries={countries} login={login} />
              <Toaster />
            </div>
          )
        }
      />
      <Route path="/chat" element={user ? <ChatLayout /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

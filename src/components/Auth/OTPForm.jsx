import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import useStore from '../../store/useStore'
import { useNavigate } from 'react-router-dom'   // ✅ import navigate

const schema = z.object({
  countryCode: z.string().min(1, 'Country code required'),
  phone: z.string().min(6, 'Phone number required'),
  code: z.string().optional(),
})

const OTPForm = ({ countries: propCountries }) => {
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [countries, setCountries] = useState(propCountries || [])
  const [showOtp, setShowOtp] = useState(false)
  const [resendAvailable, setResendAvailable] = useState(false)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)

  const { register, handleSubmit, reset, setValue, setFocus, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { countryCode: '+91', phone: '', code: '' },
  })

  const { login } = useStore()      // ✅ use login from zustand
  const navigate = useNavigate()    // ✅ hook to redirect

  useEffect(() => {
    if (propCountries?.length) return
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,idd')
        if (!res.ok) throw new Error('Failed to fetch countries')
        const data = await res.json()
        const sorted = data
          .map(c => ({
            name: c.name.common,
            code: c.idd?.root + (c.idd?.suffixes?.[0] || ''),
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        setCountries(sorted)
        const india = sorted.find(c => c.name === 'India')
        if (india) setValue('countryCode', india.code)
      } catch (err) {
        console.error(err)
        setCountries([
          { name: 'India', code: '+91' },
          { name: 'UK', code: '+44' },
          { name: 'USA', code: '+1' },
        ])
        setValue('countryCode', '+91')
      }
    }
    fetchCountries()
  }, [propCountries, setValue])

  const startOtpTimer = () => {
    setShowOtp(true)
    setResendAvailable(false)
    setTimer(30)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setShowOtp(false)
          setOtp('')
          setValue('code', '')
          toast.error('OTP expired. Please request again.')
          setResendAvailable(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const sendOTP = (data) => {
    if (!data.phone) {
      toast.error('Please enter phone number')
      return
    }
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setOtp(generatedOTP)
    setStep('otp')
    toast.success(`OTP: ${generatedOTP} (valid for 30 seconds)`)
    setFocus('code')
    startOtpTimer()
  }

  const resendOTP = () => {
    const data = getValues()
    sendOTP(data)
  }

  const verifyOTP = (data) => {
    if (data.code === otp) {
      clearInterval(timerRef.current)
      login({ phone: data.phone, countryCode: data.countryCode })  // ✅ store user
      toast.success('Logged in successfully!')
      reset()
      setStep('phone')
      setOtp('')
      navigate('/chat')   // ✅ redirect to chat
    } else {
      toast.error('Invalid OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💬</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Gemini Clone
          </h2>
          <p className="text-blue-700">
            {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSubmit(sendOTP)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country Code
              </label>
              <select
                {...register('countryCode')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(verifyOTP)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                {...register('code')}
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg tracking-widest"
              />
            </div>
            {showOtp && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  OTP valid for
                </p>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {timer}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  seconds remaining
                </p>
              </div>
            )}
            {resendAvailable && (
              <button
                type="button"
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={resendOTP}
              >
                Resend OTP
              </button>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify & Continue
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default OTPForm

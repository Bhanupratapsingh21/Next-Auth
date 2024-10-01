"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { Message } from "postcss";


 interface ApiResponse{
  success : boolean;
  message: string;
  isAcceptingMessages?:boolean;
  messages? : Array<Message>
}


const Page = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)

  const [formMessage, setFormMessage] = useState("") // To show error or success messages
  const router = useRouter()

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || "Error Checking Username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', { username, email, password })
      setFormMessage(response.data.message)
      router.replace(`/`)
      setIsSubmitting(false)
    } catch (error) {
      console.log("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      setFormMessage(axiosError.response?.data.message || "Signup failed")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        {formMessage && (
          <p className={`text-center ${formMessage.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {formMessage}
          </p>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                debounced(e.target.value)
              }}
              className="w-full px-4 py-2 border rounded-md"
            />
            {isCheckingUsername && <h2>loading</h2>}
            {!isCheckingUsername && usernameMessage && (
              <p
                className={`text-sm ${usernameMessage === 'Username is unique'
                  ? 'text-green-500'
                  : 'text-red-500'
                  }`}
              >
                {usernameMessage}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <button type="submit" className='w-full bg-blue-600 text-white py-2 rounded-md' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <h2>loading</h2>
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page

"use client"
import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { Message } from "postcss";

interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}

const Page = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const [code, setCode] = useState("")
    const [formMessage, setFormMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/Verify-Code", {
                username: params.username,
                code
            })

            setFormMessage(response.data.message)
            router.replace('/sign-in')

        } catch (error) {
            console.log("Error in verifying user", error)
            const axiosError = error as AxiosError<ApiResponse>
            setFormMessage(axiosError.response?.data.message || "Verification failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                {formMessage && (
                    <p className={`text-center ${formMessage.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                        {formMessage}
                    </p>
                )}
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium">Verification Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            placeholder="Code"
                        />
                    </div>
                    <button type="submit" className='w-full bg-blue-600 text-white py-2 rounded-md' disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <h2>loaders</h2>
                                Please wait
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Page
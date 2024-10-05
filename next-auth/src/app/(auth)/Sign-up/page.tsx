"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // OAuth sign-in

interface ApiResponse {
  success: boolean;
  message: string;
}

const Page = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state for OAuth sign-in

  const [formMessage, setFormMessage] = useState(''); // To show error or success messages
  const router = useRouter();

  // Handles sign-up form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', { username, email, password });
      setFormMessage(response.data.message);
      if (response.data.success) {
        router.replace(`/`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setFormMessage(axiosError.response?.data.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md bg-white">
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
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <p className="text-muted text-gray-400 text-sm">We will send you a verification code</p>
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-3 space-y-3">
          <button
            onClick={async () => {
              setLoading(true);
              const result = await signIn('google', { redirect: true, callbackUrl: '/' });
              setLoading(false);
              console.log('Google sign-in result:', result);
            }}
            className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
            type="button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <button
            onClick={async () => {
              setLoading(true);
              const result = await signIn('github', { redirect: true, callbackUrl: '/' });
              setLoading(false);
              console.log('GitHub sign-in result:', result);
            }}
            className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
            type="button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in with GitHub'}
          </button>
        </div>

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
  );
};

export default Page;

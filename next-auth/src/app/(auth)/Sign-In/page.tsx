'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

type SignInFormValues = {
    identifier: string;
    password: string;
};

export default function SignInForm() {
    const router = useRouter();

    const [formData, setFormData] = useState<SignInFormValues>({
        identifier: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission

        // Basic client-side validation
        let validationErrors: { identifier?: string; password?: string } = {};
        if (!formData.identifier) {
            validationErrors.identifier = 'Email/Username is required';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const result = await signIn('credentials', {
            redirect: false,
            identifier: formData.identifier,
            password: formData.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                alert('Incorrect username or password');
            } else {
                alert('Error');
            }
        }

        if (result?.url) {
            router.replace('/');
        }
    };

    const handleProviderSignIn = async (provider: string) => {
        await signIn(provider, { redirect: false });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email/Username</label>
                        <input
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Email or Username"
                        />
                        {errors.identifier && (
                            <p className="text-sm text-red-600">{errors.identifier}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Password"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>
                        Or sign in with
                        <button onClick={() => handleProviderSignIn('github')} className="text-blue-600 hover:text-blue-800 mx-2">
                            GitHub
                        </button>
                        <button onClick={() => handleProviderSignIn('google')} className="text-blue-600 hover:text-blue-800">
                            Google
                        </button>
                    </p>
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

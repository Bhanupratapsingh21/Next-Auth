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

    const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});
    const [loading, setLoading] = useState(false);

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

        setLoading(true); // Show loading state during sign-in

        const result = await signIn('credentials', {
            redirect: false, // No automatic redirect
            identifier: formData.identifier,
            password: formData.password,
        });

        setLoading(false); // Hide loading state after sign-in

        if (result?.error) {
            switch (result.error) {
                case 'CredentialsSignin':
                    setErrors({ form: 'Invalid username or password' });
                    break;
                default:
                    setErrors({ form: 'An unexpected error occurred' });
            }
        } else {
            router.replace('/'); // Redirect to home after successful sign-in
        }
    };


    return (
        <>
            <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
                <div className="xl:mx-auto bg-white  text-black xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md">
                    <h2 className="text-center text-2xl font-bold leading-tight text-black">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don&apos;t have an account? Create a free account
                    </p>
                    <form onSubmit={onSubmit} className="mt-8" method="POST" action="#">
                        <div className="space-y-5">
                            <div>
                                <label className="text-base font-medium text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        name="identifier"
                                        placeholder="Email"
                                        value={formData.identifier}
                                        onChange={handleChange}
                                        type="email"
                                        aria-label="Email address"
                                        className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                {errors.identifier && (
                                    <p className="text-sm text-red-600">{errors.identifier}</p>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="text-base font-medium text-gray-900">
                                        Password
                                    </label>
                                    <a
                                        className="text-sm font-semibold text-black hover:underline"
                                        title="Forgot password?"
                                        href="#"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="mt-2">
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        type="password"
                                        aria-label="Password"
                                        className="flex h-10 w-full rounded-md border  bg-transparent px-3 py-2 text-sm"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>
                            {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
                            <div>
                                <button
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 disabled:opacity-50"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Get started'}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="mt-3 space-y-3">
                        <button
                            onClick={async () => {
                                const result = await signIn('google', { redirect: true, callbackUrl: '/' });
                                console.log('Google sign-in result:', result);
                            }}

                            className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
                            type="button"
                            disabled={loading}
                        >

                            Sign in with Google
                        </button>
                        <button
                            onClick={() => signIn('github', { redirect: true, callbackUrl: '/' })}
                            className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
                            type="button"
                            disabled={loading}
                        >

                            Sign in with GitHub
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

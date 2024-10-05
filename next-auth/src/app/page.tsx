'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';



export default function HomePage() {

  const { data: session, status } = useSession();
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          ClientComponent {status}{' '}
          {status === 'authenticated' && session.user?.username}
        </div>
        <p className="mb-4 text-xl">Welcome, {session.user?.username || session.user?.name || "User"}</p>
        <button onClick={() => signOut()}> Signout </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="mb-4 text-lg">You are not signed in</p>
      <div className="flex space-x-4">
        <Link href="/sign-In">

          Sign In

        </Link>
        <Link href="/sign-up">

          Sign Up

        </Link>
      </div>
    </div>
  );
}

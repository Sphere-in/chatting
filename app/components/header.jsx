'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          Dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </nav>
    </header>
  )
}


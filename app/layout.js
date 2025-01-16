import './globals.css'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers'
import { SocketProvider } from '@/components/SocketProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'User Auth Dashboard',
  description: 'A modern user authentication and dashboard app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {/* <SocketProvider> */}
          {children}
          {/* </SocketProvider> */}
          </NextAuthProvider>
      </body>
    </html>
  )
}


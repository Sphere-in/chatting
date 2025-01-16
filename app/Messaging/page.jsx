// Messaging page 
import React from 'react'
import Chat from '@/components/Chat'
import { SocketProvider } from '@/components/SocketProvider'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
        <SocketProvider>
        <Chat/>
        </SocketProvider>
    </div>
  )
}

export default page
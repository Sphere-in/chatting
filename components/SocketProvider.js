'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || ''; // Add environment variable
    const newSocket = io(socketUrl, {
      path: "/api/socket",
      transports: ["websocket"], // Force WebSocket transport
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server:', newSocket.id);
    });

    newSocket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log('Socket.IO client disconnected');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getRedisClient } from '@/lib/redis';

export const dynamic = 'force-dynamic';

let io; // Keep a global reference to the Socket.IO server

export async function GET(req) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');

    const pubClient = await getRedisClient();
    const subClient = pubClient.duplicate();

    io = new Server(res.socket.server, {
      path: '/api/socket',
      transports: ['websocket'], // Force WebSocket transport
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
      console.log('New client connected');
      socket.on('send-message', async (message) => {
        console.log('Message received:', message);
        io.to(message.receiver).emit('receive-message', message);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io; // Attach server instance to res.socket
  } else {
    console.log('Socket.IO server already initialized');
  }

  return new Response("Socket is set up", { status: 200 });
}


export const config = {
  api: {
    bodyParser: false,
  },
};

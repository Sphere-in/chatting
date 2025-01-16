// import { Server as SocketIOServer } from 'socket.io'
// import { createAdapter } from '@socket.io/redis-adapter'
// import { getRedisClient } from '@/lib/redis'

// let io

// export async function GET(req) {
//   if (io) {
//     return new Response('Socket is already running', { status: 200 })
//   }

//   const responseStream = new TransformStream()
//   const writer = responseStream.writable.getWriter()
//   const encoder = new TextEncoder()

//   const pubClient = await getRedisClient()
//   const subClient = pubClient.duplicate()

//   io = new SocketIOServer({
//     path: '/api/socketio',
//     addTrailingSlash: false,
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//     },
//   })

//   io.adapter(createAdapter(pubClient, subClient))

//   io.on('connection', (socket) => {
//     console.log('New client connected')

//     socket.on('send-message', async (message) => {
//       console.log('Message received:', message)
//       io.emit('receive-message', message)
//     })

//     socket.on('disconnect', () => {
//       console.log('Client disconnected')
//     })
//   })

//   writer.write(encoder.encode('Socket.IO server initialized'))
//   writer.close()

//   return new Response(responseStream.readable, {
//     headers: {
//       'Content-Type': 'text/plain',
//     },
//   })
// }

// export const dynamic = 'force-dynamic'


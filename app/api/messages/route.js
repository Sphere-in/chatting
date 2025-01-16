// Message API (app/api/messages/route.js)
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import clientPromise from '@/lib/mongodb'
import { getRedisClient } from '@/lib/redis'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { receiver, content } = await req.json()
  const sender = session.user.id

  const client = await clientPromise
  const db = client.db("chatapp")
  const redisClient = await getRedisClient()

  const message = { sender, receiver, content, timestamp: new Date() }
  await db.collection("messages").insertOne(message)
  
  // Invalidate cache for this conversation
  await redisClient.del(`messages:${sender}:${receiver}`)
  await redisClient.del(`messages:${receiver}:${sender}`)
  
  return new Response(JSON.stringify(message), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { searchParams } = new URL(req.url)
  const receiver = searchParams.get('receiver')
  const sender = session.user.id

  const client = await clientPromise
  const db = client.db("chatapp")
  const redisClient = await getRedisClient()

  const cacheKey = `messages:${sender}:${receiver}`
  
  // Try to get messages from cache
  const cachedMessages = await redisClient.get(cacheKey)
  if (cachedMessages) {
    return new Response(cachedMessages, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  // If not in cache, get from MongoDB
  const messages = await db.collection("messages")
    .find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    })
    .sort({ timestamp: 1 })
    .toArray()
  
  // Cache the messages
  await redisClient.set(cacheKey, JSON.stringify(messages), {
    EX: 300 // Expire after 5 minutes
  })
  
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}


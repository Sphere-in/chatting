'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from './SocketProvider';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatKey, setChatKey] = useState(0); // State for forcing re-render
  const { data: session } = useSession();
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   if (session && socket) {
  //     fetchUsers();

  //     socket.on('receive-message', (newMessage) => {
  //       console.log('New message received:', newMessage);

  //       // Update messages if it belongs to the current chat
  //       if (newMessage.sender === selectedUser?.id || newMessage.receiver === selectedUser?.id) {
  //         setMessages((prevMessages) => [...prevMessages, newMessage]);
  //       }

  //       // Trigger component reload
  //       setChatKey((prevKey) => prevKey + 1);

  //       scrollToBottom();
  //     });

  //     return () => {
  //       socket.off('receive-message');
  //     };
  //   }
  // }, [session, socket, selectedUser]);

  // useEffect(() => {
  //   if (selectedUser) {
  //     fetchMessages();
  //   }
  // }, [selectedUser]);


  useEffect(() => {
    if (session && socket) {
      fetchUsers();
      // Fetch messages once when a user is selected
      fetchMessages();
  
      // Listen for new messages via WebSocket
      socket.on('receive-message', (newMessage) => {
        console.log('New message received:', newMessage);
  
        // Update the messages state if the new message belongs to the selected user
        if (newMessage.sender === selectedUser?.id || newMessage.receiver === selectedUser?.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom(); // Ensure new messages are visible
        }
      });
  
      // Cleanup WebSocket listener on unmount or user change
      return () => {
        socket.off('receive-message');
      };
    }
  }, [session, socket, selectedUser]);
  
  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.filter((user) => user.id !== session.user.id));
  };

  const fetchMessages = async () => {
    if (selectedUser) {
      const res = await fetch(`/api/messages?receiver=${selectedUser.id}`);
      const data = await res.json();
      setMessages(data);
      scrollToBottom(); // Ensure messages are scrolled to the bottom initially
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser && socket && session) {
      const messageData = {
        sender: session.user.id,
        receiver: selectedUser.id,
        content: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit('send-message', messageData);

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          console.error('Failed to send message');
        } else {
          setMessages((prevMessages) => [...prevMessages, messageData]);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!session) {
    return <div>Please sign in to use the chat.</div>;
  }

  return (
    <div key={chatKey} className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r">
        <h2 className="text-2xl font-bold p-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`p-4 hover:bg-gray-100 cursor-pointer ${
                selectedUser?.id === user.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-white p-4 border-b">
              <h3 className="text-xl font-bold">{selectedUser.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.sender === session.user.id ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === session.user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="bg-white p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border rounded-l-lg p-2"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useChatContext } from '../components/chat_context';
import { io, Socket } from 'socket.io-client';
import { useSession } from "next-auth/react";
import { get_messages } from '../lib/server_actions/Chat_SA';


interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: Date;
}

export default function Chat() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const { data: session } = useSession();
    const { selectedFriend } = useChatContext();

    useEffect(() => {
        if (session?.user?.id) {
            const newSocket = io('http://192.168.1.103:3001', {
                auth: {
                    user_id: session.user.id,
                },
            });
            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (socket) {
            socket.on('private message', (message: Message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                socket.off('private message');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (selectedFriend?.id && session?.user?.id) {
            get_messages(session.user.id, selectedFriend.id)
                .then((messages) => {
                    setMessages(messages);
                });
        }
    }, [selectedFriend?.id, session?.user?.id]);

    const sendMessage = useCallback(() => {
        if (socket && inputMessage && selectedFriend?.id && session?.user?.id) {
            const messageData = {
                id: Date.now().toString(), 
                recipientId: selectedFriend.id,
                senderId: session.user.id,
                content: inputMessage,
                createdAt: new Date(),
            };
            socket.emit('private message', messageData);
            setMessages(prevMessages => [...prevMessages, messageData]);
            setInputMessage('');
        }
    }, [socket, inputMessage, selectedFriend?.id, session?.user?.id]);

    return (
        <div className="h-[93vh] w-full bg-slate-200 flex flex-col">
            <div className="flex items-center bg-slate-600 text-white p-4 shadow-md">
                <Image
                    className="rounded-full"
                    src={selectedFriend?.image || '/default.jpg'}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                />
                <h2 className="text-2xl font-semibold ml-4">{selectedFriend?.display_name || "Select a friend"}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
                {messages.map((message) => (
                    <div key={message.id} className={`mb-2 ${message.senderId === session?.user?.id ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${message.senderId === session?.user?.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {message.content}
                        </span>
                    </div>
                ))}
            </div>
            <div className="bg-white p-4 shadow-t-md">
                <div className="flex">
                    <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..." 
                        className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={sendMessage}
                        disabled={!inputMessage || !selectedFriend}
                        className="bg-blue-500 text-lg text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
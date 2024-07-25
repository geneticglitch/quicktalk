"use client"
import React from 'react';
import Image from 'next/image';
import { useChatContext } from '../components/chat_context';

export default function Chat(){

    const { selectedFriend } = useChatContext();

    return (
        <div className="h-[93vh] w-full bg-slate-200 flex flex-col">
            <div className="flex items-center bg-slate-600 text-white p-4 shadow-md">
            <Image
                    className="rounded-full"
                    src={selectedFriend?.image || '/default.jpg'}
                    alt="Profile Picture"
                    width={40}
                    height={38}
                  ></Image>
                <h2 className="text-2xl font-semibold ml-4">{selectedFriend?.display_name || "Select Friend"}</h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4">

            </div>

            <div className="bg-white p-4 shadow-t-md">
                <div className="flex">
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-500 text-lg text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
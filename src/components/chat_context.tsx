// ChatContext.tsx
"use client";
import React, { createContext, useState, useContext } from "react";

interface Friend {
  id: string;
  display_name: string;
  image: string;
}

interface ChatContextType {
  selectedFriend: Friend | null;
  setSelectedFriend: (friend: Friend | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  return (
    <ChatContext.Provider value={{ selectedFriend, setSelectedFriend }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

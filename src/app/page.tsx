// page.tsx
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { ChatProvider } from "../components/chat_context";

export default function Page() {
  return (
      <div className="min-h-screen max-w-screen-xl mx-auto">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <ChatProvider>
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">
              <Chat />
            </main>
          </div>
          </ChatProvider>
        </div>
      </div>
  );
}

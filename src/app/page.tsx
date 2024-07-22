// page.tsx
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function Page() {
  return (
    <div className="min-h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <h1>Welcome to the main content area</h1>
          </main>
        </div>
      </div>
    </div>
  );
}
"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export default function Navbar(){
  const [currentTime, setCurrentTime] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    const updateTime = () => {
      const date = new Date()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }
  
    updateTime()
    const timer = setInterval(updateTime, 60000)
  
    return () => clearInterval(timer)
  }, [])
    return (


<nav className="bg-white border-gray-200 dark:bg-gray-900">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 text-white">
      <div className = "">
        <a href="/" className="flex items-center text-3xl text-gray-900 dark:text-white">
            <img className="w-12 h-12 mr-2" src="/logo.png" alt="logo"/>
            Chat Sphere    
        </a>
      </div>
      <div className="time text-3xl">
        <span>{currentTime}</span>
      </div>
      <div className = "flex items-center text-3xl">
        
        <h1 className = "mr-2">{session?.user?.name}</h1>
        <button
          onClick={() => {
            signOut();
          }}
          className="bg-red-500 text-2xl hover:bg-blue-700 text-white py-2 px-2 rounded"
        >
          Sign out
        </button>
      </div>
    </div>
</nav>

    )
}
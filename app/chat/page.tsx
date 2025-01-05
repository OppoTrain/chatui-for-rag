'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import ChatWindow from '../components/ChatWindow'
import ChatHistory from '../components/ChatHistory'
import { ThemeProvider } from '../components/ThemeProvider'

export default function Chat() {
  const [currentChat, setCurrentChat] = useState<string[]>([])
  const [chatHistory, setChatHistory] = useState<string[][]>([])
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const clearHistory = () => {
    setChatHistory([])
    setCurrentChat([])
  }

  const startNewChat = () => {
    if (currentChat.length > 0) {
      setChatHistory([...chatHistory, currentChat])
    }
    setCurrentChat([])
  }

  const loadChat = (chat: string[]) => {
    setCurrentChat(chat)
  }

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
        <Header darkMode={theme === 'dark'} setDarkMode={(isDark) => setTheme(isDark ? 'dark' : 'light')} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <ChatHistory 
                history={chatHistory}
                clearHistory={clearHistory}
                startNewChat={startNewChat}
                loadChat={loadChat}
              />
            </div>
            <div className="w-full md:w-3/4">
              <ChatWindow 
                currentChat={currentChat} 
                setCurrentChat={setCurrentChat}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}


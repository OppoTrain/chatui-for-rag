"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { v4 as uuidv4 } from "uuid"
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/config"
import Header from "../components/Header"
import ChatWindow from "../components/ChatWindow"
import ChatHistory from "../components/ChatHistory"
import { ThemeProvider } from "../components/ThemeProvider"
import Footer from "../components/Footer"

export default function Chat() {
  const [currentChat, setCurrentChat] = useState<string[]>([])
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; messages: string[]; model: string }[]>([])
  const [currentModel, setCurrentModel] = useState<string>("Humanai-V1")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Get or set user ID in localStorage
    let storedUserId = localStorage.getItem("userId")
    if (!storedUserId) {
      storedUserId = uuidv4()
      localStorage.setItem("userId", storedUserId)
    }
    setUserId(storedUserId)

    // Load chat history from Firestore
    if (storedUserId) {
      loadChatHistory(storedUserId)
    }
  }, [])

  const loadChatHistory = async (userId: string) => {
    const q = query(collection(db, "chatHistory"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    const history = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setChatHistory(history as { id: string; title: string; messages: string[]; model: string }[])
  }

  const clearHistory = async () => {
    if (!userId) return
    const q = query(collection(db, "chatHistory"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, "chatHistory", document.id))
    })
    setChatHistory([])
    setCurrentChat([])
  }

  const startNewChat = () => {
    setCurrentChat([])
  }

  const loadChat = (chat: string[]) => {
    setCurrentChat(chat)
  }

  const deleteChat = async (id: string) => {
    await deleteDoc(doc(db, "chatHistory", id))
    const updatedHistory = chatHistory.filter((chat) => chat.id !== id)
    setChatHistory(updatedHistory)
    if (currentChat.length > 0 && chatHistory.find((chat) => chat.id === id)?.messages === currentChat) {
      setCurrentChat([])
    }
  }

  const addChatToHistory = async (newChat: { title: string; messages: string[]; model: string }) => {
    if (!userId) return
    const docRef = await addDoc(collection(db, "chatHistory"), {
      ...newChat,
      userId: userId,
    })
    setChatHistory([...chatHistory, { id: docRef.id, ...newChat }])
  }

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <ChatHistory
                history={chatHistory}
                clearHistory={clearHistory}
                startNewChat={startNewChat}
                loadChat={loadChat}
                deleteChat={deleteChat}
              />
            </div>
            <div className="w-full md:w-3/4">
              <ChatWindow
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                currentModel={currentModel}
                setCurrentModel={setCurrentModel}
              />
            </div>
          </div>
        </main>
         <Footer />
      </div>
    </ThemeProvider>
  )
}

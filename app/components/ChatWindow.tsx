"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChatWindowProps {
  currentChat: string[]
  setCurrentChat: (chat: string[]) => void
  chatHistory: { id: string; title: string; messages: string[]; model: string }[]
  setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
  currentModel: string
  setCurrentModel: (model: string) => void
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function ChatWindow({
  currentChat,
  setCurrentChat,
  chatHistory,
  setChatHistory,
  currentModel,
  setCurrentModel,
}: ChatWindowProps) {
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    // Load chat history from localStorage
    const storedHistory = localStorage.getItem("chatHistory")
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory))
    }
  }, [setChatHistory])

  const generateChatTitle = useCallback((messages: string[]) => {
    const firstUserMessage = messages.find((_, index) => index % 2 === 0)
    if (firstUserMessage) {
      return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage
    }
    return "New Chat"
  }, [])

  const sendMessage = useCallback(() => {
    if (input.trim() && !isThinking) {
      const newMessage = input.trim()
      const newChat = [...currentChat, newMessage]
      setCurrentChat(newChat)
      setInput("")
      setIsThinking(true)
      setTimeout(() => {
        const botResponse = `This is a sample response from ${currentModel}.`
        const updatedChat = [...newChat, botResponse]
        setCurrentChat(updatedChat)
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory]
          const currentChatIndex = updatedHistory.findIndex(
            (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0],
          )
          if (currentChatIndex !== -1) {
            // Update existing chat
            updatedHistory[currentChatIndex] = {
              ...updatedHistory[currentChatIndex],
              id: generateUUID(),
              title: generateChatTitle(updatedChat),
              messages: updatedChat,
              model: currentModel,
            }
          } else if (updatedChat.length > 0) {
            // Create new chat entry
            updatedHistory.push({
              id: generateUUID(),
              title: generateChatTitle(updatedChat),
              messages: updatedChat,
              model: currentModel,
            })
          }
          // Save updated history to localStorage
          localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))
          return updatedHistory
        })
        setIsThinking(false)
      }, 1500)
    }
  }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isThinking) {
        e.preventDefault()
        sendMessage()
      }
    }

    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [sendMessage, isThinking])

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const handleModelChange = (value: string) => {
    if (value !== currentModel) {
      setCurrentModel(value)
      // Only reset the current chat UI, don't create a new history entry
      setCurrentChat([])
    }
  }

  return (
    <motion.div
      layout
      className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
        <div className="flex items-center space-x-2">
          <Select value={currentModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select RAG model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rag-1">RAG-1</SelectItem>
              <SelectItem value="rag-2">RAG-2</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        <AnimatePresence>
          {currentChat.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 p-3 rounded-lg ${
                index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"
              } max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
            >
              <p className="text-gray-800 dark:text-gray-200">{message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
          >
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </ScrollArea>
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isThinking) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isThinking}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}


'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatWindowProps {
  currentChat: string[]
  setCurrentChat: (chat: string[]) => void
  chatHistory: string[][]
  setChatHistory: (history: string[][]) => void
}

export default function ChatWindow({ currentChat, setCurrentChat, chatHistory, setChatHistory }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const sendMessage = useCallback(() => {
    if (input.trim()) {
      const newChat = [...currentChat, `User: ${input}`]
      setCurrentChat(newChat)
      setInput('')
      setIsThinking(true)
      setTimeout(() => {
        const responseChat = [...newChat, 'Bot: This is a sample response.']
        setCurrentChat(responseChat)
        setChatHistory([...chatHistory, responseChat])
        setIsThinking(false)
      }, 1500)
    }
  }, [input, currentChat, setCurrentChat, chatHistory, setChatHistory])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [sendMessage])

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <motion.div
      layout
      className={`${isFullScreen ? 'fixed inset-0 z-50' : 'relative h-[580px]'} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Humanai</h2>
        <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
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
                message.startsWith('User:') 
                  ? 'bg-blue-100 dark:bg-blue-900 ml-auto' 
                  : 'bg-gray-100 dark:bg-gray-700'
              } max-w-[80%] ${message.startsWith('User:') ? 'ml-auto' : 'mr-auto'}`}
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
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            <Send className="h-5 w-5" />
          </Button>
       
        </div>
      </div>
    </motion.div>
  )
}


import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatHistoryProps {
  history: string[][]
  clearHistory: () => void
  startNewChat: () => void
  loadChat: (chat: string[]) => void
}

export default function ChatHistory({ history, clearHistory, startNewChat, loadChat }: ChatHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Chat History</h2>
      {history.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-300px)]">
          {history.map((chat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              onClick={() => loadChat(chat)}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">{chat[0].substring(0, 50)}...</p>
            </motion.div>
          ))}
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
          <p className="text-gray-500 dark:text-gray-400 text-center">No chat history available</p>
        </div>
      )}
      <div className="mt-4 space-y-2">
        <Button 
          onClick={clearHistory} 
          variant="outline" 
          className="w-full group"
        >
          <Trash2 className="h-4 w-4 mr-2 group-hover:text-red-500 transition-colors duration-200" />
          Clear History
        </Button>
        <Button 
          onClick={startNewChat} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white group"
        >
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Start New Chat
        </Button>
      </div>
    </motion.div>
  )
}


import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Plus, X } from "lucide-react"
import { motion } from "framer-motion"

interface ChatHistoryProps {
  history: { id: string; title: string; messages: string[]; model: string }[]
  clearHistory: () => void
  startNewChat: () => void
  loadChat: (chat: string[]) => void
  deleteChat: (id: string) => void
}

export default function ChatHistory({ history, clearHistory, startNewChat, loadChat, deleteChat }: ChatHistoryProps) {
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
          {history.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative group"
            >
              <div className="cursor-pointer" onClick={() => loadChat(chat.messages)}>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{chat.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Model: {chat.model}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => deleteChat(chat.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
          <p className="text-gray-500 dark:text-gray-400 text-center">No chat history available</p>
        </div>
      )}
      <div className="mt-4 space-y-2">
        <Button onClick={clearHistory} variant="outline" className="w-full group">
          <Trash2 className="h-4 w-4 mr-2 group-hover:text-red-500 transition-colors duration-200" />
          Clear History
        </Button>
        <Button onClick={startNewChat} className="w-full bg-blue-600 hover:bg-blue-700 text-white group">
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Start New Chat
        </Button>
      </div>
    </motion.div>
  );
}

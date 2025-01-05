'use client'

import { Sun, Moon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Humanai
          </motion.h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Home</Link></li>
              <li><Link href="/chat" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Chat</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">About</Link></li>
              <li><Link href="/resources" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Resources</Link></li>
              <li><Link href="/collaborate" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">collaborate</Link></li>
            </ul>
          </nav>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-2"
        >
          <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="data-[state=checked]:bg-blue-600"
          />
          <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    </motion.header>
  )
}


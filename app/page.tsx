'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from './components/Header'
import { ThemeProvider } from './components/ThemeProvider'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
        <Header darkMode={theme === 'dark'} setDarkMode={(isDark) => setTheme(isDark ? 'dark' : 'light')} />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Welcome to Humanai
            </h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              Empowering human rights advocacy through AI-powered insights and resources.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/chat">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Chatting
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {['About', 'Resources', 'Impact'].map((item, index) => (
              <Link href={`/${item.toLowerCase()}`} key={item}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{item}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {index === 0 && "Learn about our mission and vision."}
                    {index === 1 && "Access valuable human rights resources."}
                    {index === 2 && "See the real-world impact of our work."}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  )
}


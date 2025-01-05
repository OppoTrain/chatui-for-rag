'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import { ThemeProvider } from '../components/ThemeProvider'
import { motion } from 'framer-motion'

export default function Impact() {
  const impactData = [
    { metric: 'Users Assisted', value: '10,000+' },
    { metric: 'Countries Reached', value: '150+' },
    { metric: 'Human Rights Issues Addressed', value: '500+' },
    { metric: 'Resources Provided', value: '5,000+' }
  ]

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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
          >
            <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">Our Impact</h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              At Humanai, we're committed to making a real difference in the world. Here's a glimpse of our impact so far:
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {impactData.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{item.metric}</h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Our Ongoing Commitment</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              While we're proud of what we've achieved so far, we recognize that there's still much work to be done. We remain dedicated to expanding our reach, improving our AI capabilities, and collaborating with human rights organizations worldwide to create a more just and equitable world for all.
            </p>
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  )
}


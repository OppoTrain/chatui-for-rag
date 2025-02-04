'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import { ThemeProvider } from '../components/ThemeProvider'
import { motion } from 'framer-motion'

export default function About() {
  const teamMembers = [
    { name: 'Zaina', role: 'Founder & CEO', image: 'https://avatars.githubusercontent.com/u/64072872?v=4' },
    { name: 'Saif', role: 'ML Engineer', image: 'https://avatars.githubusercontent.com/u/116926046?v=4' },
    { name: 'Farah', role: 'ML Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQE1t6aNeSt_Kw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1720004526221?e=1743638400&v=beta&t=hdsVmYHc7Axhr7YGpDH-YxU3bMWxbdYDi2Dk8TfWIwc' },
    { name: 'Sara', role: 'AI specialst', image: 'https://avatars.githubusercontent.com/u/117400227?s=64&v=4' },
    { name: 'Hossam', role: 'Front End Developer', image: 'https://avatars.githubusercontent.com/u/175687232?v=4' },
    { name: 'Tala', role: 'Front End Developer', image: 'https://avatars.githubusercontent.com/u/117400227?s=64&v=4'},
  ];

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
          <div className="container">
          <main className="container mx-auto px-4 py-16 w-3/4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">About Us</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                Unlock the power of knowledge with our RAG-powered human rights tool “HumenAI”. Developed at Oppotrain, we believe everyone should have access to reliable and comprehensive information. Our HumenAI model allows you to quickly find the answers you need from a vast collection of human rights documents, empowering researchers, journalists, advocates, and citizens alike to understand and address critical human rights issues.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {['Accessibility', 'Accuracy', 'Action'].map((item, index) => (
              <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{item}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {index === 0 && "We strive to make human rights information accessible to all."}
                  {index === 1 && "Our AI ensures accurate and up-to-date information."}
                  {index === 2 && "We empower users to take meaningful action for human rights."}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Meet Our Team</h2>
            <p className="text-lg mb-12 text-gray-700 dark:text-gray-300">Our team is made up of passionate individuals dedicated to advancing human rights through AI. Get to know the amazing minds behind HumenAI.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover" />
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{member.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main></div>
        
      </div>
    </ThemeProvider>
  )
}
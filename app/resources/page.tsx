'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import { ThemeProvider } from '../components/ThemeProvider'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Resources() {
  const resources = [
    {
      title: 'United Nations Human Rights',
      description: 'Official website of the UN Human Rights Office',
      link: 'https://www.ohchr.org/'
    },
    {
      title: 'Amnesty International',
      description: 'Global movement campaigning for human rights',
      link: 'https://www.amnesty.org/'
    },
    {
      title: 'Human Rights Watch',
      description: 'Investigates and reports on abuses happening in all corners of the world',
      link: 'https://www.hrw.org/'
    },
    {
      title: 'International Justice Resource Center',
      description: 'Information and resources on human rights law and mechanisms',
      link: 'https://ijrcenter.org/'
    }
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
            <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">Resources</h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              Explore these valuable resources to deepen your understanding of human rights issues and find ways to get involved.
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  )
}


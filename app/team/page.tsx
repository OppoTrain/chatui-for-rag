'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import { ThemeProvider } from '../components/ThemeProvider'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'

export default function Team() {
  const teamMembers = [
    { name: 'Abed Khooli', role: 'AI Consultant', image: 'team/Abed-Kooli.jpeg', linkedin: 'https://www.linkedin.com/in/akhooli/' },
    { name: 'Zaina Saadeddin', role: 'Project Manager', image: 'team/Zaina.jpeg', linkedin: 'https://www.linkedin.com/in/zainasaadeddin/' },
    { name: 'Marwan Tarazi', role: 'Domain Expert - Human Rights', image: 'team/Marwan.jpeg', linkedin: 'https://www.linkedin.com/in/marwan-tarazi-5219ba20/' },
    { name: 'Saif Sabelaish', role: 'AI Engineer', image: 'team/Saif.jpeg', linkedin: 'https://www.linkedin.com/in/saifalaasabelaish/' },
    { name: 'Farah Saleh', role: 'AI Engineer', image: 'team/Farah.jpeg', linkedin: 'https://www.linkedin.com/in/farah-m-saleh' },
    { name: 'Hossam Shehadeh', role: 'Software Engineer', image: 'team/Hossam.jpeg', linkedin: 'https://www.linkedin.com/in/hossam-shehadeh' },
    { name: 'Raghad Mahmoud', role: 'AI Engineer', image: 'team/Raghad.jpeg', linkedin: 'https://www.linkedin.com/in/raghadzmahmoud/' },
    { name: 'Ahmad Namrouti', role: 'AI Engineer', image: 'team/Ahmed.jpeg', linkedin: 'https://www.linkedin.com/in/namroutii/' },
    { name: 'Renad Iwidat', role: 'AI Engineer', image: 'team/Renad.jpeg', linkedin: 'https://www.linkedin.com/in/renadiwidat/' },
    { name: 'Sara Oraib', role: 'AI Engineer', image: 'team/Sara.jpeg', linkedin: 'https://www.linkedin.com/in/sara-oraib/' },
    { name: 'Tala Dweikat', role: 'AI Engineer', image: 'team/Tala.jpg', linkedin: 'https://www.linkedin.com/in/tala-dweikat-a80712276/' },
    { name: 'Alaa Odeh', role: 'AI Engineer', image: 'team/Alaa.jpeg', linkedin: 'https://www.linkedin.com/in/alaa-odeh1579/' },
   
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
        <Header />
        <div className="container mx-auto px-4 py-16 w-3/4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl font-extrabold mb-6 text-blue-600 dark:text-blue-400 tracking-wide">MEET OUR TECH TALENTS</h2>
            <p className="text-lg mb-12 text-gray-700 dark:text-gray-300 ">Our talented team is dedicated to innovation and excellence. Get to know our amazing members.</p>
            
            
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {teamMembers.map((member, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-4">
                    <img src={member.image || 'https://via.placeholder.com/100'} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md" />
                    <div>
                      <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 tracking-wide">{member.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">{member.role}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import { ThemeProvider } from '../components/ThemeProvider'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'

export default function Team() {
  const teamMembers = [
    { name: 'Abed Khooli', role: 'AI Consultant', image: 'https://media.licdn.com/dms/image/v2/C4D03AQEE303lRvZrZA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516780691927?e=1744243200&v=beta&t=klDkBx7g2DiZM5oi-vA7v6bSeWvU6IZbY2Q9U9axoG8', linkedin: 'https://www.linkedin.com/in/akhooli/' },
    { name: 'Zaina Saadeddin', role: 'Project Manager', image: 'https://media.licdn.com/dms/image/v2/D4E03AQGxueJEkDBk-w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1678969302303?e=2147483647&v=beta&t=Su-F0JTZyCgNY7gXmEThR_RT1CwkO25ssg9K5d4PU2Q', linkedin: 'https://www.linkedin.com/in/zainasaadeddin/' },
    { name: 'Marwan Tarazi', role: 'Domain Expert - Human Rights', image: 'https://media.licdn.com/dms/image/v2/C4D03AQFGCr7sf9VWDA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1574391378735?e=1744243200&v=beta&t=JkwZ2gI0uUISpCUO48fqGqvjzAes1QW3KiEvejHHQH4', linkedin: 'https://www.linkedin.com/in/marwan-tarazi-5219ba20/' },
    { name: 'Saif Sabelaish', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4E03AQEDeiS6cEhseQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1723327818765?e=2147483647&v=beta&t=dRR5OmB1YIvY28JEl5RVXg326NErTTuX_2NBDm94f0o', linkedin: 'https://www.linkedin.com/in/saifalaasabelaish/' },
    { name: 'Farah Saleh', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQE1t6aNeSt_Kw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720004526221?e=2147483647&v=beta&t=L3XaMJXukH7fRqpwePDQZy1iyl_iHyzXww68F1Ks8DA', linkedin: 'https://www.linkedin.com/in/farah-m-saleh' },
    { name: 'Hossam Shehadeh', role: 'Software Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQHzK93YdsgGBg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1678200123708?e=2147483647&v=beta&t=kCZCX28zlPZAYdC8JnFakSX5_FnMrZbS_bAXEYa2r6c', linkedin: 'https://www.linkedin.com/in/hossam-shehadeh' },
    { name: 'Raghad Mahmoud', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4E03AQF2r8O-8kzjaA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724518527371?e=1744243200&v=beta&t=0fC_NNYMWGMbNP3yGwYkx-0l5l1f669vFh2muO5eYQo', linkedin: 'https://www.linkedin.com/in/raghadzmahmoud/' },
    { name: 'Ahmad Namrouti', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQFRNOAPhl1gbg/profile-displayphoto-shrink_200_200/B4DZSoFNF2GcAc-/0/1737986724862?e=2147483647&v=beta&t=Buu6cS7bR-8Ba5xuBGDzLkx2h0MwJ1--6oUEk2B3gkM', linkedin: 'https://www.linkedin.com/in/namroutii/' },
    { name: 'Renad Iwidat', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQEO08y9Ufzhzw/profile-displayphoto-shrink_200_200/B4DZSLILPWHIAY-/0/1737500965787?e=2147483647&v=beta&t=22M3B3aMrtvP0QqzV4omV8oEeSuvQNpZyDoYitv4Xxc', linkedin: 'https://www.linkedin.com/in/renadiwidat/' },
    { name: 'Sara Oraib', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQENybmlKA4IMA/profile-displayphoto-shrink_200_200/B4DZSjymKHH0AY-/0/1737914739534?e=2147483647&v=beta&t=5Tms9rrIluRlGmdnxmR5W1gjLfRddLdRgLF_2VvlpT4', linkedin: 'https://www.linkedin.com/in/sara-oraib/' },
    { name: 'Tala Dweikat', role: 'AI Engineer', image: 'https://avatars.githubusercontent.com/u/117400227?s=64&v=4', linkedin: 'https://www.linkedin.com/in/tala-dweikat-a80712276/' },
    { name: 'Alaa Odeh', role: 'AI Engineer', image: 'https://media.licdn.com/dms/image/v2/D4D03AQH8QthcMCvbDQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727185202286?e=1744243200&v=beta&t=Pi4PGzu4rDhSl1RnI5sZgmw08HEK7Es1diyjMaUO770', linkedin: 'https://www.linkedin.com/in/alaa-odeh1579/' },
   
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

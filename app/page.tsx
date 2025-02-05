// "use client"

// import { useState, useEffect } from "react"
// import { useTheme } from "next-themes"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import Header from "./components/Header"
// import { ThemeProvider } from "./components/ThemeProvider"
// import { Button } from "@/components/ui/button"
// import FAQ from "./components/FAQ"
// import Footer from "./components/Footer"

// export default function Home() {
//   const [mounted, setMounted] = useState(false)
//   const { theme, setTheme } = useTheme()

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//               <Header />
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
//         <main className="w-full max-w-3xl px-4 text-center mt-5">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
//               Welcome to Humanai
//             </h1>
//             <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
//               Humanai is a cutting-edge artificial intelligence bot designed with precision to revolutionize the
//               development of educational resources focused on human rights. It can answer challenging questions on a
//               wide range of human rights topics, helping spread awareness for understanding and foster critical thinking
//               in this crucial area.
//             </p>
//             <Link href="/chat">
//               <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
//                 Try Humanai for free
//               </Button>
//             </Link>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5, duration: 0.5 }}
//             className="mt-16"
//           >
//             <img src="Screenshot.png" alt="Humanai Chat Screenshot" className="w-full rounded-lg shadow-lg" />
//             </motion.div>

//           <FAQ />
//         </main>
//         <Footer />
//       </div>
//     </ThemeProvider>
//   )}
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import { Button } from "@/components/ui/button";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Header />
       {/* Hero Section */}
       <div className="min-h-screen flex flex-col items-center justify-center py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
        <main className="w-full max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Welcome to Humanai
            </h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              Humanai is a cutting-edge artificial intelligence bot designed with precision to revolutionize the
              development of educational resources focused on human rights. It can answer challenging questions on a
              wide range of human rights topics, helping spread awareness for understanding and foster critical thinking
              in this crucial area.
            </p>
            <Link href="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Try Humanai for free
              </Button>
            </Link>
          </motion.div>
        </main>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    className="mt-16 flex justify-center w-full"
  >
    <img src="Screenshot.png" alt="Humanai Chat Screenshot" className="w-3/4 rounded-lg shadow-lg" />
  </motion.div>
</div>




      
      <div className="min-h-screen flex flex-col items-center justify-center py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
        <main className="w-full max-w-3xl px-4 ">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16"
          >
            </motion.div>

          <FAQ />
        </main>
      </div>
      
      {/* Footer Section */}
      <Footer />
    </ThemeProvider>
  );
}

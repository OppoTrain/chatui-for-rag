"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqData = [
  {
    question: "What is Humanai?",
    answer:
      "Humanai is an advanced artificial intelligence-powered chatbot designed specifically to answer questions about human rights. It utilizes Retrieval + LLM to understand user inquiries and provide accurate and informative responses, drawing from a vast database of international human rights laws, treaties, and case studies. The primary purpose of Humanai is to make human rights information accessible and understandable to everyone. One of the key features of Humanai is its ability to provide contextually relevant answers. By analyzing the user's questions, Humanai can identify the specific human rights issue at hand and tailor its response accordingly. This ensures that users receive the most pertinent information without having to sift through complex legal documents. It can also provide examples of real-world human rights violations and explain the mechanisms in place for seeking redress. Humanai can be used in various settings. Human rights organizations can integrate it into their websites to provide instant support to visitors seeking information. Educational institutions can use it as a supplementary learning resource for students researching human rights topics. Journalists and researchers can leverage it to quickly access relevant information for their work. Furthermore, individuals can use Humanai to learn more about their own rights and how to protect them.",
  },
  {
    question: "What kind of questions can I ask?",
    answer:
      "Sample questions Humanai can answer:\n\n- What is the Universal Declaration of Human Rights (UDHR), and what is its significance?\n- Define the concept of human rights and explain its core principles?\n- Differentiate between civil and political rights and economic, social, and cultural rights.\n- What is the role of international law in protecting human rights?\n- Explain the concept of universality and its relevance to human rights.\n- Explain the right to freedom of speech and its limitations.\n- Discuss the importance of the right to education and its impact on development.",
  },
  {
    question: "Is my data safe with Humanai?",
    answer:
      "Every data you added to our chatbot is parsed to a temporary cache and sent to our specifically trained AI model to create your questions. When your questions are created successfully, the cache is flushed and your data is completely removed from the service. Humanai is a highly secure and reliable service that places utmost importance on the safety and privacy of its users. Humanai implemented stringent security measures to protect user data and ensure a safe user experience. Humanai follows industry-standard encryption protocols to safeguard all communication between users and the service.",
  },
  {
    question: "White-Label and SAAS?",
    answer:
      "White-labeling or SAAS is a common business practice in a wide variety of educational organizations. We can create a custom domain for your organization and create only the templates your organization needs. Please write team@oppotrain for more information.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        {faqData.map((item, index) => (
          <div key={index} className="mb-4">
            <button
              className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-lg font-semibold text-left">{item.question}</span>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-b-lg p-4 mt-1"
                >
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}


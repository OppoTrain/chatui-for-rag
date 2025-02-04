"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

export default function Contact() {
 

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .send(
        "your_service_id", // Replace with your EmailJS service ID
        "your_template_id", // Replace with your EmailJS template ID
        form,
        "your_user_id" // Replace with your EmailJS user ID
      )
      .then(
        () => {
          setSuccess(true);
          setForm({ name: "", email: "", message: "" });
        },
        () => {
          setSuccess(false);
        }
      )
      .finally(() => setSending(false));
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
        <Header
          darkMode={theme === "dark"}
          setDarkMode={(isDark) => setTheme(isDark ? "dark" : "light")}
        />
        <main className="container mx-auto px-4 py-16">
       
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Contact Us
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Have questions or want to learn more? Reach out to us below:
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
              {success && (
                <p className="text-green-600 dark:text-green-400 mt-4">
                  Message sent successfully!
                </p>
              )}
            </form>
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  );
}

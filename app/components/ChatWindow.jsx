"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Mic,
  RefreshCw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

export default function ChatWindow({
  currentChat,
  setCurrentChat,
  chatHistory,
  setChatHistory,
  currentModel,
  setCurrentModel,
  chatId, 
  setChatId
}) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const chatContainerRef = useRef(null);

  const [userId, setUserId] = useState(localStorage.getItem("userId") || uuidv4());

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentChat]);

  useEffect(() => {
    setCurrentChat([]);
    setChatId(null); // ✅ Reset chatId on model change
  }, [currentModel, setCurrentChat]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const q = query(collection(db, "chats"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatHistory(chats);
    };
    fetchChatHistory();
  }, [userId, setChatHistory]);

  const generateChatTitle = useCallback((messages) => {
    const firstUserMessage = messages.find((_, index) => index % 2 === 0);
    return firstUserMessage
      ? firstUserMessage.length > 30
        ? firstUserMessage.substring(0, 30) + "..."
        : firstUserMessage
      : "New Chat";
  }, []);

  const sendMessage = useCallback(async () => {
    if (input.trim() && !isThinking) {
      const newMessage = input.trim();
      const newChat = [...currentChat, newMessage];
      setCurrentChat(newChat);
      setInput("");
      setIsThinking(true);

      try {
        const endpoint =
          currentModel === "Humanai-V1" ? "/summarize" : "https://api.humanai.quest/synthesize/";

        const requestBody =
          currentModel === "Humanai-V1"
            ? { query_text: newMessage }
            : { question: newMessage };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        setIsThinking(false);
        setIsTyping(true);

        const data = await response.json();

        const botResponse = data.summary || data.response || null;

        const updatedChat = botResponse
          ? [...newChat, botResponse]
          : [...newChat, `No response from ${currentModel}`];

        setCurrentChat(updatedChat);
        setIsTyping(false);

        if (chatId) {
          const chatDocRef = doc(db, "chats", chatId);
          await updateDoc(chatDocRef, {
            messages: updatedChat,
          });

          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, messages: updatedChat } : chat
            )
          );
        } else {
          const docRef = await addDoc(collection(db, "chats"), {
            title: generateChatTitle(updatedChat),
            messages: updatedChat,
            model: currentModel,
            userId,
          });

          setChatId(docRef.id);
          setChatHistory((prev) => [
            ...prev,
            {
              id: docRef.id,
              title: generateChatTitle(updatedChat),
              messages: updatedChat,
              model: currentModel,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        setIsThinking(false);
        setCurrentChat([...newChat, `No response from ${currentModel}`]);
      }
    }
  }, [
    input,
    currentChat,
    setCurrentChat,
    setChatHistory,
    currentModel,
    generateChatTitle,
    isThinking,
    userId,
    chatId,
  ]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      layout
      className={`${
        isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"
      } bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Ask Humanai..
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={currentModel} onValueChange={setCurrentModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select RAG model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
              <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-auto bg-white dark:bg-gray-900 max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh]"
      >
        <AnimatePresence>
          {currentChat.map((message, index) => (
            <motion.div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                index % 2 === 0
                  ? "bg-blue-100 dark:bg-blue-900 ml-auto"
                  : "bg-gray-100 dark:bg-gray-700"
              } max-w-[80%]`}
            >
              <ReactMarkdown>{message}</ReactMarkdown>
            </motion.div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-2">
              <RefreshCw className="animate-spin" /> Thinking...
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 flex items-center gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={sendMessage}
          disabled={isThinking}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}


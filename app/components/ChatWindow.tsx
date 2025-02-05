"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

interface ChatWindowProps {
  currentChat: string[];
  setCurrentChat: (chat: string[]) => void;
  chatHistory: { id: string; title: string; messages: string[]; model: string }[];
  setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
  currentModel: string;
  setCurrentModel: (model: string) => void;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function ChatWindow({
  currentChat,
  setCurrentChat,
  chatHistory,
  setChatHistory,
  currentModel,
  setCurrentModel,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Reset chat history when the model changes
  useEffect(() => {
    setCurrentChat([]); // Clear current chat on model change
  }, [currentModel, setCurrentChat]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const q = query(collection(db, "chats"));
      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChatHistory(chats as any);
    };
    fetchChatHistory();
  }, [setChatHistory]);

  const generateChatTitle = useCallback((messages: string[]) => {
    const firstUserMessage = messages.find((_, index) => index % 2 === 0);
    return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat";
  }, []);

  const sendMessage = useCallback(async () => {
    if (input.trim() && !isThinking) {
      const newMessage = input.trim();
      const newChat = [...currentChat, newMessage];
      setCurrentChat(newChat);
      setInput("");
      setIsThinking(true);

      try {
        const endpoint = currentModel === "Humanai-V1" 
          ? "/summarize" 
          : "http://54.166.204.83:8000/synthesize/";
        
        const requestBody = currentModel === "Humanai-V1" 
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
        const botResponse = data.summary || data.response || `No response from ${currentModel}`;
        
        setIsTyping(false);
        const updatedChat = [...newChat, botResponse];
        setCurrentChat(updatedChat);

        if (updatedChat.length === 2) {
          const docRef = await addDoc(collection(db, "chats"), {
            title: generateChatTitle(updatedChat),
            messages: updatedChat,
            model: currentModel,
          });
          //setChatHistory(prev => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
        } else {
          const existingChat = chatHistory.find(chat => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
          if (existingChat) {
            const docRef = doc(db, "chats", existingChat.id);
            await updateDoc(docRef, { messages: updatedChat });
            //setChatHistory(prev => prev.map(chat => chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat));
          }
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        setIsThinking(false);
        setCurrentChat([...newChat, `No response from ${currentModel}`]);
      }
    }
  }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

  return (
    <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
    
       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
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
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        <AnimatePresence>
          {currentChat.map((message, index) => (
            <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
          ))}
          {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
        </AnimatePresence>
      </ScrollArea>
      <div className="p-4 flex items-center gap-2">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
        <Button className=" bg-blue-600 hover:bg-blue-700 text-white " onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
      </div>
    </motion.div>
  );
}

// import { useState, useCallback, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Send, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { db } from "../../firebase/config";
// import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

// interface ChatWindowProps {
//   currentChat: string[];
//   setCurrentChat: (chat: string[]) => void;
//   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
//   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
//   currentModel: string;
//   setCurrentModel: (model: string) => void;
// }

// function generateUUID() {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// export default function ChatWindow({
//   currentChat,
//   setCurrentChat,
//   chatHistory,
//   setChatHistory,
//   currentModel,
//   setCurrentModel,
// }: ChatWindowProps) {
//   const [input, setInput] = useState("");
//   const [isThinking, setIsThinking] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   // Reset chat history when the model changes
//   useEffect(() => {
//     setCurrentChat([]); // Clear current chat on model change
//   }, [currentModel, setCurrentChat]);

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       const q = query(collection(db, "chats"));
//       const querySnapshot = await getDocs(q);
//       const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setChatHistory(chats as any);
//     };
//     fetchChatHistory();
//   }, [setChatHistory]);

//   const generateChatTitle = useCallback((messages: string[]) => {
//     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
//     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat";
//   }, []);

//   const sendMessage = useCallback(async () => {
//     if (input.trim() && !isThinking) {
//       const newMessage = input.trim();
//       const newChat = [...currentChat, newMessage];
//       setCurrentChat(newChat);
//       setInput("");
//       setIsThinking(true);

//       try {
//         const endpoint = currentModel === "Humanai-V1" 
//           ? "http://3.229.58.122:8000/summarize" 
//           : "http://54.166.204.83:8000/synthesize/";
        
//         const requestBody = currentModel === "Humanai-V1" 
//           ? { query_text: newMessage }
//           : { question: newMessage };

//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestBody),
//         });
        
//         setIsThinking(false);
//         setIsTyping(true);
        
//         const data = await response.json();
//         const botResponse = data.summary || data.response || `No response from ${currentModel}`;
        
//         // Replace the ** syntax and create a creative typing effect.
//         const formattedResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
//         setIsTyping(false);
//         const updatedChat = [...newChat, formattedResponse];
//         setCurrentChat(updatedChat);

//         if (updatedChat.length === 2) {
//           const docRef = await addDoc(collection(db, "chats"), {
//             title: generateChatTitle(updatedChat),
//             messages: updatedChat,
//             model: currentModel,
//           });
//           setChatHistory(prev => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
//         } else {
//           const existingChat = chatHistory.find(chat => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
//           if (existingChat) {
//             const docRef = doc(db, "chats", existingChat.id);
//             await updateDoc(docRef, { messages: updatedChat });
//             setChatHistory(prev => prev.map(chat => chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching response:", error);
//         setIsThinking(false);
//         setCurrentChat([...newChat, `No response from ${currentModel}`]);
//       }
//     }
//   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

//   return (
//     <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
//       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
//         <div className="flex items-center space-x-2">
//           <Select value={currentModel} onValueChange={setCurrentModel}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select RAG model" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
//               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
//             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//           </Button>
//         </div>
//       </div>
//       <ScrollArea className="flex-grow p-4">
//         <AnimatePresence>
//           {currentChat.map((message, index) => (
//             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`} dangerouslySetInnerHTML={{ __html: message }} />
//           ))}
//           {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
//         </AnimatePresence>
//       </ScrollArea>
//       <div className="p-4 flex items-center gap-2">
//         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
//         <Button className=" bg-blue-600 hover:bg-blue-700 text-white " onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
//       </div>
//     </motion.div>
//   );
// }
// import { useState, useCallback, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { db } from "../../firebase/config";
// import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
// import axios from "axios";
// interface ChatWindowProps {
//   currentChat: string[];
//   setCurrentChat: (chat: string[]) => void;
//   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
//   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
//   currentModel: string;
//   setCurrentModel: (model: string) => void;
// }

// function generateUUID() {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// export default function ChatWindow({
//   currentChat,
//   setCurrentChat,
//   chatHistory,
//   setChatHistory,
//   currentModel,
//   setCurrentModel,
// }: ChatWindowProps) {
//   const [input, setInput] = useState("");
//   const [isThinking, setIsThinking] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   // Reset chat history when the model changes
//   useEffect(() => {
//     setCurrentChat([]); // Clear current chat on model change
//   }, [currentModel, setCurrentChat]);

//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       const q = query(collection(db, "chats"));
//       const querySnapshot = await getDocs(q);
//       const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setChatHistory(chats as any);
//     };
//     fetchChatHistory();
//   }, [setChatHistory]);

//   const generateChatTitle = useCallback((messages: string[]) => {
//     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
//     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat";
//   }, []);

//   const sendMessage = useCallback(async () => {
//     if (input.trim() && !isThinking) {
//       const newMessage = input.trim();
//       const newChat = [...currentChat, newMessage];
//       setCurrentChat(newChat);
//       setInput("");
//       setIsThinking(true);

//       try {
//         const endpoint = currentModel === "Humanai-V1" 
//           ? "/summarize" 
//           : "http://54.166.204.83:8000/synthesize/";
        
//         // Redirect HTTP to HTTPS
//         const secureEndpoint = endpoint.replace(/^http:\/\//, "https://");

//         const requestBody = currentModel === "Humanai-V1" 
//           ? { query_text: newMessage }
//           : { question: newMessage };

//           const response = await axios.post(secureEndpoint, requestBody, {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });
        
//         setIsThinking(false);
//         setIsTyping(true);
        
//         const data = await response.json();
//         const botResponse = data.summary || data.response || `No response from ${currentModel}`;
        
//         // Replace the ** syntax and create a creative typing effect.
//         const formattedResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
//         setIsTyping(false);
//         const updatedChat = [...newChat, formattedResponse];
//         setCurrentChat(updatedChat);

//         if (updatedChat.length === 2) {
//           const docRef = await addDoc(collection(db, "chats"), {
//             title: generateChatTitle(updatedChat),
//             messages: updatedChat,
//             model: currentModel,
//           });
//           setChatHistory(prev => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
//         } else {
//           const existingChat = chatHistory.find(chat => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
//           if (existingChat) {
//             const docRef = doc(db, "chats", existingChat.id);
//             await updateDoc(docRef, { messages: updatedChat });
//             setChatHistory(prev => prev.map(chat => chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching response:", error);
//         setIsThinking(false);
//         setCurrentChat([...newChat, `No response from ${currentModel}`]);
//       }
//     }
//   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

//   return (
//     <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
//       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
//         <div className="flex items-center space-x-2">
//           <Select value={currentModel} onValueChange={setCurrentModel}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select RAG model" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
//               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
//             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//           </Button>
//         </div>
//       </div>
//       <ScrollArea className="flex-grow p-4">
//         <AnimatePresence>
//           {currentChat.map((message, index) => (
//             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`} dangerouslySetInnerHTML={{ __html: message }} />
//           ))}
//           {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
//         </AnimatePresence>
//       </ScrollArea>
//       <div className="p-4 flex items-center gap-2">
//         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
//         <Button className=" bg-blue-600 hover:bg-blue-700 text-white " onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
//       </div>
//     </motion.div>
//   );
// }

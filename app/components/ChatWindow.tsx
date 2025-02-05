// // // "use client";

// // // import { useState, useCallback, useEffect } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Textarea } from "@/components/ui/textarea";
// // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // // interface ChatWindowProps {
// // //   currentChat: string[];
// // //   setCurrentChat: (chat: string[]) => void;
// // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// // //   currentModel: string;
// // //   setCurrentModel: (model: string) => void;
// // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // // }

// // // function generateUUID() {
// // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // //     const r = (Math.random() * 16) | 0;
// // //     const v = c === "x" ? r : (r & 0x3) | 0x8;
// // //     return v.toString(16);
// // //   });
// // // }

// // // export default function ChatWindow({
// // //   currentChat,
// // //   setCurrentChat,
// // //   chatHistory,
// // //   setChatHistory,
// // //   currentModel,
// // //   setCurrentModel,
// // //   addChatToHistory,
// // // }: ChatWindowProps) {
// // //   const [input, setInput] = useState("");
// // //   const [isThinking, setIsThinking] = useState(false);
// // //   const [isFullScreen, setIsFullScreen] = useState(false);

// // //   useEffect(() => {
// // //     // Load chat history from localStorage
// // //     const storedHistory = localStorage.getItem("chatHistory");
// // //     if (storedHistory) {
// // //       setChatHistory(JSON.parse(storedHistory));
// // //     }
// // //   }, [setChatHistory]);

// // //   const generateChatTitle = useCallback((messages: string[]) => {
// // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
// // //     if (firstUserMessage) {
// // //       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
// // //     }
// // //     return "New Chat";
// // //   }, []);

// // //   const sendMessage = useCallback(async () => {
// // //     if (input.trim() && !isThinking) {
// // //       const newMessage = input.trim();
// // //       const newChat = [...currentChat, newMessage];
// // //       setCurrentChat(newChat);
// // //       setInput("");
// // //       setIsThinking(true);

// // //       try {
// // //         const endpoint = currentModel === "Humanai-V1"
// // //           ? "http://54.89.223.159:8000/summarize"
// // //           : "http://54.166.204.83:8000/synthesize/";

// // //         const requestBody = currentModel === "Humanai-V1"
// // //           ? { query_text: newMessage }
// // //           : { question: newMessage };

// // //         const response = await fetch(endpoint, {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify(requestBody),
// // //         });

// // //         setIsThinking(false);

// // //         const data = await response.json();
// // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`;

// // //         setIsThinking(false);
// // //         const updatedChat = [...newChat, botResponse];
// // //         setCurrentChat(updatedChat);

// // //         if (updatedChat.length === 2) {
// // //           const docRef = await addDoc(collection(db, "chats"), {
// // //             title: generateChatTitle(updatedChat),
// // //             messages: updatedChat,
// // //             model: currentModel,
// // //           });
// // //           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// // //         } else {
// // //           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// // //           if (existingChat) {
// // //             const docRef = doc(db, "chats", existingChat.id);
// // //             await updateDoc(docRef, { messages: updatedChat });
// // //             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
// // //           }
// // //         }
// // //       } catch (error) {
// // //         console.error("Error fetching response:", error);
// // //         setIsThinking(false);
// // //         setCurrentChat([...newChat, `No response from ${currentModel}`]);
// // //       }
// // //     }
// // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

// // //   useEffect(() => {
// // //     const handleKeyPress = (e: KeyboardEvent) => {
// // //       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // //         e.preventDefault();
// // //         sendMessage();
// // //       }
// // //     };

// // //     window.addEventListener("keypress", handleKeyPress);
// // //     return () => window.removeEventListener("keypress", handleKeyPress);
// // //   }, [sendMessage, isThinking]);

// // //   const toggleFullScreen = () => {
// // //     setIsFullScreen(!isFullScreen);
// // //   };

// // //   const handleModelChange = (value: string) => {
// // //     if (value !== currentModel) {
// // //       setCurrentModel(value);
// // //       setCurrentChat([]);
// // //     }
// // //   };

// // //   return (
// // //     <motion.div
// // //       layout
// // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // //       initial={{ opacity: 0 }}
// // //       animate={{ opacity: 1 }}
// // //       exit={{ opacity: 0 }}
// // //     >
// // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
// // //         <div className="flex items-center space-x-2">
// // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // //             <SelectTrigger className="w-[180px]">
// // //               <SelectValue placeholder="Select RAG model" />
// // //             </SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // //             </SelectContent>
// // //           </Select>
// // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // //           </Button>
// // //         </div>
// // //       </div>
// // //       <ScrollArea className="flex-grow p-4">
// // //         <AnimatePresence>
// // //           {currentChat.map((message, index) => (
// // //             <motion.div
// // //               key={index}
// // //               initial={{ opacity: 0, y: 20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               exit={{ opacity: 0, y: -20 }}
// // //               transition={{ duration: 0.3 }}
// // //               className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
// // //             >
// // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // //             </motion.div>
// // //           ))}
// // //         </AnimatePresence>
// // //         {isThinking && (
// // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
// // //             <RefreshCw className="h-5 w-5 animate-spin" />
// // //             <span>Thinking...</span>
// // //           </motion.div>
// // //         )}
// // //       </ScrollArea>
// // //       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
// // //         <div className="flex items-center space-x-2">
// // //           <Textarea
// // //             value={input}
// // //             onChange={(e) => setInput(e.target.value)}
// // //             placeholder="Type your message here..."
// // //             className="flex-grow"
// // //             onKeyPress={(e) => {
// // //               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // //                 e.preventDefault();
// // //                 sendMessage();
// // //               }
// // //             }}
// // //           />
// // //           <Button
// // //             variant="primary"
// // //             className="ml-2"
// // //             onClick={sendMessage}
// // //             disabled={isThinking || !input.trim()}
// // //           >
// // //             <Send className="h-5 w-5" />
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </motion.div>
// // //   );
// // // }


// // // // "use client"

// // // // import { useState, useCallback, useEffect } from "react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Textarea } from "@/components/ui/textarea";
// // // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // // // import { motion, AnimatePresence } from "framer-motion";
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // // // interface ChatWindowProps {
// // // //   currentChat: string[];
// // // //   setCurrentChat: (chat: string[]) => void;
// // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// // // //   currentModel: string;
// // // //   setCurrentModel: (model: string) => void;
// // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // // // }

// // // // function generateUUID() {
// // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // //     const r = (Math.random() * 16) | 0;
// // // //     const v = c === "x" ? r : (r & 0x3) | 0x8;
// // // //     return v.toString(16);
// // // //   });
// // // // }

// // // // export default function ChatWindow({
// // // //   currentChat,
// // // //   setCurrentChat,
// // // //   chatHistory,
// // // //   setChatHistory,
// // // //   currentModel,
// // // //   setCurrentModel,
// // // //   addChatToHistory,
// // // // }: ChatWindowProps) {
// // // //   const [input, setInput] = useState("");
// // // //   const [isThinking, setIsThinking] = useState(false);
// // // //   const [isFullScreen, setIsFullScreen] = useState(false);

// // // //   useEffect(() => {
// // // //     // Load chat history from localStorage
// // // //     const storedHistory = localStorage.getItem("chatHistory");
// // // //     if (storedHistory) {
// // // //       setChatHistory(JSON.parse(storedHistory));
// // // //     }
// // // //   }, [setChatHistory]);

// // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
// // // //     if (firstUserMessage) {
// // // //       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
// // // //     }
// // // //     return "New Chat";
// // // //   }, []);

// // // //   const sendMessage = useCallback(async () => {
// // // //     if (input.trim() && !isThinking) {
// // // //       const newMessage = input.trim();
// // // //       const newChat = [...currentChat, newMessage];
// // // //       setCurrentChat(newChat);
// // // //       setInput("");
// // // //       setIsThinking(true);

// // // //       try {
// // // //         const endpoint = currentModel === "Humanai-V1"
// // // //           ? "http://54.89.223.159:8000/summarize"
// // // //           : "http://54.166.204.83:8000/synthesize/";

// // // //         const requestBody = currentModel === "Humanai-V1"
// // // //           ? { query_text: newMessage }
// // // //           : { question: newMessage };

// // // //         const response = await fetch(endpoint, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify(requestBody),
// // // //         });

// // // //         setIsThinking(false);

// // // //         const data = await response.json();
// // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`;

// // // //         setIsThinking(false);
// // // //         const updatedChat = [...newChat, botResponse];
// // // //         setCurrentChat(updatedChat);

// // // //         if (updatedChat.length === 2) {
// // // //           const docRef = await addDoc(collection(db, "chats"), {
// // // //             title: generateChatTitle(updatedChat),
// // // //             messages: updatedChat,
// // // //             model: currentModel,
// // // //           });
// // // //           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// // // //         } else {
// // // //           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// // // //           if (existingChat) {
// // // //             const docRef = doc(db, "chats", existingChat.id);
// // // //             await updateDoc(docRef, { messages: updatedChat });
// // // //             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching response:", error);
// // // //         setIsThinking(false);
// // // //         setCurrentChat([...newChat, `No response from ${currentModel}`]);
// // // //       }
// // // //     }
// // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

// // // //   useEffect(() => {
// // // //     const handleKeyPress = (e: KeyboardEvent) => {
// // // //       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // // //         e.preventDefault();
// // // //         sendMessage();
// // // //       }
// // // //     };

// // // //     window.addEventListener("keypress", handleKeyPress);
// // // //     return () => window.removeEventListener("keypress", handleKeyPress);
// // // //   }, [sendMessage, isThinking]);

// // // //   const toggleFullScreen = () => {
// // // //     setIsFullScreen(!isFullScreen);
// // // //   };

// // // //   const handleModelChange = (value: string) => {
// // // //     if (value !== currentModel) {
// // // //       setCurrentModel(value);
// // // //       setCurrentChat([]);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <motion.div
// // // //       layout
// // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // //       initial={{ opacity: 0 }}
// // // //       animate={{ opacity: 1 }}
// // // //       exit={{ opacity: 0 }}
// // // //     >
// // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
// // // //         <div className="flex items-center space-x-2">
// // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // //             <SelectTrigger className="w-[180px]">
// // // //               <SelectValue placeholder="Select RAG model" />
// // // //             </SelectTrigger>
// // // //             <SelectContent>
// // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // //             </SelectContent>
// // // //           </Select>
// // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //       <ScrollArea className="flex-grow p-4">
// // // //         <AnimatePresence>
// // // //           {currentChat.map((message, index) => (
// // // //             <motion.div
// // // //               key={index}
// // // //               initial={{ opacity: 0, y: 20 }}
// // // //               animate={{ opacity: 1, y: 0 }}
// // // //               exit={{ opacity: 0, y: -20 }}
// // // //               transition={{ duration: 0.3 }}
// // // //               className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
// // // //             >
// // // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // // //             </motion.div>
// // // //           ))}
// // // //         </AnimatePresence>
// // // //         {isThinking && (
// // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
// // // //             <RefreshCw className="h-5 w-5 animate-spin" />
// // // //             <span>Thinking...</span>
// // // //           </motion.div>
// // // //         )}
// // // //       </ScrollArea>
// // // //       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
// // // //         <div className="flex items-center space-x-2">
// // // //           <Textarea
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             placeholder="Type your message here..."
// // // //             className="flex-grow"
// // // //             onKeyPress={(e) => {
// // // //               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // // //                 e.preventDefault();
// // // //                 sendMessage();
// // // //               }
// // // //             }}
// // // //           />
// // // //           <Button
// // // //             variant="primary"
// // // //             className="ml-2"
// // // //             onClick={sendMessage}
// // // //             disabled={isThinking || !input.trim()}
// // // //           >
// // // //             <Send className="h-5 w-5" />
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //     </motion.div>
// // // //   );
// // // // }

// // // // "use client";

// // // // import { useState, useCallback, useEffect } from "react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Textarea } from "@/components/ui/textarea";
// // // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // // // import { motion, AnimatePresence } from "framer-motion";
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // // // interface ChatWindowProps {
// // // //   currentChat: string[];
// // // //   setCurrentChat: (chat: string[]) => void;
// // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// // // //   currentModel: string;
// // // //   setCurrentModel: (model: string) => void;
// // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // // // }

// // // // function generateUUID() {
// // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // //     const r = (Math.random() * 16) | 0;
// // // //     const v = c === "x" ? r : (r & 0x3) | 0x8;
// // // //     return v.toString(16);
// // // //   });
// // // // }

// // // // export default function ChatWindow({
// // // //   currentChat,
// // // //   setCurrentChat,
// // // //   chatHistory,
// // // //   setChatHistory,
// // // //   currentModel,
// // // //   setCurrentModel,
// // // //   addChatToHistory,
// // // // }: ChatWindowProps) {
// // // //   const [input, setInput] = useState("");
// // // //   const [isThinking, setIsThinking] = useState(false);
// // // //   const [isFullScreen, setIsFullScreen] = useState(false);

// // // //   useEffect(() => {
// // // //     // Load chat history from localStorage
// // // //     const storedHistory = localStorage.getItem("chatHistory");
// // // //     if (storedHistory) {
// // // //       setChatHistory(JSON.parse(storedHistory));
// // // //     }
// // // //   }, [setChatHistory]);

// // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
// // // //     if (firstUserMessage) {
// // // //       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
// // // //     }
// // // //     return "New Chat";
// // // //   }, []);

// // // //   // New function to handle a predefined educational content.
// // // //   const handleEducationalContent = useCallback(async () => {
// // // //     setIsThinking(true);
// // // //     const educationalContent = {
// // // //       "Poverty Reduction and Economic Development": [
// // // //         "Education is a primary vehicle for lifting poor children and adults out of poverty.",
// // // //         "The exercise of the right to education is instrumental for the enjoyment of other human rights."
// // // //       ],
// // // //       "Social and Cultural Development": [
// // // //         "Life skills development, including awareness about health issues and harmful cultural practices, is critical.",
// // // //         "Secondary education should be more accessible, reducing dropout rates."
// // // //       ],
// // // //       "Health and Well-being": [
// // // //         "Education is crucial for health outcomes, such as disease prevention and awareness.",
// // // //         "Better health outcomes, especially regarding HIV/AIDS and reproductive health, are linked to education."
// // // //       ]
// // // //     };

// // // //     const generatedResponse = Object.entries(educationalContent).map(
// // // //       ([key, content]) => `${key}:\n- ${content.join("\n- ")}`
// // // //     ).join("\n\n");

// // // //     setIsThinking(false);
// // // //     setCurrentChat(prev => [...prev, generatedResponse]);
// // // //   }, [setCurrentChat]);

// // // //   const sendMessage = useCallback(async () => {
// // // //     if (input.trim() && !isThinking) {
// // // //       const newMessage = input.trim();
// // // //       const newChat = [...currentChat, newMessage];
// // // //       setCurrentChat(newChat);
// // // //       setInput("");
// // // //       setIsThinking(true);

// // // //       try {
// // // //         const endpoint = currentModel === "Humanai-V1"
// // // //           ? "http://54.89.223.159:8000/summarize"
// // // //           : "http://54.166.204.83:8000/synthesize/";

// // // //         const requestBody = currentModel === "Humanai-V1"
// // // //           ? { query_text: newMessage }
// // // //           : { question: newMessage };

// // // //         const response = await fetch(endpoint, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify(requestBody),
// // // //         });

// // // //         setIsThinking(false);

// // // //         const data = await response.json();
// // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`;

// // // //         setIsThinking(false);
// // // //         const updatedChat = [...newChat, botResponse];
// // // //         setCurrentChat(updatedChat);

// // // //         if (updatedChat.length === 2) {
// // // //           const docRef = await addDoc(collection(db, "chats"), {
// // // //             title: generateChatTitle(updatedChat),
// // // //             messages: updatedChat,
// // // //             model: currentModel,
// // // //           });
// // // //           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// // // //         } else {
// // // //           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// // // //           if (existingChat) {
// // // //             const docRef = doc(db, "chats", existingChat.id);
// // // //             await updateDoc(docRef, { messages: updatedChat });
// // // //             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching response:", error);
// // // //         setIsThinking(false);
// // // //         setCurrentChat([...newChat, `No response from ${currentModel}`]);
// // // //       }
// // // //     }
// // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

// // // //   useEffect(() => {
// // // //     const handleKeyPress = (e: KeyboardEvent) => {
// // // //       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // // //         e.preventDefault();
// // // //         sendMessage();
// // // //       }
// // // //     };

// // // //     window.addEventListener("keypress", handleKeyPress);
// // // //     return () => window.removeEventListener("keypress", handleKeyPress);
// // // //   }, [sendMessage, isThinking]);

// // // //   const toggleFullScreen = () => {
// // // //     setIsFullScreen(!isFullScreen);
// // // //   };

// // // //   const handleModelChange = (value: string) => {
// // // //     if (value !== currentModel) {
// // // //       setCurrentModel(value);
// // // //       setCurrentChat([]);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <motion.div
// // // //       layout
// // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // //       initial={{ opacity: 0 }}
// // // //       animate={{ opacity: 1 }}
// // // //       exit={{ opacity: 0 }}
// // // //     >
// // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
// // // //         <div className="flex items-center space-x-2">
// // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // //             <SelectTrigger className="w-[180px]">
// // // //               <SelectValue placeholder="Select RAG model" />
// // // //             </SelectTrigger>
// // // //             <SelectContent>
// // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // //             </SelectContent>
// // // //           </Select>
// // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //       <ScrollArea className="flex-grow p-4">
// // // //         <AnimatePresence>
// // // //           {currentChat.map((message, index) => (
// // // //             <motion.div
// // // //               key={index}
// // // //               initial={{ opacity: 0, y: 20 }}
// // // //               animate={{ opacity: 1, y: 0 }}
// // // //               exit={{ opacity: 0, y: -20 }}
// // // //               transition={{ duration: 0.3 }}
// // // //               className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
// // // //             >
// // // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // // //             </motion.div>
// // // //           ))}
// // // //         </AnimatePresence>
// // // //       </ScrollArea>
// // // //       <div className="p-4 border-t dark:border-gray-700 flex items-center space-x-2">
// // // //         <Textarea
// // // //           value={input}
// // // //           onChange={(e) => setInput(e.target.value)}
// // // //           rows={2}
// // // //           placeholder="Type your question here..."
// // // //           className="flex-grow"
// // // //         />
// // // //         <Button
// // // //           variant="ghost"
// // // //           size="icon"
// // // //           onClick={isThinking ? undefined : handleEducationalContent}
// // // //         >
// // // //           {isThinking ? <RefreshCw className="animate-spin h-5 w-5" /> : <Mic className="h-5 w-5" />}
// // // //         </Button>
// // // //         <Button
// // // //           variant="solid"
// // // //           onClick={sendMessage}
// // // //           disabled={isThinking}
// // // //           className="h-12 w-12"
// // // //         >
// // // //           {isThinking ? (
// // // //             <RefreshCw className="animate-spin h-5 w-5" />
// // // //           ) : (
// // // //             <Send className="h-5 w-5" />
// // // //           )}
// // // //         </Button>
// // // //       </div>
// // // //     </motion.div>
// // // //   );
// // // // }



// // // // "use client";

// // // // import { useState, useCallback, useEffect } from "react"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Textarea } from "@/components/ui/textarea"
// // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // import { motion, AnimatePresence } from "framer-motion"
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // interface ChatWindowProps {
// // // //   currentChat: string[]
// // // //   setCurrentChat: (chat: string[]) => void
// // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // //   currentModel: string
// // // //   setCurrentModel: (model: string) => void
// // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // }

// // // // function generateUUID() {
// // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // //     const r = (Math.random() * 16) | 0
// // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // //     return v.toString(16)
// // // //   })
// // // // }

// // // // export default function ChatWindow({
// // // //   currentChat,
// // // //   setCurrentChat,
// // // //   chatHistory,
// // // //   setChatHistory,
// // // //   currentModel,
// // // //   setCurrentModel,
// // // //   addChatToHistory,
// // // // }: ChatWindowProps) {
// // // //   const [input, setInput] = useState("")
// // // //   const [isThinking, setIsThinking] = useState(false)
// // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // //   useEffect(() => {
// // // //     // Load chat history from localStorage
// // // //     const storedHistory = localStorage.getItem("chatHistory")
// // // //     if (storedHistory) {
// // // //       setChatHistory(JSON.parse(storedHistory))
// // // //     }
// // // //   }, [setChatHistory])

// // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // //     if (firstUserMessage) {
// // // //       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage
// // // //     }
// // // //     return "New Chat"
// // // //   }, [])
// // // //   const sendMessage = useCallback(async () => {
// // // //     if (input.trim() && !isThinking) {
// // // //       const newMessage = input.trim()
// // // //       const newChat = [...currentChat, newMessage]
// // // //       setCurrentChat(newChat)
// // // //       setInput("")
// // // //       setIsThinking(true)

// // // //       try {
// // // //         const endpoint = currentModel === "Humanai-V1" 
// // // //           ? "http://54.89.223.159:8000/summarize" 
// // // //           : "http://54.166.204.83:8000/synthesize/"
        
// // // //         const requestBody = currentModel === "Humanai-V1" 
// // // //           ? { query_text: newMessage }
// // // //           : { question: newMessage }

// // // //         const response = await fetch(endpoint, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify(requestBody),
// // // //         })
        
// // // //         setIsThinking(false)
// // // //         setIsTyping(true)
        
// // // //         const data = await response.json()
// // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`
        
// // // //         setIsTyping(false)
// // // //         const updatedChat = [...newChat, botResponse]
// // // //         setCurrentChat(updatedChat)

// // // //         if (updatedChat.length === 2) {
// // // //           const docRef = await addDoc(collection(db, "chats"), {
// // // //             title: generateChatTitle(updatedChat),
// // // //             messages: updatedChat,
// // // //             model: currentModel,
// // // //           });
// // // //           setChatHistory(prev => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// // // //         } else {
// // // //           const existingChat = chatHistory.find(chat => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// // // //           if (existingChat) {
// // // //             const docRef = doc(db, "chats", existingChat.id);
// // // //             await updateDoc(docRef, { messages: updatedChat });
// // // //             setChatHistory(prev => prev.map(chat => chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat));
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching response:", error)
// // // //         setIsThinking(false)
// // // //         setCurrentChat([...newChat, `No response from ${currentModel}`])
// // // //       }
// // // //     }
// // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory])


// // // //   useEffect(() => {
// // // //     const handleKeyPress = (e: KeyboardEvent) => {
// // // //       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // // //         e.preventDefault()
// // // //         sendMessage()
// // // //       }
// // // //     }

// // // //     window.addEventListener("keypress", handleKeyPress)
// // // //     return () => window.removeEventListener("keypress", handleKeyPress)
// // // //   }, [sendMessage, isThinking])

// // // //   const toggleFullScreen = () => {
// // // //     setIsFullScreen(!isFullScreen)
// // // //   }

// // // //   const handleModelChange = (value: string) => {
// // // //     if (value !== currentModel) {
// // // //       setCurrentModel(value)
// // // //       setCurrentChat([])
// // // //     }
// // // //   }

// // // //   return (
// // // //     <motion.div
// // // //       layout
// // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // //       initial={{ opacity: 0 }}
// // // //       animate={{ opacity: 1 }}
// // // //       exit={{ opacity: 0 }}
// // // //     >
// // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
// // // //         <div className="flex items-center space-x-2">
// // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // //             <SelectTrigger className="w-[180px]">
// // // //               <SelectValue placeholder="Select RAG model" />
// // // //             </SelectTrigger>
// // // //             <SelectContent>
// // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // //             </SelectContent>
// // // //           </Select>
// // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //       <ScrollArea className="flex-grow p-4">
// // // //         <AnimatePresence>
// // // //           {currentChat.map((message, index) => (
// // // //             <motion.div
// // // //               key={index}
// // // //               initial={{ opacity: 0, y: 20 }}
// // // //               animate={{ opacity: 1, y: 0 }}
// // // //               exit={{ opacity: 0, y: -20 }}
// // // //               transition={{ duration: 0.3 }}
// // // //               className={`mb-4 p-3 rounded-lg ${
// // // //                 index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"
// // // //               } max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
// // // //             >
// // // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // // //             </motion.div>
// // // //           ))}
// // // //         </AnimatePresence>
// // // //         {isThinking && (
// // // //           <motion.div
// // // //             initial={{ opacity: 0 }}
// // // //             animate={{ opacity: 1 }}
// // // //             className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
// // // //           >
// // // //             <RefreshCw className="h-5 w-5 animate-spin" />
// // // //             <span>Thinking...</span>
// // // //           </motion.div>
// // // //         )}
// // // //       </ScrollArea>
// // // //       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
// // // //         <div className="flex items-center space-x-2">
// // // //           <Textarea
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             placeholder="Type your message here..."
// // // //             className="flex-grow"
// // // //             onKeyPress={(e) => {
// // // //               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// // // //                 e.preventDefault()
// // // //                 sendMessage()
// // // //               }
// // // //             }}
// // // //           />
// // // //           <Button
// // // //             onClick={sendMessage}
// // // //             className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //             disabled={isThinking}
// // // //           >
// // // //             <Send className="h-5 w-5" />
// // // //           </Button>
         
// // // //         </div>
// // // //       </div>
// // // //     </motion.div>
// // // //   )
// // // // }


// // // // // // // // // // // // // // "use client";

// // // // // // // // // // // // // // import { useState, useCallback, useEffect } from "react";
// // // // // // // // // // // // // // import { Button } from "@/components/ui/button";
// // // // // // // // // // // // // // import { Textarea } from "@/components/ui/textarea";
// // // // // // // // // // // // // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // // // // // // // // // // // // import { Send, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // // // // // // // // // // // // // import { motion, AnimatePresence } from "framer-motion";
// // // // // // // // // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // // // // // // // // // // // // // interface ChatWindowProps {
// // // // // // // // // // // // // //   currentChat: string[];
// // // // // // // // // // // // // //   setCurrentChat: (chat: string[]) => void;
// // // // // // // // // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// // // // // // // // // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// // // // // // // // // // // // // //   currentModel: string;
// // // // // // // // // // // // // //   setCurrentModel: (model: string) => void;
// // // // // // // // // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // export default function ChatWindow({
// // // // // // // // // // // // // //   currentChat,
// // // // // // // // // // // // // //   setCurrentChat,
// // // // // // // // // // // // // //   chatHistory,
// // // // // // // // // // // // // //   setChatHistory,
// // // // // // // // // // // // // //   currentModel,
// // // // // // // // // // // // // //   setCurrentModel,
// // // // // // // // // // // // // //   addChatToHistory,
// // // // // // // // // // // // // // }: ChatWindowProps) {
// // // // // // // // // // // // // //   const [input, setInput] = useState("");
// // // // // // // // // // // // // //   const [isThinking, setIsThinking] = useState(false);
// // // // // // // // // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false);

// // // // // // // // // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // // // // // // // // //     if (input.trim() && !isThinking) {
// // // // // // // // // // // // // //       const newMessage = input.trim();
// // // // // // // // // // // // // //       const newChat = [...currentChat, newMessage];
// // // // // // // // // // // // // //       setCurrentChat(newChat);
// // // // // // // // // // // // // //       setInput("");
// // // // // // // // // // // // // //       setIsThinking(true);

// // // // // // // // // // // // // //       try {
// // // // // // // // // // // // // //         const response = await fetch("http://3.84.248.246:8000/summarize", {
// // // // // // // // // // // // // //           method: "POST",
// // // // // // // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // // // // // // //           body: JSON.stringify({ query_text: newMessage }),
// // // // // // // // // // // // // //         });

// // // // // // // // // // // // // //         const data = await response.json();
// // // // // // // // // // // // // //         const botResponse = data.summary;
// // // // // // // // // // // // // //         const updatedChat = [...newChat, botResponse];
// // // // // // // // // // // // // //         setCurrentChat(updatedChat);
// // // // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // // // //         console.error("Error fetching response:", error);
// // // // // // // // // // // // // //       } finally {
// // // // // // // // // // // // // //         setIsThinking(false);
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   }, [input, currentChat, setCurrentChat, isThinking]);

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <motion.div className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
// // // // // // // // // // // // // //       <div className="p-4 border-b flex justify-between">
// // // // // // // // // // // // // //         <h2 className="text-xl font-semibold">Chat with AI Bot</h2>
// // // // // // // // // // // // // //         <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
// // // // // // // // // // // // // //           {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // // // // // // // // // // // //         </Button>
// // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // // // // // // // // //         <AnimatePresence>
// // // // // // // // // // // // // //           {currentChat.map((message, index) => (
// // // // // // // // // // // // // //             <motion.div key={index} className="mb-4 p-3 rounded-lg bg-gray-100">
// // // // // // // // // // // // // //               <p>{message}</p>
// // // // // // // // // // // // // //             </motion.div>
// // // // // // // // // // // // // //           ))}
// // // // // // // // // // // // // //         </AnimatePresence>
// // // // // // // // // // // // // //         {isThinking && (
// // // // // // // // // // // // // //           <motion.div className="flex items-center text-gray-500">
// // // // // // // // // // // // // //             <RefreshCw className="h-5 w-5 animate-spin" />
// // // // // // // // // // // // // //             <span>Thinking...</span>
// // // // // // // // // // // // // //           </motion.div>
// // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // //       </ScrollArea>
// // // // // // // // // // // // // //       <div className="p-4 border-t">
// // // // // // // // // // // // // //         <div className="flex items-center space-x-2">
// // // // // // // // // // // // // //           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-grow" />
// // // // // // // // // // // // // //           <Button onClick={sendMessage} disabled={isThinking}>
// // // // // // // // // // // // // //             <Send className="h-5 w-5" />
// // // // // // // // // // // // // //           </Button>
// // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // //     </motion.div>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }




// // // // // // // // // // // // "use client";

// // // // // // // // // // // // import { useState, useCallback, useEffect } from "react";
// // // // // // // // // // // // import { Button } from "@/components/ui/button";
// // // // // // // // // // // // import { Textarea } from "@/components/ui/textarea";
// // // // // // // // // // // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // // // // // // // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // // // // // // // // // // // import { motion, AnimatePresence } from "framer-motion";
// // // // // // // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // // // // // // // // // // // interface ChatWindowProps {
// // // // // // // // // // // //   currentChat: string[];
// // // // // // // // // // // //   setCurrentChat: (chat: string[]) => void;
// // // // // // // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// // // // // // // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// // // // // // // // // // // //   currentModel: string;
// // // // // // // // // // // //   setCurrentModel: (model: string) => void;
// // // // // // // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // // // // // // // // // // // }

// // // // // // // // // // // // export default function ChatWindow({
// // // // // // // // // // // //   currentChat,
// // // // // // // // // // // //   setCurrentChat,
// // // // // // // // // // // //   chatHistory,
// // // // // // // // // // // //   setChatHistory,
// // // // // // // // // // // //   currentModel,
// // // // // // // // // // // //   setCurrentModel,
// // // // // // // // // // // //   addChatToHistory,
// // // // // // // // // // // // }: ChatWindowProps) {
// // // // // // // // // // // //   const [input, setInput] = useState("");
// // // // // // // // // // // //   const [isThinking, setIsThinking] = useState(false);
// // // // // // // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false);

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     const storedHistory = localStorage.getItem("chatHistory");
// // // // // // // // // // // //     if (storedHistory) {
// // // // // // // // // // // //       setChatHistory(JSON.parse(storedHistory));
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }, [setChatHistory]);

// // // // // // // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // // // // // // //     if (input.trim() && !isThinking) {
// // // // // // // // // // // //       const newMessage = input.trim();
// // // // // // // // // // // //       const newChat = [...currentChat, newMessage];
// // // // // // // // // // // //       setCurrentChat(newChat);
// // // // // // // // // // // //       setInput("");
// // // // // // // // // // // //       setIsThinking(true);

// // // // // // // // // // // //       try {
// // // // // // // // // // // //         const response = await fetch("http://3.84.248.246:8000/summarize", {
// // // // // // // // // // // //           method: "POST",
// // // // // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // // // // //           body: JSON.stringify({ query_text: newMessage }),
// // // // // // // // // // // //         });

// // // // // // // // // // // //         const data = await response.json();
// // // // // // // // // // // //         const botResponse = data.summary;
// // // // // // // // // // // //         const updatedChat = [...newChat, botResponse];
// // // // // // // // // // // //         setCurrentChat(updatedChat);

// // // // // // // // // // // //         if (updatedChat.length === 2) {
// // // // // // // // // // // //           await addChatToHistory({ title: newMessage, messages: updatedChat, model: currentModel });
// // // // // // // // // // // //         }
// // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // //         console.error("Error fetching response:", error);
// // // // // // // // // // // //       } finally {
// // // // // // // // // // // //         setIsThinking(false);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }, [input, currentChat, setCurrentChat, isThinking, addChatToHistory, currentModel]);

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <motion.div className="relative h-[600px] bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg">
// // // // // // // // // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // // // // // // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // // // // // // // // //         <Select value={currentModel} onValueChange={setCurrentModel}>
// // // // // // // // // // // //           <SelectTrigger className="w-[180px]">
// // // // // // // // // // // //             <SelectValue placeholder="Select RAG model" />
// // // // // // // // // // // //           </SelectTrigger>
// // // // // // // // // // // //           <SelectContent>
// // // // // // // // // // // //             <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // // // // // // // // // //             <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // // // // // // // // // //           </SelectContent>
// // // // // // // // // // // //         </Select>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // // // // // // //         <AnimatePresence>
// // // // // // // // // // // //           {currentChat.map((message, index) => (
// // // // // // // // // // // //             <motion.div key={index} className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 max-w-[80%]">
// // // // // // // // // // // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // // // // // // // // // // //             </motion.div>
// // // // // // // // // // // //           ))}
// // // // // // // // // // // //         </AnimatePresence>
// // // // // // // // // // // //         {isThinking && <RefreshCw className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />}
// // // // // // // // // // // //       </ScrollArea>
// // // // // // // // // // // //       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
// // // // // // // // // // // //         <div className="flex items-center space-x-2">
// // // // // // // // // // // //           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here..." />
// // // // // // // // // // // //           <Button onClick={sendMessage} disabled={isThinking} className=" bg-blue-600 hover:bg-blue-700 "><Send className="h-5 w-5 bg-blue-600 hover:bg-blue-700 text-white" /></Button>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     </motion.div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }
// // // // // // // // // // // "use client";

// // // // // // // // // // // import { useState, useCallback, useEffect } from "react";
// // // // // // // // // // // import { Button } from "@/components/ui/button";
// // // // // // // // // // // import { Textarea } from "@/components/ui/textarea";
// // // // // // // // // // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // // // // // // // // // import { Send, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // // // // // // // // // // import { motion, AnimatePresence } from "framer-motion";
// // // // // // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // // // // // // // // // // interface ChatWindowProps {
// // // // // // // // // // //   currentChat: string[];
// // // // // // // // // // //   setCurrentChat: (chat: string[]) => void;
// // // // // // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// // // // // // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// // // // // // // // // // //   currentModel: string;
// // // // // // // // // // //   setCurrentModel: (model: string) => void;
// // // // // // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // // // // // // // // // // }

// // // // // // // // // // // export default function ChatWindow({
// // // // // // // // // // //   currentChat,
// // // // // // // // // // //   setCurrentChat,
// // // // // // // // // // //   chatHistory,
// // // // // // // // // // //   setChatHistory,
// // // // // // // // // // //   currentModel,
// // // // // // // // // // //   setCurrentModel,
// // // // // // // // // // //   addChatToHistory,
// // // // // // // // // // // }: ChatWindowProps) {
// // // // // // // // // // //   const [input, setInput] = useState("");
// // // // // // // // // // //   const [isThinking, setIsThinking] = useState(false);
// // // // // // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false);

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const storedHistory = localStorage.getItem("chatHistory");
// // // // // // // // // // //     if (storedHistory) {
// // // // // // // // // // //       setChatHistory(JSON.parse(storedHistory));
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [setChatHistory]);

// // // // // // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // // // // // //     if (input.trim() && !isThinking) {
// // // // // // // // // // //       const newMessage = input.trim();
// // // // // // // // // // //       const newChat = [...currentChat, newMessage];
// // // // // // // // // // //       setCurrentChat(newChat);
// // // // // // // // // // //       setInput("");
// // // // // // // // // // //       setIsThinking(true);

// // // // // // // // // // //       try {
// // // // // // // // // // //         const response = await fetch("http://3.84.248.246:8000/summarize", {
// // // // // // // // // // //           method: "POST",
// // // // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // // // //           body: JSON.stringify({ query_text: newMessage }),
// // // // // // // // // // //         });

// // // // // // // // // // //         const data = await response.json();
// // // // // // // // // // //         const botResponse = data.summary;
// // // // // // // // // // //         const updatedChat = [...newChat, botResponse];
// // // // // // // // // // //         setCurrentChat(updatedChat);

// // // // // // // // // // //         if (updatedChat.length === 2) {
// // // // // // // // // // //           await addChatToHistory({ title: newMessage, messages: updatedChat, model: currentModel });
// // // // // // // // // // //         } else {
// // // // // // // // // // //           const existingChatIndex = chatHistory.findIndex(
// // // // // // // // // // //             (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]
// // // // // // // // // // //           );
// // // // // // // // // // //           if (existingChatIndex !== -1) {
// // // // // // // // // // //             const updatedHistory = [...chatHistory];
// // // // // // // // // // //             updatedHistory[existingChatIndex] = {
// // // // // // // // // // //               ...updatedHistory[existingChatIndex],
// // // // // // // // // // //               messages: updatedChat,
// // // // // // // // // // //             };
// // // // // // // // // // //             setChatHistory(updatedHistory);
// // // // // // // // // // //           }
// // // // // // // // // // //         }
// // // // // // // // // // //       } catch (error) {
// // // // // // // // // // //         console.error("Error fetching response:", error);
// // // // // // // // // // //       } finally {
// // // // // // // // // // //         setIsThinking(false);
// // // // // // // // // // //       }
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, isThinking, addChatToHistory, chatHistory]);

// // // // // // // // // // //   const toggleFullScreen = () => {
// // // // // // // // // // //     setIsFullScreen(!isFullScreen);
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleModelChange = (value: string) => {
// // // // // // // // // // //     if (value !== currentModel) {
// // // // // // // // // // //       setCurrentModel(value);
// // // // // // // // // // //       setCurrentChat([]);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <motion.div
// // // // // // // // // // //       layout
// // // // // // // // // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // // // // // // // // //       initial={{ opacity: 0 }}
// // // // // // // // // // //       animate={{ opacity: 1 }}
// // // // // // // // // // //       exit={{ opacity: 0 }}
// // // // // // // // // // //     >
// // // // // // // // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // // // // // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // // // // // // // //         <div className="flex items-center space-x-2">
// // // // // // // // // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // // // // // // // // //             <SelectTrigger className="w-[180px]">
// // // // // // // // // // //               <SelectValue placeholder="Select RAG model" />
// // // // // // // // // // //             </SelectTrigger>
// // // // // // // // // // //             <SelectContent>
// // // // // // // // // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // // // // // // // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // // // // // // // // //             </SelectContent>
// // // // // // // // // // //           </Select>
// // // // // // // // // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // // // // // // // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // // // // // // // // //           </Button>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // // // // // //         <AnimatePresence>
// // // // // // // // // // //           {currentChat.map((message, index) => (
// // // // // // // // // // //             <motion.div
// // // // // // // // // // //               key={index}
// // // // // // // // // // //               initial={{ opacity: 0, y: 20 }}
// // // // // // // // // // //               animate={{ opacity: 1, y: 0 }}
// // // // // // // // // // //               exit={{ opacity: 0, y: -20 }}
// // // // // // // // // // //               transition={{ duration: 0.3 }}
// // // // // // // // // // //               className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}
// // // // // // // // // // //             >
// // // // // // // // // // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // // // // // // // // // //             </motion.div>
// // // // // // // // // // //           ))}
// // // // // // // // // // //         </AnimatePresence>
// // // // // // // // // // //         {isThinking && (
// // // // // // // // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
// // // // // // // // // // //             <RefreshCw className="h-5 w-5 animate-spin" />
// // // // // // // // // // //             <span>Thinking...</span>
// // // // // // // // // // //           </motion.div>
// // // // // // // // // // //         )}
// // // // // // // // // // //       </ScrollArea>
// // // // // // // // // // //       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
// // // // // // // // // // //         <div className="flex items-center space-x-2">
// // // // // // // // // // //           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here..." className="flex-grow" />
// // // // // // // // // // //           <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50" disabled={isThinking}>
// // // // // // // // // // //             <Send className="h-5 w-5" />
// // // // // // // // // // //           </Button>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </motion.div>
// // // // // // // // // // //   );
// // // // // // // // // // // }
// // // // // // // // // // "use client"

// // // // // // // // // // import { useState, useCallback, useEffect } from "react"
// // // // // // // // // // import { Button } from "@/components/ui/button"
// // // // // // // // // // import { Textarea } from "@/components/ui/textarea"
// // // // // // // // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // // // // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // // // // // // // import { motion, AnimatePresence } from "framer-motion"
// // // // // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // // // // // // interface ChatWindowProps {
// // // // // // // // // //   currentChat: string[]
// // // // // // // // // //   setCurrentChat: (chat: string[]) => void
// // // // // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // // // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // // // // // // // //   currentModel: string
// // // // // // // // // //   setCurrentModel: (model: string) => void
// // // // // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // // // // // // // }

// // // // // // // // // // function generateUUID() {
// // // // // // // // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // // // // // // // //     const r = (Math.random() * 16) | 0
// // // // // // // // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // // // // // // // //     return v.toString(16)
// // // // // // // // // //   })
// // // // // // // // // // }

// // // // // // // // // // export default function ChatWindow({
// // // // // // // // // //   currentChat,
// // // // // // // // // //   setCurrentChat,
// // // // // // // // // //   chatHistory,
// // // // // // // // // //   setChatHistory,
// // // // // // // // // //   currentModel,
// // // // // // // // // //   setCurrentModel,
// // // // // // // // // //   addChatToHistory,
// // // // // // // // // // }: ChatWindowProps) {
// // // // // // // // // //   const [input, setInput] = useState("")
// // // // // // // // // //   const [isThinking, setIsThinking] = useState(false)
// // // // // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const storedHistory = localStorage.getItem("chatHistory")
// // // // // // // // // //     if (storedHistory) {
// // // // // // // // // //       setChatHistory(JSON.parse(storedHistory))
// // // // // // // // // //     }
// // // // // // // // // //   }, [setChatHistory])

// // // // // // // // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // // // // // // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // // // // // // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // // // // // // // //   }, [])

// // // // // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // // // // //     if (input.trim() && !isThinking) {
// // // // // // // // // //       const newMessage = input.trim()
// // // // // // // // // //       const newChat = [...currentChat, newMessage]
// // // // // // // // // //       setCurrentChat(newChat)
// // // // // // // // // //       setInput("")
// // // // // // // // // //       setIsThinking(true)

// // // // // // // // // //       try {
// // // // // // // // // //         const endpoint = currentModel === "Humanai-V1" 
// // // // // // // // // //           ? "http://3.84.248.246:8000/summarize" 
// // // // // // // // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // // // // // // // //         const requestBody = currentModel === "Humanai-V1" 
// // // // // // // // // //           ? { query_text: newMessage }
// // // // // // // // // //           : { question: newMessage }

// // // // // // // // // //         const response = await fetch(endpoint, {
// // // // // // // // // //           method: "POST",
// // // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // // //           body: JSON.stringify(requestBody),
// // // // // // // // // //         })
        
// // // // // // // // // //         const data = await response.json()
// // // // // // // // // //         const botResponse = data.summary || data.response
// // // // // // // // // //         const updatedChat = [...newChat, botResponse]
// // // // // // // // // //         setCurrentChat(updatedChat)

// // // // // // // // // //         if (updatedChat.length === 2) {
// // // // // // // // // //           await addChatToHistory({
// // // // // // // // // //             title: generateChatTitle(updatedChat),
// // // // // // // // // //             messages: updatedChat,
// // // // // // // // // //             model: currentModel,
// // // // // // // // // //           })
// // // // // // // // // //         } else {
// // // // // // // // // //           const existingChatIndex = chatHistory.findIndex(
// // // // // // // // // //             (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]
// // // // // // // // // //           )
// // // // // // // // // //           if (existingChatIndex !== -1) {
// // // // // // // // // //             const updatedHistory = [...chatHistory]
// // // // // // // // // //             updatedHistory[existingChatIndex] = { ...updatedHistory[existingChatIndex], messages: updatedChat }
// // // // // // // // // //             setChatHistory(updatedHistory)
// // // // // // // // // //           }
// // // // // // // // // //         }
// // // // // // // // // //       } catch (error) {
// // // // // // // // // //         console.error("Error fetching response:", error)
// // // // // // // // // //       } finally {
// // // // // // // // // //         setIsThinking(false)
// // // // // // // // // //       }
// // // // // // // // // //     }
// // // // // // // // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, addChatToHistory, chatHistory])

// // // // // // // // // //   const toggleFullScreen = () => setIsFullScreen(!isFullScreen)
// // // // // // // // // //   const handleModelChange = (value: string) => {
// // // // // // // // // //     if (value !== currentModel) {
// // // // // // // // // //       setCurrentModel(value)
// // // // // // // // // //       setCurrentChat([])
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <motion.div
// // // // // // // // // //       layout
// // // // // // // // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // // // // // // // //       initial={{ opacity: 0 }}
// // // // // // // // // //       animate={{ opacity: 1 }}
// // // // // // // // // //       exit={{ opacity: 0 }}
// // // // // // // // // //     >
// // // // // // // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // // // // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // // // // // // //         <div className="flex items-center space-x-2">
// // // // // // // // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // // // // // // // //             <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select RAG model" /></SelectTrigger>
// // // // // // // // // //             <SelectContent>
// // // // // // // // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // // // // // // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // // // // // // // //             </SelectContent>
// // // // // // // // // //           </Select>
// // // // // // // // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // // // // // // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // // // // // // // //           </Button>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // // // // //         <AnimatePresence>
// // // // // // // // // //           {currentChat.map((message, index) => (
// // // // // // // // // //             <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
// // // // // // // // // //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// // // // // // // // // //             </motion.div>
// // // // // // // // // //           ))}
// // // // // // // // // //         </AnimatePresence>
// // // // // // // // // //       </ScrollArea>
// // // // // // // // // //     </motion.div>
// // // // // // // // // //   )
// // // // // // // // // // }

// // // // // // // // // "use client"

// // // // // // // // // import { useState, useCallback, useEffect } from "react"
// // // // // // // // // import { Button } from "@/components/ui/button"
// // // // // // // // // import { Textarea } from "@/components/ui/textarea"
// // // // // // // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // // // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // // // // // // import { motion, AnimatePresence } from "framer-motion"
// // // // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // // // // // interface ChatWindowProps {
// // // // // // // // //   currentChat: string[]
// // // // // // // // //   setCurrentChat: (chat: string[]) => void
// // // // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // // // // // // //   currentModel: string
// // // // // // // // //   setCurrentModel: (model: string) => void
// // // // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // // // // // // }

// // // // // // // // // export default function ChatWindow({
// // // // // // // // //   currentChat,
// // // // // // // // //   setCurrentChat,
// // // // // // // // //   chatHistory,
// // // // // // // // //   setChatHistory,
// // // // // // // // //   currentModel,
// // // // // // // // //   setCurrentModel,
// // // // // // // // //   addChatToHistory,
// // // // // // // // // }: ChatWindowProps) {
// // // // // // // // //   const [input, setInput] = useState("")
// // // // // // // // //   const [isThinking, setIsThinking] = useState(false)
// // // // // // // // //   const [isTyping, setIsTyping] = useState(false)
// // // // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // // // //     if (input.trim() && !isThinking) {
// // // // // // // // //       const newMessage = input.trim()
// // // // // // // // //       const newChat = [...currentChat, newMessage]
// // // // // // // // //       setCurrentChat(newChat)
// // // // // // // // //       setInput("")
// // // // // // // // //       setIsThinking(true)

// // // // // // // // //       try {
// // // // // // // // //         const endpoint = currentModel === "Humanai-V1" 
// // // // // // // // //           ? "http://3.84.248.246:8000/summarize" 
// // // // // // // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // // // // // // //         const requestBody = currentModel === "Humanai-V1" 
// // // // // // // // //           ? { query_text: newMessage }
// // // // // // // // //           : { question: newMessage }

// // // // // // // // //         const response = await fetch(endpoint, {
// // // // // // // // //           method: "POST",
// // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // //           body: JSON.stringify(requestBody),
// // // // // // // // //         })
        
// // // // // // // // //         const data = await response.json()
// // // // // // // // //         const botResponse = data.summary || data.response || `(${currentModel}) I couldn't generate a response.`
        
// // // // // // // // //         setIsThinking(false)
// // // // // // // // //         setIsTyping(true)

// // // // // // // // //         setTimeout(() => {
// // // // // // // // //           setCurrentChat([...newChat, botResponse])
// // // // // // // // //           setIsTyping(false)
// // // // // // // // //         }, 1000)
// // // // // // // // //       } catch (error) {
// // // // // // // // //         console.error("Error fetching response:", error)
// // // // // // // // //         setIsThinking(false)
// // // // // // // // //         setCurrentChat([...newChat, `(${currentModel}) I couldn't generate a response.`])
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   }, [input, currentChat, setCurrentChat, currentModel, isThinking])

// // // // // // // // //   return (
// // // // // // // // //     <motion.div className={`relative h-[600px] bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
// // // // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // // // //         <AnimatePresence>
// // // // // // // // //           {currentChat.map((message, index) => (
// // // // // // // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>
// // // // // // // // //               {message}
// // // // // // // // //             </motion.div>
// // // // // // // // //           ))}
// // // // // // // // //         </AnimatePresence>
// // // // // // // // //         {isThinking && <div className="text-gray-500">Thinking...</div>}
// // // // // // // // //         {isTyping && <div className="text-gray-500">Typing...</div>}
// // // // // // // // //       </ScrollArea>
// // // // // // // // //       <div className="p-4 flex items-center gap-2">
// // // // // // // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // // // // // // //         <Button onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
// // // // // // // // //       </div>
// // // // // // // // //     </motion.div>
// // // // // // // // //   )
// // // // // // // // // }
// // // // // // // // "use client"

// // // // // // // // import { useState, useCallback, useEffect } from "react"
// // // // // // // // import { Button } from "@/components/ui/button"
// // // // // // // // import { Textarea } from "@/components/ui/textarea"
// // // // // // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // // // // // import { motion, AnimatePresence } from "framer-motion"
// // // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // // // // interface ChatWindowProps {
// // // // // // // //   currentChat: string[]
// // // // // // // //   setCurrentChat: (chat: string[]) => void
// // // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // // // // // //   currentModel: string
// // // // // // // //   setCurrentModel: (model: string) => void
// // // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // // // // // }

// // // // // // // // function generateUUID() {
// // // // // // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // // // // // //     const r = (Math.random() * 16) | 0
// // // // // // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // // // // // //     return v.toString(16)
// // // // // // // //   })
// // // // // // // // }

// // // // // // // // export default function ChatWindow({
// // // // // // // //   currentChat,
// // // // // // // //   setCurrentChat,
// // // // // // // //   chatHistory,
// // // // // // // //   setChatHistory,
// // // // // // // //   currentModel,
// // // // // // // //   setCurrentModel,
// // // // // // // //   addChatToHistory,
// // // // // // // // }: ChatWindowProps) {
// // // // // // // //   const [input, setInput] = useState("")
// // // // // // // //   const [isThinking, setIsThinking] = useState(false)
// // // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // // // // // //   useEffect(() => {
// // // // // // // //     const storedHistory = localStorage.getItem("chatHistory")
// // // // // // // //     if (storedHistory) {
// // // // // // // //       setChatHistory(JSON.parse(storedHistory))
// // // // // // // //     }
// // // // // // // //   }, [setChatHistory])

// // // // // // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // // // // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // // // // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // // // // // //   }, [])

// // // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // // //     if (input.trim() && !isThinking) {
// // // // // // // //       const newMessage = input.trim()
// // // // // // // //       const newChat = [...currentChat, newMessage]
// // // // // // // //       setCurrentChat(newChat)
// // // // // // // //       setInput("")
// // // // // // // //       setIsThinking(true)

// // // // // // // //       try {
// // // // // // // //         const endpoint = currentModel === "Humanai-V1" 
// // // // // // // //           ? "http://3.84.248.246:8000/summarize" 
// // // // // // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // // // // // //         const requestBody = currentModel === "Humanai-V1" 
// // // // // // // //           ? { query_text: newMessage }
// // // // // // // //           : { question: newMessage }

// // // // // // // //         const response = await fetch(endpoint, {
// // // // // // // //           method: "POST",
// // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // //           body: JSON.stringify(requestBody),
// // // // // // // //         })
        
// // // // // // // //         const data = await response.json()
// // // // // // // //         const botResponse = data.summary || data.response || `(${currentModel} has no response)`
// // // // // // // //         const updatedChat = [...newChat, botResponse]
// // // // // // // //         setCurrentChat(updatedChat)

// // // // // // // //         if (updatedChat.length === 2) {
// // // // // // // //           await addChatToHistory({
// // // // // // // //             title: generateChatTitle(updatedChat),
// // // // // // // //             messages: updatedChat,
// // // // // // // //             model: currentModel,
// // // // // // // //           })
// // // // // // // //         } else {
// // // // // // // //           const existingChatIndex = chatHistory.findIndex(
// // // // // // // //             (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]
// // // // // // // //           )
// // // // // // // //           if (existingChatIndex !== -1) {
// // // // // // // //             const updatedHistory = [...chatHistory]
// // // // // // // //             updatedHistory[existingChatIndex] = { ...updatedHistory[existingChatIndex], messages: updatedChat }
// // // // // // // //             setChatHistory(updatedHistory)
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       } catch (error) {
// // // // // // // //         console.error("Error fetching response:", error)
// // // // // // // //       } finally {
// // // // // // // //         setIsThinking(false)
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, addChatToHistory, chatHistory])

// // // // // // // //   const toggleFullScreen = () => setIsFullScreen(!isFullScreen)
// // // // // // // //   const handleModelChange = (value: string) => {
// // // // // // // //     if (value !== currentModel) {
// // // // // // // //       setCurrentModel(value)
// // // // // // // //       setCurrentChat([])
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <motion.div
// // // // // // // //       layout
// // // // // // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // // // // // //       initial={{ opacity: 0 }}
// // // // // // // //       animate={{ opacity: 1 }}
// // // // // // // //       exit={{ opacity: 0 }}
// // // // // // // //     >
// // // // // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // // // // //         <div className="flex items-center space-x-2">
// // // // // // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // // // // // //             <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select RAG model" /></SelectTrigger>
// // // // // // // //             <SelectContent>
// // // // // // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // // // // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // // // // // //             </SelectContent>
// // // // // // // //           </Select>
// // // // // // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // // // // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // // // // // //           </Button>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // // //         <AnimatePresence>
// // // // // // // //           {currentChat.map((message, index) => (
// // // // // // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
// // // // // // // //           ))}
// // // // // // // //         </AnimatePresence>
// // // // // // // //       </ScrollArea>
// // // // // // // //       <div className="p-4 flex items-center gap-2">
// // // // // // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // // // // // //         <Button onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
// // // // // // // //       </div>
// // // // // // // //     </motion.div>
// // // // // // // //   )
// // // // // // // // }
// // // // // // // "use client"

// // // // // // // import { useState, useCallback, useEffect } from "react"
// // // // // // // import { Button } from "@/components/ui/button"
// // // // // // // import { Textarea } from "@/components/ui/textarea"
// // // // // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // // // // import { motion, AnimatePresence } from "framer-motion"
// // // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // // // interface ChatWindowProps {
// // // // // // //   currentChat: string[]
// // // // // // //   setCurrentChat: (chat: string[]) => void
// // // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // // // // //   currentModel: string
// // // // // // //   setCurrentModel: (model: string) => void
// // // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // // // // }

// // // // // // // function generateUUID() {
// // // // // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // // // // //     const r = (Math.random() * 16) | 0
// // // // // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // // // // //     return v.toString(16)
// // // // // // //   })
// // // // // // // }

// // // // // // // export default function ChatWindow({
// // // // // // //   currentChat,
// // // // // // //   setCurrentChat,
// // // // // // //   chatHistory,
// // // // // // //   setChatHistory,
// // // // // // //   currentModel,
// // // // // // //   setCurrentModel,
// // // // // // //   addChatToHistory,
// // // // // // // }: ChatWindowProps) {
// // // // // // //   const [input, setInput] = useState("")
// // // // // // //   const [isThinking, setIsThinking] = useState(false)
// // // // // // //   const [isTyping, setIsTyping] = useState(false)
// // // // // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // // // // //   useEffect(() => {
// // // // // // //     const storedHistory = localStorage.getItem("chatHistory")
// // // // // // //     if (storedHistory) {
// // // // // // //       setChatHistory(JSON.parse(storedHistory))
// // // // // // //     }
// // // // // // //   }, [setChatHistory])

// // // // // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // // // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // // // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // // // // //   }, [])

// // // // // // //   const sendMessage = useCallback(async () => {
// // // // // // //     if (input.trim() && !isThinking) {
// // // // // // //       const newMessage = input.trim()
// // // // // // //       const newChat = [...currentChat, newMessage]
// // // // // // //       setCurrentChat(newChat)
// // // // // // //       setInput("")
// // // // // // //       setIsThinking(true)

// // // // // // //       try {
// // // // // // //         const endpoint = currentModel === "Humanai-V1" 
// // // // // // //           ? "http://3.84.248.246:8000/summarize" 
// // // // // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // // // // //         const requestBody = currentModel === "Humanai-V1" 
// // // // // // //           ? { query_text: newMessage }
// // // // // // //           : { question: newMessage }

// // // // // // //         const response = await fetch(endpoint, {
// // // // // // //           method: "POST",
// // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // //           body: JSON.stringify(requestBody),
// // // // // // //         })
        
// // // // // // //         setIsThinking(false)
// // // // // // //         setIsTyping(true)
        
// // // // // // //         const data = await response.json()
// // // // // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`
        
// // // // // // //         setIsTyping(false)
// // // // // // //         const updatedChat = [...newChat, botResponse]
// // // // // // //         setCurrentChat(updatedChat)

// // // // // // //         if (updatedChat.length === 2) {
// // // // // // //           await addChatToHistory({
// // // // // // //             title: generateChatTitle(updatedChat),
// // // // // // //             messages: updatedChat,
// // // // // // //             model: currentModel,
// // // // // // //           })
// // // // // // //         } else {
// // // // // // //           const existingChatIndex = chatHistory.findIndex(
// // // // // // //             (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]
// // // // // // //           )
// // // // // // //           if (existingChatIndex !== -1) {
// // // // // // //             const updatedHistory = [...chatHistory]
// // // // // // //             updatedHistory[existingChatIndex] = { ...updatedHistory[existingChatIndex], messages: updatedChat }
// // // // // // //             setChatHistory(updatedHistory)
// // // // // // //           }
// // // // // // //         }
// // // // // // //       } catch (error) {
// // // // // // //         console.error("Error fetching response:", error)
// // // // // // //         setIsThinking(false)
// // // // // // //         setCurrentChat([...newChat, `No response from ${currentModel}`])
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, addChatToHistory, chatHistory])

// // // // // // //   const toggleFullScreen = () => setIsFullScreen(!isFullScreen)
// // // // // // //   const handleModelChange = (value: string) => {
// // // // // // //     if (value !== currentModel) {
// // // // // // //       setCurrentModel(value)
// // // // // // //       setCurrentChat([])
// // // // // // //     }
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <motion.div
// // // // // // //       layout
// // // // // // //       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
// // // // // // //       initial={{ opacity: 0 }}
// // // // // // //       animate={{ opacity: 1 }}
// // // // // // //       exit={{ opacity: 0 }}
// // // // // // //     >
// // // // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // // // //         <div className="flex items-center space-x-2">
// // // // // // //           <Select value={currentModel} onValueChange={handleModelChange}>
// // // // // // //             <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select RAG model" /></SelectTrigger>
// // // // // // //             <SelectContent>
// // // // // // //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // // // // //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // // // // //             </SelectContent>
// // // // // // //           </Select>
// // // // // // //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// // // // // // //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // // // // //           </Button>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // // //         <AnimatePresence>
// // // // // // //           {currentChat.map((message, index) => (
// // // // // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
// // // // // // //           ))}
// // // // // // //         </AnimatePresence>
// // // // // // //       </ScrollArea>
// // // // // // //       <div className="p-4 flex items-center gap-2">
// // // // // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // // // // //         <Button onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
// // // // // // //       </div>
// // // // // // //     </motion.div>
// // // // // // //   )
// // // // // // // }
// // // // // // "use client"

// // // // // // import { useState, useCallback, useEffect } from "react"
// // // // // // import { Button } from "@/components/ui/button"
// // // // // // import { Textarea } from "@/components/ui/textarea"
// // // // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // // // import { motion, AnimatePresence } from "framer-motion"
// // // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // // interface ChatWindowProps {
// // // // // //   currentChat: string[]
// // // // // //   setCurrentChat: (chat: string[]) => void
// // // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // // // //   currentModel: string
// // // // // //   setCurrentModel: (model: string) => void
// // // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // // // }

// // // // // // function generateUUID() {
// // // // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // // // //     const r = (Math.random() * 16) | 0
// // // // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // // // //     return v.toString(16)
// // // // // //   })
// // // // // // }

// // // // // // export default function ChatWindow({
// // // // // //   currentChat,
// // // // // //   setCurrentChat,
// // // // // //   chatHistory,
// // // // // //   setChatHistory,
// // // // // //   currentModel,
// // // // // //   setCurrentModel,
// // // // // //   addChatToHistory,
// // // // // // }: ChatWindowProps) {
// // // // // //   const [input, setInput] = useState("")
// // // // // //   const [isThinking, setIsThinking] = useState(false)
// // // // // //   const [isTyping, setIsTyping] = useState(false)
// // // // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // // // //   useEffect(() => {
// // // // // //     const storedHistory = localStorage.getItem("chatHistory")
// // // // // //     if (storedHistory) {
// // // // // //       setChatHistory(JSON.parse(storedHistory))
// // // // // //     }
// // // // // //   }, [setChatHistory])

// // // // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // // // //   }, [])

// // // // // //   const sendMessage = useCallback(async () => {
// // // // // //     if (input.trim() && !isThinking) {
// // // // // //       const newMessage = input.trim()
// // // // // //       const newChat = [...currentChat, newMessage]
// // // // // //       setCurrentChat(newChat)
// // // // // //       setInput("")
// // // // // //       setIsThinking(true)

// // // // // //       try {
// // // // // //         const endpoint = currentModel === "Humanai-V1" 
// // // // // //           ? "http://3.84.248.246:8000/summarize" 
// // // // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // // // //         const requestBody = currentModel === "Humanai-V1" 
// // // // // //           ? { query_text: newMessage }
// // // // // //           : { question: newMessage }

// // // // // //         const response = await fetch(endpoint, {
// // // // // //           method: "POST",
// // // // // //           headers: { "Content-Type": "application/json" },
// // // // // //           body: JSON.stringify(requestBody),
// // // // // //         })
        
// // // // // //         setIsThinking(false)
// // // // // //         setIsTyping(true)
        
// // // // // //         const data = await response.json()
// // // // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`
        
// // // // // //         setIsTyping(false)
// // // // // //         const updatedChat = [...newChat, botResponse]
// // // // // //         setCurrentChat(updatedChat)

// // // // // //         if (updatedChat.length === 2) {
// // // // // //           await addChatToHistory({
// // // // // //             title: generateChatTitle(updatedChat),
// // // // // //             messages: updatedChat,
// // // // // //             model: currentModel,
// // // // // //           })
// // // // // //         } else {
// // // // // //           const existingChatIndex = chatHistory.findIndex(
// // // // // //             (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]
// // // // // //           )
// // // // // //           if (existingChatIndex !== -1) {
// // // // // //             const updatedHistory = [...chatHistory]
// // // // // //             updatedHistory[existingChatIndex] = { ...updatedHistory[existingChatIndex], messages: updatedChat }
// // // // // //             setChatHistory(updatedHistory)
// // // // // //           }
// // // // // //         }
// // // // // //       } catch (error) {
// // // // // //         console.error("Error fetching response:", error)
// // // // // //         setIsThinking(false)
// // // // // //         setCurrentChat([...newChat, `No response from ${currentModel}`])
// // // // // //       }
// // // // // //     }
// // // // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, addChatToHistory, chatHistory])

// // // // // //   const toggleFullScreen = () => setIsFullScreen(!isFullScreen)
// // // // // //   const handleModelChange = (value: string) => {
// // // // // //     if (value !== currentModel) {
// // // // // //       setCurrentModel(value)
// // // // // //       setCurrentChat([])
// // // // // //     }
// // // // // //   }

// // // // // //   return (
// // // // // //     <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
// // // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // // //       </div>
// // // // // //       <ScrollArea className="flex-grow p-4">
// // // // // //         <AnimatePresence>
// // // // // //           {currentChat.map((message, index) => (
// // // // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
// // // // // //           ))}
// // // // // //           {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
// // // // // //         </AnimatePresence>
// // // // // //       </ScrollArea>
// // // // // //       <div className="p-4 flex items-center gap-2">
// // // // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // // // //         <Button onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
// // // // // //       </div>
// // // // // //     </motion.div>
// // // // // //   )
// // // // // // }



// // // // // "use client"

// // // // // import { useState, useCallback, useEffect } from "react"
// // // // // import { Button } from "@/components/ui/button"
// // // // // import { Textarea } from "@/components/ui/textarea"
// // // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // // import { motion, AnimatePresence } from "framer-motion"
// // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // interface ChatWindowProps {
// // // // //   currentChat: string[]
// // // // //   setCurrentChat: (chat: string[]) => void
// // // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // // //   currentModel: string
// // // // //   setCurrentModel: (model: string) => void
// // // // //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>
// // // // // }

// // // // // function generateUUID() {
// // // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // // //     const r = (Math.random() * 16) | 0
// // // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // // //     return v.toString(16)
// // // // //   })
// // // // // }

// // // // // export default function ChatWindow({
// // // // //   currentChat,
// // // // //   setCurrentChat,
// // // // //   chatHistory,
// // // // //   setChatHistory,
// // // // //   currentModel,
// // // // //   setCurrentModel,
// // // // //   addChatToHistory,
// // // // // }: ChatWindowProps) {
// // // // //   const [input, setInput] = useState("")
// // // // //   const [isThinking, setIsThinking] = useState(false)
// // // // //   const [isTyping, setIsTyping] = useState(false)
// // // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // // //   useEffect(() => {
// // // // //     const storedHistory = localStorage.getItem("chatHistory")
// // // // //     if (storedHistory) {
// // // // //       setChatHistory(JSON.parse(storedHistory))
// // // // //     }
// // // // //   }, [setChatHistory])

// // // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // // //   }, [])

// // // // //   const sendMessage = useCallback(async () => {
// // // // //     if (input.trim() && !isThinking) {
// // // // //       const newMessage = input.trim()
// // // // //       const newChat = [...currentChat, newMessage]
// // // // //       setCurrentChat(newChat)
// // // // //       setInput("")
// // // // //       setIsThinking(true)

// // // // //       try {
// // // // //         const endpoint = currentModel === "Humanai-V1" 
// // // // //           ? "http://3.84.248.246:8000/summarize" 
// // // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // // //         const requestBody = currentModel === "Humanai-V1" 
// // // // //           ? { query_text: newMessage }
// // // // //           : { question: newMessage }

// // // // //         const response = await fetch(endpoint, {
// // // // //           method: "POST",
// // // // //           headers: { "Content-Type": "application/json" },
// // // // //           body: JSON.stringify(requestBody),
// // // // //         })
        
// // // // //         setIsThinking(false)
// // // // //         setIsTyping(true)
        
// // // // //         const data = await response.json()
// // // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`
        
// // // // //         setIsTyping(false)
// // // // //         const updatedChat = [...newChat, botResponse]
// // // // //         setCurrentChat(updatedChat)

// // // // //         if (updatedChat.length === 2) {
// // // // //           await addChatToHistory({
// // // // //             title: generateChatTitle(updatedChat),
// // // // //             messages: updatedChat,
// // // // //             model: currentModel,
// // // // //           })
// // // // //         } else {
// // // // //           const existingChatIndex = chatHistory.findIndex(
// // // // //             (chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]
// // // // //           )
// // // // //           if (existingChatIndex !== -1) {
// // // // //             const updatedHistory = [...chatHistory]
// // // // //             updatedHistory[existingChatIndex] = { ...updatedHistory[existingChatIndex], messages: updatedChat }
// // // // //             setChatHistory(updatedHistory)
// // // // //           }
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error("Error fetching response:", error)
// // // // //         setIsThinking(false)
// // // // //         setCurrentChat([...newChat, `No response from ${currentModel}`])
// // // // //       }
// // // // //     }
// // // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, addChatToHistory, chatHistory])

// // // // //   const toggleFullScreen = () => setIsFullScreen(!isFullScreen)
// // // // //   const handleModelChange = (value: string) => {
// // // // //     if (value !== currentModel) {
// // // // //       setCurrentModel(value)
// // // // //       setCurrentChat([])
// // // // //     }
// // // // //   }

// // // // //   return (
// // // // //     <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
// // // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // // //         <Select value={currentModel} onValueChange={handleModelChange}>
// // // // //           <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select RAG model" /></SelectTrigger>
// // // // //           <SelectContent>
// // // // //             <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // // //             <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // // //           </SelectContent>
// // // // //         </Select>
// // // // //       </div>
// // // // //       <ScrollArea className="flex-grow p-4">
// // // // //         <AnimatePresence>
// // // // //           {currentChat.map((message, index) => (
// // // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
// // // // //           ))}
// // // // //           {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
// // // // //         </AnimatePresence>
// // // // //       </ScrollArea>
// // // // //       <div className="p-4 flex items-center gap-2">
// // // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // // //         <Button onClick={sendMessage} disabled={isThinking} className="bg-blue-600 hover:bg-blue-700"><Send className="h-5 w-5" /></Button>
// // // // //       </div>
// // // // //     </motion.div>
// // // // //   )
// // // // // }


// // // // "use client"

// // // // import { useState, useCallback, useEffect } from "react"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Textarea } from "@/components/ui/textarea"
// // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // import { motion, AnimatePresence } from "framer-motion"
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // // import { db } from "../../firebase/config";
// // // // import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

// // // // interface ChatWindowProps {
// // // //   currentChat: string[]
// // // //   setCurrentChat: (chat: string[]) => void
// // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // //   currentModel: string
// // // //   setCurrentModel: (model: string) => void
// // // // }

// // // // function generateUUID() {
// // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // //     const r = (Math.random() * 16) | 0
// // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // //     return v.toString(16)
// // // //   })
// // // // }

// // // // export default function ChatWindow({
// // // //   currentChat,
// // // //   setCurrentChat,
// // // //   chatHistory,
// // // //   setChatHistory,
// // // //   currentModel,
// // // //   setCurrentModel,
// // // // }: ChatWindowProps) {
// // // //   const [input, setInput] = useState("")
// // // //   const [isThinking, setIsThinking] = useState(false)
// // // //   const [isTyping, setIsTyping] = useState(false)
// // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // //   useEffect(() => {
// // // //     const fetchChatHistory = async () => {
// // // //       const q = query(collection(db, "chats"));
// // // //       const querySnapshot = await getDocs(q);
// // // //       const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //       setChatHistory(chats as any);
// // // //     };
// // // //     fetchChatHistory();
// // // //   }, [setChatHistory]);

// // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // //   }, [])

// // // //   const sendMessage = useCallback(async () => {
// // // //     if (input.trim() && !isThinking) {
// // // //       const newMessage = input.trim()
// // // //       const newChat = [...currentChat, newMessage]
// // // //       setCurrentChat(newChat)
// // // //       setInput("")
// // // //       setIsThinking(true)

// // // //       try {
// // // //         const endpoint = currentModel === "Humanai-V1" 
// // // //           ? "http://54.89.223.159:8000/summarize" 
// // // //           : "http://54.166.204.83:8000/synthesize/"
        
// // // //         const requestBody = currentModel === "Humanai-V1" 
// // // //           ? { query_text: newMessage }
// // // //           : { question: newMessage }

// // // //         const response = await fetch(endpoint, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify(requestBody),
// // // //         })
        
// // // //         setIsThinking(false)
// // // //         setIsTyping(true)
        
// // // //         const data = await response.json()
// // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`
        
// // // //         setIsTyping(false)
// // // //         const updatedChat = [...newChat, botResponse]
// // // //         setCurrentChat(updatedChat)

// // // //         if (updatedChat.length === 2) {
// // // //           const docRef = await addDoc(collection(db, "chats"), {
// // // //             title: generateChatTitle(updatedChat),
// // // //             messages: updatedChat,
// // // //             model: currentModel,
// // // //           });
// // // //           setChatHistory(prev => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// // // //         } else {
// // // //           const existingChat = chatHistory.find(chat => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// // // //           if (existingChat) {
// // // //             const docRef = doc(db, "chats", existingChat.id);
// // // //             await updateDoc(docRef, { messages: updatedChat });
// // // //             setChatHistory(prev => prev.map(chat => chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat));
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching response:", error)
// // // //         setIsThinking(false)
// // // //         setCurrentChat([...newChat, `No response from ${currentModel}`])
// // // //       }
// // // //     }
// // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory])

// // // //   return (
// // // //     <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
// // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // //         <Select value={currentModel} onValueChange={setCurrentModel}>
// // // //           <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select RAG model" /></SelectTrigger>
// // // //           <SelectContent>
// // // //             <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // //             <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // //           </SelectContent>
// // // //         </Select>
// // // //       </div>
// // // //       <ScrollArea className="flex-grow p-4">
// // // //         <AnimatePresence>
// // // //           {currentChat.map((message, index) => (
// // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
// // // //           ))}
// // // //           {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
// // // //         </AnimatePresence>
// // // //       </ScrollArea>
// // // //       <div className="p-4 flex items-center gap-2">
// // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // //         <Button onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
// // // //       </div>
// // // //     </motion.div>
// // // //   )
// // // // }

// // // // "use client"

// // // // import { useState, useCallback, useEffect } from "react"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Textarea } from "@/components/ui/textarea"
// // // // import { ScrollArea } from "@/components/ui/scroll-area"
// // // // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
// // // // import { motion, AnimatePresence } from "framer-motion"
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // // import { db } from "../../firebase/config";
// // // // import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

// // // // interface ChatWindowProps {
// // // //   currentChat: string[]
// // // //   setCurrentChat: (chat: string[]) => void
// // // //   chatHistory: { id: string; title: string; messages: string[]; model: string }[]
// // // //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void
// // // //   currentModel: string
// // // //   setCurrentModel: (model: string) => void
// // // // }

// // // // function generateUUID() {
// // // //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// // // //     const r = (Math.random() * 16) | 0
// // // //     const v = c === "x" ? r : (r & 0x3) | 0x8
// // // //     return v.toString(16)
// // // //   })
// // // // }

// // // // export default function ChatWindow({
// // // //   currentChat,
// // // //   setCurrentChat,
// // // //   chatHistory,
// // // //   setChatHistory,
// // // //   currentModel,
// // // //   setCurrentModel,
// // // // }: ChatWindowProps) {
// // // //   const [input, setInput] = useState("")
// // // //   const [isThinking, setIsThinking] = useState(false)
// // // //   const [isTyping, setIsTyping] = useState(false)
// // // //   const [isFullScreen, setIsFullScreen] = useState(false)

// // // //   useEffect(() => {
// // // //     const fetchChatHistory = async () => {
// // // //       const q = query(collection(db, "chats"));
// // // //       const querySnapshot = await getDocs(q);
// // // //       const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //       setChatHistory(chats as any);
// // // //     };
// // // //     fetchChatHistory();
// // // //   }, [setChatHistory]);

// // // //   const generateChatTitle = useCallback((messages: string[]) => {
// // // //     const firstUserMessage = messages.find((_, index) => index % 2 === 0)
// // // //     return firstUserMessage ? (firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage) : "New Chat"
// // // //   }, [])

// // // //   const sendMessage = useCallback(async () => {
// // // //     if (input.trim() && !isThinking) {
// // // //       const newMessage = input.trim()
// // // //       const newChat = [...currentChat, newMessage]
// // // //       setCurrentChat(newChat)
// // // //       setInput("")
// // // //       setIsThinking(true)

// // // //       try {
// // // //         const endpoint = currentModel === "Humanai-V1" 
// // // //           ? "http://3.84.248.246:8000/summarize" 
// // // //           : "http://54.196.122.63:8000/synthesize/"
        
// // // //         const requestBody = currentModel === "Humanai-V1" 
// // // //           ? { query_text: newMessage }
// // // //           : { question: newMessage }

// // // //         const response = await fetch(endpoint, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify(requestBody),
// // // //         })
        
// // // //         setIsThinking(false)
// // // //         setIsTyping(true)
        
// // // //         const data = await response.json()
// // // //         const botResponse = data.summary || data.response || `No response from ${currentModel}`
        
// // // //         setIsTyping(false)
// // // //         const updatedChat = [...newChat, botResponse]
// // // //         setCurrentChat(updatedChat)

// // // //         if (updatedChat.length === 2) {
// // // //           const docRef = await addDoc(collection(db, "chats"), {
// // // //             title: generateChatTitle(updatedChat),
// // // //             messages: updatedChat,
// // // //             model: currentModel,
// // // //           });
// // // //           setChatHistory(prev => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// // // //         } else {
// // // //           const existingChat = chatHistory.find(chat => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// // // //           if (existingChat) {
// // // //             const docRef = doc(db, "chats", existingChat.id);
// // // //             await updateDoc(docRef, { messages: updatedChat });
// // // //             setChatHistory(prev => prev.map(chat => chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat));
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching response:", error)
// // // //         setIsThinking(false)
// // // //         setCurrentChat([...newChat, `No response from ${currentModel}`])
// // // //       }
// // // //     }
// // // //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory])

// // // //   return (
// // // //     <motion.div layout className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}>
// // // //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// // // //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat with Human Rights RAG Bot</h2>
// // // //         <Select value={currentModel} onValueChange={setCurrentModel}>
// // // //           <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select RAG model" /></SelectTrigger>
// // // //           <SelectContent>
// // // //             <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// // // //             <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// // // //           </SelectContent>
// // // //         </Select>
// // // //         <Button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2">
// // // //           {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// // // //         </Button>
// // // //       </div>
// // // //       <ScrollArea className="flex-grow p-4">
// // // //         <AnimatePresence>
// // // //           {currentChat.map((message, index) => (
// // // //             <motion.div key={index} className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%]`}>{message}</motion.div>
// // // //           ))}
// // // //           {isThinking && <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Thinking...</div>}
// // // //         </AnimatePresence>
// // // //       </ScrollArea>
// // // //       <div className="p-4 flex items-center gap-2">
// // // //         <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1" />
// // // //         <Button onClick={sendMessage} disabled={isThinking}><Send className="h-5 w-5" /></Button>
// // // //       </div>
// // // //     </motion.div>
// // // //   )
// // // // }

// // "use client"

// // import { useState, useCallback, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // interface ChatWindowProps {
// //   currentChat: string[];
// //   setCurrentChat: (chat: string[]) => void;
// //   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
// //   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
// //   currentModel: string;
// //   setCurrentModel: (model: string) => void;
// //   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
// // }

// // function generateUUID() {
// //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
// //     const r = (Math.random() * 16) | 0;
// //     const v = c === "x" ? r : (r & 0x3) | 0x8;
// //     return v.toString(16);
// //   });
// // }

// // export default function ChatWindow({
// //   currentChat,
// //   setCurrentChat,
// //   chatHistory,
// //   setChatHistory,
// //   currentModel,
// //   setCurrentModel,
// //   addChatToHistory,
// // }: ChatWindowProps) {
// //   const [input, setInput] = useState("");
// //   const [isThinking, setIsThinking] = useState(false);
// //   const [isFullScreen, setIsFullScreen] = useState(false);

// //   useEffect(() => {
// //     // Load chat history from localStorage
// //     const storedHistory = localStorage.getItem("chatHistory");
// //     if (storedHistory) {
// //       setChatHistory(JSON.parse(storedHistory));
// //     }
// //   }, [setChatHistory]);

// //   const generateChatTitle = useCallback((messages: string[]) => {
// //     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
// //     if (firstUserMessage) {
// //       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
// //     }
// //     return "New Chat";
// //   }, []);

// //   const sendMessage = useCallback(async () => {
// //     if (input.trim() && !isThinking) {
// //       const newMessage = input.trim();
// //       const newChat = [...currentChat, newMessage];
// //       setCurrentChat(newChat);
// //       setInput("");
// //       setIsThinking(true);

// //       try {
// //         const endpoint = currentModel === "Humanai-V1"
// //           ? "http://54.89.223.159:8000/summarize"
// //           : "http://54.166.204.83:8000/synthesize/";

// //         const requestBody = currentModel === "Humanai-V1"
// //           ? { query_text: newMessage }
// //           : { question: newMessage };

// //         const response = await fetch(endpoint, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(requestBody),
// //         });

// //         setIsThinking(false);

// //         const data = await response.json();
// //         const botResponse = data.summary || data.response || No response from ${currentModel};

// //         setIsThinking(false);
// //         const updatedChat = [...newChat, botResponse];
// //         setCurrentChat(updatedChat);

// //         if (updatedChat.length === 2) {
// //           const docRef = await addDoc(collection(db, "chats"), {
// //             title: generateChatTitle(updatedChat),
// //             messages: updatedChat,
// //             model: currentModel,
// //           });
// //           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
// //         } else {
// //           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
// //           if (existingChat) {
// //             const docRef = doc(db, "chats", existingChat.id);
// //             await updateDoc(docRef, { messages: updatedChat });
// //             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Error fetching response:", error);
// //         setIsThinking(false);
// //         setCurrentChat([...newChat, No response from ${currentModel}]);
// //       }
// //     }
// //   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

// //   useEffect(() => {
// //     const handleKeyPress = (e: KeyboardEvent) => {
// //       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// //         e.preventDefault();
// //         sendMessage();
// //       }
// //     };

// //     window.addEventListener("keypress", handleKeyPress);
// //     return () => window.removeEventListener("keypress", handleKeyPress);
// //   }, [sendMessage, isThinking]);

// //   const toggleFullScreen = () => {
// //     setIsFullScreen(!isFullScreen);
// //   };

// //   const handleModelChange = (value: string) => {
// //     if (value !== currentModel) {
// //       setCurrentModel(value);
// //       setCurrentChat([]);
// //     }
// //   };

// //   return (
// //     <motion.div
// //       layout
// //       className={${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg}
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       exit={{ opacity: 0 }}
// //     >
// //       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
// //         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
// //         <div className="flex items-center space-x-2">
// //           <Select value={currentModel} onValueChange={handleModelChange}>
// //             <SelectTrigger className="w-[180px]">
// //               <SelectValue placeholder="Select RAG model" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
// //               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
// //             </SelectContent>
// //           </Select>
// //           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
// //             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
// //           </Button>
// //         </div>
// //       </div>
// //       <ScrollArea className="flex-grow p-4">
// //         <AnimatePresence>
// //           {currentChat.map((message, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -20 }}
// //               transition={{ duration: 0.3 }}
// //               className={mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}}
// //             >
// //               <p className="text-gray-800 dark:text-gray-200">{message}</p>
// //             </motion.div>
// //           ))}
// //         </AnimatePresence>
// //         {isThinking && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
// //             <RefreshCw className="h-5 w-5 animate-spin" />
// //             <span>Thinking...</span>
// //           </motion.div>
// //         )}
// //       </ScrollArea>
// //       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
// //         <div className="flex items-center space-x-2">
// //           <Textarea
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             placeholder="Type your message here..."
// //             className="flex-grow"
// //             onKeyPress={(e) => {
// //               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
// //                 e.preventDefault();
// //                 sendMessage();
// //               }
// //             }}
// //           />
// //           <Button
// //             variant="primary"
// //             className="ml-2"
// //             onClick={sendMessage}
// //             disabled={isThinking || !input.trim()}
// //           >
// //             <Send className="h-5 w-5" />
// //           </Button>
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // })

// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface ChatWindowProps {
//   currentChat: string[];
//   setCurrentChat: (chat: string[]) => void;
//   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
//   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
//   currentModel: string;
//   setCurrentModel: (model: string) => void;
//   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
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
//   addChatToHistory,
// }: ChatWindowProps) {
//   const [input, setInput] = useState("");
//   const [isThinking, setIsThinking] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     // Load chat history from localStorage
//     const storedHistory = localStorage.getItem("chatHistory");
//     if (storedHistory) {
//       setChatHistory(JSON.parse(storedHistory));
//     }
//   }, [setChatHistory]);

//   const generateChatTitle = useCallback((messages: string[]) => {
//     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
//     if (firstUserMessage) {
//       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
//     }
//     return "New Chat";
//   }, []);

//  const sendMessage = useCallback(async () => {
//     if (input.trim() && !isThinking) {
//       const newMessage = input.trim();
//       const newChat = [...currentChat, newMessage];
//       setCurrentChat(newChat);
//       setInput("");
//       setIsThinking(true);

//       try {
//         const endpoint = currentModel === "Humanai-V1"
//           ? "http://34.238.53.215:8000/summarize"
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

//         const data = await response.json();
//         const botResponse = data.summary || data.response || `No response from ${currentModel}`;

//         setIsThinking(false);
//         const updatedChat = [...newChat, botResponse];
//         setCurrentChat(updatedChat);

//         if (updatedChat.length === 2) {
//           const docRef = await addDoc(collection(db, "chats"), {
//             title: generateChatTitle(updatedChat),
//             messages: updatedChat,
//             model: currentModel,
//           });
//           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
//         } else {
//           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
//           if (existingChat) {
//             const docRef = doc(db, "chats", existingChat.id);
//             await updateDoc(docRef, { messages: updatedChat });
//             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching response:", error);
//         setIsThinking(false);
//         setCurrentChat([...newChat, `No response from ${currentModel}`]);
//       }
//     }
//   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
//         e.preventDefault();
//         sendMessage();
//       }
//     };

//     window.addEventListener("keypress", handleKeyPress);
//     return () => window.removeEventListener("keypress", handleKeyPress);
//   }, [sendMessage, isThinking]);

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   const handleModelChange = (value: string) => {
//     if (value !== currentModel) {
//       setCurrentModel(value);
//       setCurrentChat([]);
//     }
//   };

//   return (
//     <motion.div
//       layout
//       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
//         <div className="flex items-center space-x-2">
//           <Select value={currentModel} onValueChange={handleModelChange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select RAG model" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
//               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
//             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//           </Button>
//         </div>
//       </div>
//       <ScrollArea className="flex-grow p-4">
//         <AnimatePresence>
//           {currentChat.map((message, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
//             >
//               <p className="text-gray-800 dark:text-gray-200">{message}</p>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//         {isThinking && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
//             <RefreshCw className="h-5 w-5 animate-spin" />
//             <span>Thinking...</span>
//           </motion.div>
//         )}
//       </ScrollArea>
//       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <Textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message here..."
//             className="flex-grow"
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//           />
//           <Button
//             variant="primary"
//             className="ml-2"
//             onClick={sendMessage}
//             disabled={isThinking || !input.trim()}
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }




// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface ChatWindowProps {
//   currentChat: string[];
//   setCurrentChat: (chat: string[]) => void;
//   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
//   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
//   currentModel: string;
//   setCurrentModel: (model: string) => void;
//   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
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
//   addChatToHistory,
// }: ChatWindowProps) {
//   const [input, setInput] = useState("");
//   const [isThinking, setIsThinking] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     // Load chat history from localStorage
//     const storedHistory = localStorage.getItem("chatHistory");
//     if (storedHistory) {
//       setChatHistory(JSON.parse(storedHistory));
//     }
//   }, [setChatHistory]);

//   const generateChatTitle = useCallback((messages: string[]) => {
//     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
//     if (firstUserMessage) {
//       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
//     }
//     return "New Chat";
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
//           ? "http://34.238.53.215:8000/summarize"
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

//         const data = await response.json();
//         const botResponse = data.summary || data.response || `No response from ${currentModel}`;

//         setIsThinking(false);
//         const updatedChat = [...newChat, botResponse];
//         setCurrentChat(updatedChat);

//         if (updatedChat.length === 2) {
//           const docRef = await addDoc(collection(db, "chats"), {
//             title: generateChatTitle(updatedChat),
//             messages: updatedChat,
//             model: currentModel,
//           });
//           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
//         } else {
//           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
//           if (existingChat) {
//             const docRef = doc(db, "chats", existingChat.id);
//             await updateDoc(docRef, { messages: updatedChat });
//             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching response:", error);
//         setIsThinking(false);
//         setCurrentChat([...newChat, `No response from ${currentModel}`]);
//       }
//     }
//   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
//         e.preventDefault();
//         sendMessage();
//       }
//     };

//     window.addEventListener("keypress", handleKeyPress);
//     return () => window.removeEventListener("keypress", handleKeyPress);
//   }, [sendMessage, isThinking]);

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   const handleModelChange = (value: string) => {
//     if (value !== currentModel) {
//       setCurrentModel(value);
//       setCurrentChat([]);
//     }
//   };

//   return (
//     <motion.div
//       layout
//       className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
//         <div className="flex items-center space-x-2">
//           <Select value={currentModel} onValueChange={handleModelChange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select RAG model" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
//               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
//             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//           </Button>
//         </div>
//       </div>
//       <ScrollArea className="flex-grow p-4">
//         <AnimatePresence>
//           {currentChat.map((message, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
//             >
//               <p className="text-gray-800 dark:text-gray-200">{message}</p>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//         {isThinking && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
//             <RefreshCw className="h-5 w-5 animate-spin" />
//             <span>Thinking...</span>
//           </motion.div>
//         )}
//       </ScrollArea>
//       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <Textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message here..."
//             className="flex-grow"
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//           />
//           <Button
//             variant="primary"
//             className="ml-2"
//             onClick={sendMessage}
//             disabled={isThinking || !input.trim()}
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }








"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChatWindowProps {
  currentChat: string[];
  setCurrentChat: (chat: string[]) => void;
  chatHistory: { id: string; title: string; messages: string[]; model: string }[];
  setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
  currentModel: string;
  setCurrentModel: (model: string) => void;
  addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
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
  addChatToHistory,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Load chat history from localStorage
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, [setChatHistory]);

  const generateChatTitle = useCallback((messages: string[]) => {
    const firstUserMessage = messages.find((_, index) => index % 2 === 0);
    if (firstUserMessage) {
      return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
    }
    return "New Chat";
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
          ? "http://34.238.53.215:8000/summarize"
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

        const data = await response.json();
        const botResponse = data.summary || data.response || `No response from ${currentModel}`;

        setIsThinking(false);
        const updatedChat = [...newChat, botResponse];
        setCurrentChat(updatedChat);

        if (updatedChat.length === 2) {
          const docRef = await addDoc(collection(db, "chats"), {
            title: generateChatTitle(updatedChat),
            messages: updatedChat,
            model: currentModel,
          });
          setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
        } else {
          const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
          if (existingChat) {
            const docRef = doc(db, "chats", existingChat.id);
            await updateDoc(docRef, { messages: updatedChat });
            setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
          }
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        setIsThinking(false);
        setCurrentChat([...newChat, `No response from ${currentModel}`]);
      }
    }
  }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isThinking) {
        e.preventDefault();
        sendMessage();
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [sendMessage, isThinking]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleModelChange = (value: string) => {
    if (value !== currentModel) {
      setCurrentModel(value);
      setCurrentChat([]);
    }
  };

  return (
    <motion.div
      layout
      className={`${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
        <div className="flex items-center space-x-2">
          <Select value={currentModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select RAG model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
              <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        <AnimatePresence>
          {currentChat.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
            >
              <p className="text-gray-800 dark:text-gray-200">{message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </ScrollArea>
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isThinking) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            variant="primary"
            className="ml-2"
            onClick={sendMessage}
            disabled={isThinking || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}












// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, Mic, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface ChatWindowProps {
//   currentChat: string[];
//   setCurrentChat: (chat: string[]) => void;
//   chatHistory: { id: string; title: string; messages: string[]; model: string }[];
//   setChatHistory: (history: { id: string; title: string; messages: string[]; model: string }[]) => void;
//   currentModel: string;
//   setCurrentModel: (model: string) => void;
//   addChatToHistory: (newChat: { title: string; messages: string[]; model: string }) => Promise<void>;
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
//   addChatToHistory,
// }: ChatWindowProps) {
//   const [input, setInput] = useState("");
//   const [isThinking, setIsThinking] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     // Load chat history from localStorage
//     const storedHistory = localStorage.getItem("chatHistory");
//     if (storedHistory) {
//       setChatHistory(JSON.parse(storedHistory));
//     }
//   }, [setChatHistory]);

//   const generateChatTitle = useCallback((messages: string[]) => {
//     const firstUserMessage = messages.find((_, index) => index % 2 === 0);
//     if (firstUserMessage) {
//       return firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + "..." : firstUserMessage;
//     }
//     return "New Chat";
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
//           ? "http://54.89.223.159:8000/summarize"
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

//         const data = await response.json();
//         const botResponse = data.summary || data.response || No response from ${currentModel};

//         setIsThinking(false);
//         const updatedChat = [...newChat, botResponse];
//         setCurrentChat(updatedChat);

//         if (updatedChat.length === 2) {
//           const docRef = await addDoc(collection(db, "chats"), {
//             title: generateChatTitle(updatedChat),
//             messages: updatedChat,
//             model: currentModel,
//           });
//           setChatHistory((prev) => [...prev, { id: docRef.id, title: generateChatTitle(updatedChat), messages: updatedChat, model: currentModel }]);
//         } else {
//           const existingChat = chatHistory.find((chat) => chat.messages.length > 0 && chat.messages[0] === updatedChat[0]);
//           if (existingChat) {
//             const docRef = doc(db, "chats", existingChat.id);
//             await updateDoc(docRef, { messages: updatedChat });
//             setChatHistory((prev) => prev.map((chat) => (chat.id === existingChat.id ? { ...chat, messages: updatedChat } : chat)));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching response:", error);
//         setIsThinking(false);
//         setCurrentChat([...newChat, No response from ${currentModel}]);
//       }
//     }
//   }, [input, currentChat, setCurrentChat, setChatHistory, currentModel, generateChatTitle, isThinking, chatHistory]);

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.key === "Enter" && !e.shiftKey && !isThinking) {
//         e.preventDefault();
//         sendMessage();
//       }
//     };

//     window.addEventListener("keypress", handleKeyPress);
//     return () => window.removeEventListener("keypress", handleKeyPress);
//   }, [sendMessage, isThinking]);

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   const handleModelChange = (value: string) => {
//     if (value !== currentModel) {
//       setCurrentModel(value);
//       setCurrentChat([]);
//     }
//   };

//   return (
//     <motion.div
//       layout
//       className={${isFullScreen ? "fixed inset-0 z-50" : "relative h-[600px]"} bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-lg}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ask Humanai..</h2>
//         <div className="flex items-center space-x-2">
//           <Select value={currentModel} onValueChange={handleModelChange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select RAG model" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Humanai-V1">Humanai - V1</SelectItem>
//               <SelectItem value="Humanai-V2">Humanai - V2</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
//             {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//           </Button>
//         </div>
//       </div>
//       <ScrollArea className="flex-grow p-4">
//         <AnimatePresence>
//           {currentChat.map((message, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={mb-4 p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-100 dark:bg-blue-900 ml-auto" : "bg-gray-100 dark:bg-gray-700"} max-w-[80%] ${index % 2 === 0 ? "ml-auto" : "mr-auto"}}
//             >
//               <p className="text-gray-800 dark:text-gray-200">{message}</p>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//         {isThinking && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
//             <RefreshCw className="h-5 w-5 animate-spin" />
//             <span>Thinking...</span>
//           </motion.div>
//         )}
//       </ScrollArea>
//       <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <Textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message here..."
//             className="flex-grow"
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !e.shiftKey && !isThinking) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//           />
//           <Button
//             variant="primary"
//             className="ml-2"
//             onClick={sendMessage}
//             disabled={isThinking || !input.trim()}
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
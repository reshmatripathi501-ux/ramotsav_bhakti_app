import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { Post } from '../../types';
import { askGranthAI } from '../../services/geminiService';
import { AiIcon, UserIcon } from '../icons';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface AiChatModalProps {
    post: Post;
    onClose: () => void;
}

const AiChatModal: React.FC<AiChatModalProps> = ({ post, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const fullContext = `Title: ${post.title}\n\nContent:\n${post.description}`;
        const response = await askGranthAI(fullContext, input);

        if (typeof response === 'string') {
            setMessages(prev => [...prev, { sender: 'ai', text: response }]);
            setIsLoading(false);
        } else {
            let aiResponseText = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
            
            try {
                for await (const chunk of response) {
                   const c = chunk as GenerateContentResponse;
                   const textPart = c.text;
                   if (textPart) {
                       aiResponseText += textPart;
                       setMessages(prev => {
                           const newMessages = [...prev];
                           newMessages[newMessages.length - 1].text = aiResponseText;
                           return newMessages;
                       });
                   }
                }
            } catch (error) {
                console.error("Streaming error:", error);
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = "An error occurred while streaming the response.";
                    return newMessages;
                });
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-end" onClick={onClose}>
            <div 
                className="bg-orange-50 dark:bg-[#100802] w-full max-w-2xl h-[85%] rounded-t-3xl flex flex-col shadow-lg dark:shadow-amber-900/50 animate-slide-up border-t-2 border-amber-500"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 dark:border-amber-800 text-center relative flex items-center justify-center gap-2">
                    <AiIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-bold text-amber-600 dark:text-amber-400 font-cinzel">Ask Granth AI</h3>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 dark:text-gray-400">&times;</button>
                </div>
                
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex-shrink-0 flex items-center justify-center"><AiIcon className="w-5 h-5 text-amber-600 dark:text-amber-300"/></div>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-700 dark:bg-amber-900 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/></div>}
                        </div>
                    ))}
                    {isLoading && messages[messages.length-1].sender === 'ai' && (
                        <div className="flex justify-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex-shrink-0 flex items-center justify-center"><AiIcon className="w-5 h-5 text-amber-600 dark:text-amber-300"/></div>
                             <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-amber-800 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Granth ke baare mein poochhein..."
                        className="flex-1 bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-full text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button onClick={handleSend} disabled={isLoading} className="bg-amber-500 text-black font-bold px-5 py-2 rounded-full disabled:bg-gray-600">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
            `}</style>
        </div>
    );
};

export default AiChatModal;

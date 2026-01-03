
import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { askDarshanAI } from '../services/geminiService';
import { AiIcon, UserIcon } from './icons';
import { darshanImageUrl } from '../image';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const DarshanAiSection: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        setMessages([{
            sender: 'ai', 
            text: 'प्रणाम! मैं आपका AI दर्शन सहायक हूँ। प्रभु श्री राम के इस दिव्य स्वरूप के बारे में आप क्या जानना चाहेंगे?'
        }]);
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const response = await askDarshanAI(input);

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
        <div className="flex flex-col h-[calc(100vh-120px)] pt-2">
            <div className="flex-shrink-0 p-2">
                <img src={darshanImageUrl} alt="Divya Darshan of Shri Ram" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-lg shadow-amber-900/50" />
            </div>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-amber-800 flex-shrink-0 flex items-center justify-center"><AiIcon className="w-5 h-5 text-amber-300"/></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-900 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-300"/></div>}
                    </div>
                ))}
                {isLoading && messages[messages.length-1]?.sender === 'ai' && (
                    <div className="flex justify-start">
                            <div className="p-3 bg-gray-800 rounded-2xl rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-amber-800 flex gap-2 bg-[rgba(10,5,0,0.8)] flex-shrink-0">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="छवि के बारे में पूछें..."
                    className="flex-1 bg-[#222] border border-gray-600 px-4 py-2 rounded-full text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-amber-500 text-black font-bold w-12 h-12 flex items-center justify-center rounded-full disabled:bg-gray-600">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default DarshanAiSection;

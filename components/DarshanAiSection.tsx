import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { askDarshanAI } from '../services/geminiService';
import { AiIcon, UserIcon } from './icons';
import { darshanImageUrl } from '../image';
import { AiChatSession, AiMessage, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DarshanAiSection: React.FC = () => {
    const [sessions, setSessions] = useLocalStorage<AiChatSession[]>('ai_chat_sessions_darshan', []);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (sessions.length === 0) {
            handleNewChat();
        } else if (!activeSessionId || !sessions.find(s => s.id === activeSessionId)) {
            setActiveSessionId(sessions[0].id);
        }
    }, [sessions, activeSessionId]);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeSession?.messages, isLoading]);

    const handleNewChat = () => {
        const newSession: AiChatSession = {
            id: `session_${Date.now()}`,
            title: 'New Darshan Chat',
            messages: [{sender: 'ai', text: 'प्रणाम! प्रभु श्री राम के दिव्य स्वरूप के बारे में पूछें।'}]
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setIsHistoryOpen(false);
    };
    
    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this chat?")) {
            const newSessions = sessions.filter(s => s.id !== sessionId);
            setSessions(newSessions);
             if(activeSessionId === sessionId) {
                setActiveSessionId(newSessions[0]?.id || null);
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !activeSession) return;
        
        const userMessage: AiMessage = { sender: 'user', text: input };
        const newTitle = activeSession.messages.length <= 1 ? input.substring(0, 25) + (input.length > 25 ? '...' : '') : activeSession.title;
        
        const updatedMessages = [...activeSession.messages, userMessage];
        
        setSessions(prevSessions => prevSessions.map(s => 
            s.id === activeSessionId ? { ...s, title: newTitle, messages: updatedMessages } : s
        ));
        
        setInput('');
        setIsLoading(true);

        const response = await askDarshanAI(input);
        
        let aiResponseText = '';
        const aiMessage: AiMessage = { sender: 'ai', text: '' };

        setSessions(prevSessions => prevSessions.map(s => 
            s.id === activeSessionId ? { ...s, messages: [...updatedMessages, aiMessage] } : s
        ));

        if (typeof response === 'string') {
            aiResponseText = response;
        } else {
            try {
                for await (const chunk of response) {
                   const c = chunk as GenerateContentResponse;
                   const textPart = c.text;
                   if (textPart) {
                       aiResponseText += textPart;
                       setSessions(prevSessions => prevSessions.map(s => {
                           if (s.id === activeSessionId) {
                               const newMessages = [...s.messages];
                               newMessages[newMessages.length - 1].text = aiResponseText;
                               return { ...s, messages: newMessages };
                           }
                           return s;
                       }));
                   }
                }
            } catch (error) {
                 aiResponseText = "An error occurred while streaming the response.";
            }
        }

        setSessions(prevSessions => prevSessions.map(s => {
            if (s.id === activeSessionId) {
                const newMessages = [...s.messages];
                newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText || "No response generated."};
                return { ...s, messages: newMessages };
            }
            return s;
        }));
        setIsLoading(false);
    };

    const HistoryPanel = () => (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" onClick={() => setIsHistoryOpen(false)}>
            <div className="absolute top-0 left-0 w-2/3 md:w-1/2 max-w-sm h-full bg-gray-100 dark:bg-[#100802] shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-2 border-b border-gray-200 dark:border-amber-800/50">
                    <button onClick={handleNewChat} className="w-full text-sm flex items-center justify-center gap-2 bg-amber-500/20 dark:bg-amber-600/20 hover:bg-amber-500/40 dark:hover:bg-amber-600/40 text-gray-800 dark:text-white font-semibold py-2 px-3 rounded-lg">
                        <i className="fas fa-plus"></i> New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(session => (
                        <div key={session.id} onClick={() => {setActiveSessionId(session.id); setIsHistoryOpen(false);}}
                            className={`p-3 text-sm text-left cursor-pointer border-l-4 ${activeSessionId === session.id ? 'bg-amber-800/20 dark:bg-amber-900/50 border-amber-400' : 'border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/50'} flex justify-between items-center group`}>
                            <p className="truncate text-gray-700 dark:text-gray-200">{session.title}</p>
                            <button onClick={(e) => handleDeleteSession(e, session.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col relative">
             <div className="p-4 border-b border-gray-200 dark:border-amber-800 text-center relative flex items-center justify-between">
                <button onClick={() => setIsHistoryOpen(true)} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-xl">
                    <i className="fas fa-bars"></i>
                </button>
                <div className="flex items-center gap-2">
                    <AiIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    <h3 className="font-bold text-amber-600 dark:text-amber-400 font-cinzel">AI Darshan</h3>
                </div>
                <div className="w-6"></div>
            </div>

            <div className="flex-shrink-0 p-2">
                <img src={darshanImageUrl} alt="Divya Darshan of Shri Ram" className="w-full h-auto max-h-40 md:max-h-48 object-contain rounded-lg shadow-lg dark:shadow-amber-900/50" />
            </div>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeSession?.messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-amber-700 dark:bg-amber-800 flex-shrink-0 flex items-center justify-center"><AiIcon className="w-5 h-5 text-amber-200 dark:text-amber-300"/></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-800 dark:bg-amber-900 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-700 dark:text-gray-300"/></div>}
                    </div>
                ))}
                {isLoading && activeSession?.messages[activeSession.messages.length - 1]?.sender === 'ai' && (
                    <div className="flex justify-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-700 dark:bg-amber-800 flex-shrink-0 flex items-center justify-center"><AiIcon className="w-5 h-5 text-amber-200 dark:text-amber-300"/></div>
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-amber-800 flex gap-2 bg-white/80 dark:bg-[rgba(10,5,0,0.8)] flex-shrink-0">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="छवि के बारे में पूछें..."
                    className="flex-1 bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-full text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-amber-500 text-black font-bold w-12 h-12 flex items-center justify-center rounded-full disabled:bg-gray-600">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
            {isHistoryOpen && <HistoryPanel />}
        </div>
    );
};

export default DarshanAiSection;

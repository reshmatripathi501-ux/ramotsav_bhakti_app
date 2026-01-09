import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import { User } from '../types';

interface LiveComment {
    id: number;
    user: string;
    text: string;
    color: string;
}
interface LiveSectionProps {
    currentUser: User;
}

const FloatingEmoji: React.FC<{ emoji: string; onEnd: () => void }> = ({ emoji, onEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onEnd, 3000);
        return () => clearTimeout(timer);
    }, [onEnd]);

    return (
        <div 
            className="absolute bottom-24 text-3xl animate-float-up"
            style={{ left: `${10 + Math.random() * 80}%` }}
        >
            {emoji}
            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-300px) scale(1.5); opacity: 0; }
                }
                .animate-float-up { animation: float-up 3s ease-out forwards; }
            `}</style>
        </div>
    );
};


const LiveSection: React.FC<LiveSectionProps> = ({ currentUser }) => {
    const [comments, setComments] = useState<LiveComment[]>([]);
    const [myComment, setMyComment] = useState('');
    const [viewerCount, setViewerCount] = useState(Math.floor(150 + Math.random() * 200));
    const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string }[]>([]);
    const commentContainerRef = useRef<HTMLDivElement>(null);
    const userVideoRef = useRef<HTMLVideoElement>(null);

    const [liveMode, setLiveMode] = useState<'watching' | 'broadcasting'>('watching');
    const [userStream, setUserStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    
    const fakeUsers = ['RamBhakt', 'SitaFan', 'HanumanDas', 'BharatLover', 'Laxman_G'];
    const userColors = ['text-amber-500', 'text-cyan-400', 'text-pink-400', 'text-green-400', 'text-purple-400'];

    useEffect(() => {
        const interval = setInterval(() => {
            const userIndex = Math.floor(Math.random() * fakeUsers.length);
            const newComment: LiveComment = {
                id: Date.now(),
                user: fakeUsers[userIndex],
                text: 'Jai Shri Ram! 🙏',
                color: userColors[userIndex],
            };
            setComments(prev => [...prev, newComment].slice(-50));
        }, 3000);
        
        const viewerInterval = setInterval(() => {
            setViewerCount(v => v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(viewerInterval);
        }
    }, []);

    useEffect(() => {
        if(commentContainerRef.current) {
            commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
        }
    }, [comments]);

    const startLiveStream = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setUserStream(stream);
            setLiveMode('broadcasting');
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Could not access camera/microphone. Please check permissions in your browser settings.");
        }
    };

    const stopLiveStream = () => {
        if (userStream) {
            userStream.getTracks().forEach(track => track.stop());
        }
        setUserStream(null);
        setLiveMode('watching');
    };

    useEffect(() => {
        if (userVideoRef.current && userStream) {
            userVideoRef.current.srcObject = userStream;
        }
    }, [userStream]);

    useEffect(() => {
        // Cleanup function to stop stream when navigating away
        return () => {
            if (userStream) {
                userStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [userStream]);
    
    const handleSendComment = () => {
        if (!myComment.trim()) return;
        const newComment: LiveComment = { id: Date.now(), user: currentUser.name, text: myComment, color: 'text-white font-bold' };
        setComments(prev => [...prev, newComment]);
        setMyComment('');
    };

    const handleEmojiSend = (emoji: string) => {
        setFloatingEmojis(prev => [...prev, { id: Date.now(), emoji }]);
    };

    return (
        <div className="relative w-full h-[calc(100vh-120px)] bg-black overflow-hidden">
            {liveMode === 'watching' ? (
                <VideoPlayer src="https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_aarti.mp4" title="Live Aarti from Ayodhya" artworkUrl="https://i.pinimg.com/564x/c2/39/c0/c239c0540a1586a111a43a755601931a.jpg" />
            ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    {userStream && <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-contain transform scaleX(-1)"></video>}
                </div>
            )}
            
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                 <div className="bg-black/60 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                         <img src={(liveMode === 'watching' ? 'https://i.pinimg.com/564x/c2/39/c0/c239c0540a1586a111a43a755601931a.jpg' : currentUser.avatarUrl) || 'https://i.pravatar.cc/150'} alt="avatar" className="w-10 h-10 rounded-full border-2 border-amber-300" />
                        <div>
                           <p className="font-bold text-white">{liveMode === 'watching' ? 'Mandir Admin' : 'You are Live'}</p>
                           <p className="text-xs text-red-400 font-bold animate-pulse">LIVE</p>
                        </div>
                    </div>
                </div>
                <div className="bg-black/60 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
                    <i className="fas fa-eye text-red-400"></i> {viewerCount}
                </div>
            </div>

            {error && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-800/90 p-4 rounded-lg text-white z-20 text-center max-w-xs">{error}</div>}

            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-2">
                <div className="mb-2 flex justify-center">
                    {liveMode === 'watching' ? (
                        <button onClick={startLiveStream} className="bg-red-600 text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/50 transform transition-transform hover:scale-105">
                           <i className="fas fa-video"></i> Go Live
                        </button>
                    ) : (
                        <button onClick={stopLiveStream} className="bg-gray-700 text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-lg transform transition-transform hover:scale-105">
                           <i className="fas fa-stop-circle"></i> Stop Live
                        </button>
                    )}
                </div>

                <div ref={commentContainerRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {comments.map(c => (
                        <div key={c.id} className="text-sm p-1 rounded">
                           <span className={`font-bold ${c.color}`}>{c.user}: </span>
                           <span className="text-white">{c.text}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <input 
                        type="text"
                        value={myComment}
                        onChange={(e) => setMyComment(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendComment()}
                        placeholder="Say Jai Shri Ram..."
                        className="flex-1 bg-black/50 border border-gray-600 px-4 py-2 rounded-full text-white"
                    />
                    <button onClick={handleSendComment} className="text-white text-xl"><i className="fas fa-paper-plane"></i></button>
                </div>
                 <div className="mt-2 flex justify-around items-center">
                    {['🙏', '❤️', '🚩', '🌺', '🕉️'].map(emoji => (
                        <button key={emoji} onClick={() => handleEmojiSend(emoji)} className="text-2xl transform transition-transform hover:scale-125">{emoji}</button>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-full pointer-events-none">
                {floatingEmojis.map(e => <FloatingEmoji key={e.id} emoji={e.emoji} onEnd={() => setFloatingEmojis(prev => prev.filter(item => item.id !== e.id))} />)}
            </div>
        </div>
    );
};

export default LiveSection;

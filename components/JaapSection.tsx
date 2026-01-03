
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import JaapCompletionModal from './modals/JaapCompletionModal';

const FloatingName: React.FC<{ text: string; x: number; y: number; onEnd: () => void }> = ({ text, x, y, onEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onEnd, 1200);
        return () => clearTimeout(timer);
    }, [onEnd]);

    return (
        <div
            className="fixed pointer-events-none font-cinzel font-bold text-4xl text-amber-300 z-50 animate-float-3d"
            style={{ left: `${x}px`, top: `${y}px`, textShadow: '2px 2px 0px #800000' }}
        >
            {text}
            <style>{`
                @keyframes float-3d {
                    0% { transform: translateY(0) rotateX(0); opacity: 0; }
                    20% { opacity: 1; transform: translateY(-50px) scale(1.2) rotateX(10deg); }
                    100% { transform: translateY(-150px) scale(1.5) rotateX(20deg); opacity: 0; }
                }
                .animate-float-3d {
                    animation: float-3d 1.2s forwards;
                }
            `}</style>
        </div>
    );
};

const JaapSection: React.FC = () => {
    const [dailyCount, setDailyCount] = useLocalStorage('jaap_today', 0);
    const [chantName, setChantName] = useState('Raam');
    const [floaters, setFloaters] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
    const [isCompletionModalOpen, setCompletionModalOpen] = useState(false);

    useEffect(() => {
        if (dailyCount === 108) {
            setCompletionModalOpen(true);
        }
    }, [dailyCount]);

    const handleJaap = (event: React.MouseEvent<HTMLDivElement>) => {
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setDailyCount(prev => prev + 1);
        const newFloater = {
            id: Date.now(),
            text: chantName,
            x: event.clientX - 40,
            y: event.clientY - 50,
        };
        setFloaters(prev => [...prev, newFloater]);
    };

    const removeFloater = (id: number) => {
        setFloaters(prev => prev.filter(f => f.id !== id));
    };

    return (
        <>
            {isCompletionModalOpen && <JaapCompletionModal onClose={() => setCompletionModalOpen(false)} />}
            <div className="pt-8 text-center text-white">
                {floaters.map(f => <FloatingName key={f.id} {...f} onEnd={() => removeFloater(f.id)} />)}
                
                <h2 className="text-2xl font-cinzel text-center text-amber-400 mb-4">Mantra Jaap</h2>

                <select 
                    value={chantName} 
                    onChange={(e) => setChantName(e.target.value)}
                    className="bg-[#222] text-amber-400 border border-amber-600 px-4 py-2 rounded-lg text-lg mb-6"
                >
                    <option value="Raam">Jai Shri Ram</option>
                    <option value="Radhe">Radhe Radhe</option>
                    <option value="Krishna">Hare Krishna</option>
                    <option value="Om">Om Namah Shivaya</option>
                </select>

                <div 
                    className="w-64 h-64 mx-auto rounded-full border-8 border-amber-500 bg-[radial-gradient(circle,_#220a00,_#000)] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,153,51,0.3),inset_0_0_20px_rgba(255,153,51,0.2)] cursor-pointer select-none transition-transform active:scale-95 active:shadow-[0_0_80px_#ff9933]"
                    onClick={handleJaap}
                >
                    <div className="text-sm text-gray-400 mb-1">Mantra Jaap</div>
                    <div className="text-7xl font-bold text-amber-300 font-cinzel" style={{ textShadow: '0 0 10px #ff9933' }}>
                        {dailyCount}
                    </div>
                    <div className="text-xs text-amber-500 mt-2">Tap to Chant</div>
                </div>

                <div className="mt-10 text-gray-300">
                    <p>Aaj Ka Kul Jaap: <span className="text-amber-300 font-bold">{dailyCount}</span></p>
                    <button 
                        onClick={() => {
                            if (window.confirm("Are you sure you want to reset the counter?")) {
                                setDailyCount(0);
                            }
                        }}
                        className="mt-4 bg-white/10 border border-gray-600 px-5 py-2 rounded-full text-sm hover:bg-white/20"
                    >
                        Reset Counter
                    </button>
                </div>
            </div>
        </>
    );
};

export default JaapSection;

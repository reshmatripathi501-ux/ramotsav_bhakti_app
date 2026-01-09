import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import JaapCompletionModal from './modals/JaapCompletionModal';
import { JaapRecord, LekhanRecord } from '../types';

interface JaapSectionProps {
    history: JaapRecord[];
    setHistory: React.Dispatch<React.SetStateAction<JaapRecord[]>>;
}

const FloatingName: React.FC<{ text: string; x: number; y: number; onEnd: () => void }> = ({ text, x, y, onEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onEnd, 1200);
        return () => clearTimeout(timer);
    }, [onEnd]);

    return (
        <div className="fixed pointer-events-none font-cinzel font-bold text-4xl text-amber-400 dark:text-amber-300 z-50 animate-float-3d" style={{ textShadow: '2px 2px 0px #800000' }}>
            {text}
            <style>{`
                @keyframes float-3d { 0% { transform: translateY(0) rotateX(0); opacity: 0; } 20% { opacity: 1; transform: translateY(-50px) scale(1.2) rotateX(10deg); } 100% { transform: translateY(-150px) scale(1.5) rotateX(20deg); opacity: 0; } }
                .animate-float-3d { animation: float-3d 1.2s forwards; }
            `}</style>
        </div>
    );
};

const JaapSection: React.FC<JaapSectionProps> = ({ history, setHistory }) => {
    const [mode, setMode] = useState<'counter' | 'lekhan'>('counter');
    const [lekhanHistory, setLekhanHistory] = useLocalStorage<LekhanRecord[]>('lekhan_history', []);
    const [chantName, setChantName] = useState('Raam');
    const [floaters, setFloaters] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
    const [isCompletionModalOpen, setCompletionModalOpen] = useState(false);

    // Use props instead of internal state for Jaap history
    const jaapHistory = history;
    const setJaapHistory = setHistory;

    const todayISO = new Date().toISOString().split('T')[0];

    const todayJaapCount = useMemo(() => jaapHistory.find(r => r.date === todayISO)?.count || 0, [jaapHistory, todayISO]);
    const todayLekhanText = useMemo(() => lekhanHistory.find(r => r.date === todayISO)?.text || '', [lekhanHistory, todayISO]);
    
    useEffect(() => {
        if (todayJaapCount === 108) {
            setCompletionModalOpen(true);
        }
    }, [todayJaapCount]);

    const handleJaap = (event: React.MouseEvent<HTMLDivElement>) => {
        if (navigator.vibrate) navigator.vibrate(50);

        setJaapHistory(prev => {
            const todayRecord = prev.find(r => r.date === todayISO);
            if (todayRecord) {
                return prev.map(r => r.date === todayISO ? { ...r, count: r.count + 1 } : r);
            }
            return [...prev, { date: todayISO, count: 1 }];
        });
        const newFloater = { id: Date.now(), text: chantName, x: event.clientX - 40, y: event.clientY - 50 };
        setFloaters(prev => [...prev, newFloater]);
    };

    const handleLekhanChange = (text: string) => {
         setLekhanHistory(prev => {
            const todayRecord = prev.find(r => r.date === todayISO);
            if (todayRecord) {
                return prev.map(r => r.date === todayISO ? { ...r, text: text } : r);
            }
            return [...prev, { date: todayISO, text: text }];
        });
    };

    const getStats = (history: JaapRecord[] | LekhanRecord[]) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Assuming Monday is start of week
        startOfWeek.setHours(0,0,0,0);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const todayRecord = history.find(r => r.date === today);
        const weekRecords = history.filter(r => new Date(r.date) >= startOfWeek);
        const yearRecords = history.filter(r => new Date(r.date) >= startOfYear);

        if (history.length > 0 && 'count' in history[0]) { // Jaap stats
            const jaap = history as JaapRecord[];
            return {
                today: todayRecord ? (todayRecord as JaapRecord).count : 0,
                week: weekRecords.reduce((sum, r) => sum + (r as JaapRecord).count, 0),
                year: yearRecords.reduce((sum, r) => sum + (r as JaapRecord).count, 0),
            };
        } else { // Lekhan stats (character count)
            const lekhan = history as LekhanRecord[];
            return {
                today: todayRecord ? (todayRecord as LekhanRecord).text.length : 0,
                week: weekRecords.reduce((sum, r) => sum + (r as LekhanRecord).text.length, 0),
                year: yearRecords.reduce((sum, r) => sum + (r as LekhanRecord).text.length, 0),
            };
        }
    };
    
    const jaapStats = getStats(jaapHistory);
    const lekhanStats = getStats(lekhanHistory);

    const resetCounter = () => {
        if (window.confirm("Are you sure you want to reset today's counter?")) {
            setJaapHistory(prev => prev.map(r => r.date === todayISO ? { ...r, count: 0 } : r));
        }
    };

    return (
        <>
            {isCompletionModalOpen && <JaapCompletionModal onClose={() => setCompletionModalOpen(false)} />}
            <div className="pt-8 text-center text-gray-800 dark:text-white">
                {floaters.map(f => <FloatingName key={f.id} {...f} onEnd={() => setFloaters(prev => prev.filter(fl => fl.id !== f.id))} />)}
                
                <div className="flex justify-center bg-gray-200 dark:bg-[#222] border border-gray-300 dark:border-amber-700 rounded-full p-1 mb-6 max-w-xs mx-auto">
                    <button onClick={() => setMode('counter')} className={`w-1/2 py-2 rounded-full ${mode === 'counter' ? 'bg-amber-500 dark:bg-amber-600 text-black font-bold' : 'text-gray-600 dark:text-gray-300'}`}>Mantra Jaap</button>
                    <button onClick={() => setMode('lekhan')} className={`w-1/2 py-2 rounded-full ${mode === 'lekhan' ? 'bg-amber-500 dark:bg-amber-600 text-black font-bold' : 'text-gray-600 dark:text-gray-300'}`}>Naam Lekhan</button>
                </div>

                {mode === 'counter' ? (
                    <>
                        <select value={chantName} onChange={(e) => setChantName(e.target.value)} className="bg-gray-200 dark:bg-[#222] text-amber-600 dark:text-amber-400 border border-gray-400 dark:border-amber-600 px-4 py-2 rounded-lg text-lg mb-6">
                            <option value="Raam">Jai Shri Ram</option>
                            <option value="Siya Ram">Siya Ram</option>
                            <option value="Radhe">Radhe Radhe</option>
                            <option value="Krishna">Hare Krishna</option>
                            <option value="Om">Om Namah Shivaya</option>
                            <option value="Hanuman">Jai Hanuman</option>
                        </select>
                        <div onClick={handleJaap} className="w-64 h-64 mx-auto rounded-full border-8 border-amber-500 bg-white dark:bg-[radial-gradient(circle,_#220a00,_#000)] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,153,51,0.3),inset_0_0_20px_rgba(255,153,51,0.2)] cursor-pointer select-none transition-transform active:scale-95 active:shadow-[0_0_80px_#ff9933]">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mantra Jaap</div>
                            <div className="text-7xl font-bold text-amber-600 dark:text-amber-300 font-cinzel" style={{ textShadow: '0 0 10px #ff9933' }}>
                                {todayJaapCount}
                            </div>
                            <div className="text-xs text-amber-600 dark:text-amber-500 mt-2">Tap to Chant</div>
                        </div>
                        <div className="mt-8 text-gray-600 dark:text-gray-300">
                             <div className="flex justify-center gap-4 text-center">
                                <div><p className="font-bold text-lg text-amber-700 dark:text-amber-300">{jaapStats.today}</p><p className="text-xs">Today</p></div>
                                <div><p className="font-bold text-lg text-amber-700 dark:text-amber-300">{jaapStats.week}</p><p className="text-xs">This Week</p></div>
                                <div><p className="font-bold text-lg text-amber-700 dark:text-amber-300">{jaapStats.year}</p><p className="text-xs">This Year</p></div>
                            </div>
                            <button onClick={resetCounter} className="mt-4 bg-black/10 dark:bg-white/10 border border-gray-400 dark:border-gray-600 px-5 py-2 rounded-full text-sm hover:bg-black/20 dark:hover:bg-white/20">Reset Today's Counter</button>
                        </div>
                    </>
                ) : (
                    <div>
                        <h2 className="text-xl font-cinzel text-amber-500 dark:text-amber-400 mb-4">Ram Naam Lekhan</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Write the name of God to calm your mind.</p>
                        <textarea value={todayLekhanText} onChange={(e) => handleLekhanChange(e.target.value)} placeholder="श्री राम जय राम जय जय राम..." className="w-full max-w-md mx-auto h-64 p-4 bg-orange-50 dark:bg-[#111] border border-amber-600 dark:border-amber-700 rounded-lg text-amber-700 dark:text-amber-300 text-lg leading-loose font-cinzel focus:outline-none focus:ring-2 focus:ring-amber-500" />
                         <p className="text-xs text-gray-500 mt-2">Your writing is saved automatically.</p>
                         <div className="mt-4 flex justify-center gap-4 text-center">
                                <div><p className="font-bold text-lg text-amber-700 dark:text-amber-300">{lekhanStats.today.toLocaleString()}</p><p className="text-xs">Characters Today</p></div>
                                <div><p className="font-bold text-lg text-amber-700 dark:text-amber-300">{lekhanStats.week.toLocaleString()}</p><p className="text-xs">This Week</p></div>
                                <div><p className="font-bold text-lg text-amber-700 dark:text-amber-300">{lekhanStats.year.toLocaleString()}</p><p className="text-xs">This Year</p></div>
                         </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default JaapSection;
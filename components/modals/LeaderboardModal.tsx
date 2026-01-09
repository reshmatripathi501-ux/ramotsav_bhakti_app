import React, { useMemo } from 'react';
import { User, JaapRecord } from '../../types';

interface LeaderboardModalProps {
    onClose: () => void;
    users: User[];
    currentUser: User | undefined;
    currentHistory: JaapRecord[];
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, users, currentUser, currentHistory }) => {
    
    const leaderboardData = useMemo(() => {
        const myTotal = currentHistory.reduce((acc, r) => acc + r.count, 0);

        return users.map(user => {
            let count = 0;
            if (currentUser && user.id === currentUser.id) {
                count = myTotal;
            } else {
                // Generate a consistent fake score based on user ID for demo purposes
                // In a real app, this would come from the backend
                const seed = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                count = (seed * 9301 + 500) % 15000; 
            }
            return { ...user, count };
        }).sort((a, b) => b.count - a.count);
    }, [users, currentUser, currentHistory]);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-orange-50 dark:bg-[#1e0f05] border-2 border-amber-600 rounded-2xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl dark:shadow-amber-900/50 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 dark:border-amber-800 relative bg-amber-100 dark:bg-amber-900/20 rounded-t-xl">
                    <h2 className="text-2xl font-cinzel text-amber-700 dark:text-amber-300 text-center flex items-center justify-center gap-2">
                        <i className="fas fa-trophy text-yellow-500"></i> Leaderboard
                    </h2>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-gray-500 dark:text-gray-400">&times;</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {leaderboardData.map((user, index) => {
                        const isMe = currentUser && user.id === currentUser.id;
                        let rankIcon = null;
                        if (index === 0) rankIcon = <i className="fas fa-crown text-yellow-500 text-xl"></i>;
                        else if (index === 1) rankIcon = <i className="fas fa-medal text-gray-400 text-xl"></i>;
                        else if (index === 2) rankIcon = <i className="fas fa-medal text-amber-700 text-xl"></i>;
                        else rankIcon = <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;

                        return (
                            <div 
                                key={user.id} 
                                className={`flex items-center gap-3 p-3 rounded-xl border ${isMe ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 transform scale-105 shadow-md' : 'bg-white dark:bg-[#2a1a10] border-gray-200 dark:border-amber-900/30'}`}
                            >
                                <div className="flex-shrink-0 w-8 flex justify-center">
                                    {rankIcon}
                                </div>
                                <img 
                                    src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                                    alt={user.name} 
                                    className={`w-12 h-12 rounded-full border-2 ${isMe ? 'border-amber-500' : 'border-gray-300 dark:border-gray-600'}`}
                                />
                                <div className="flex-1">
                                    <h3 className={`font-bold ${isMe ? 'text-amber-800 dark:text-amber-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {user.name} {isMe && '(You)'}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Devotee</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-cinzel font-bold text-lg text-amber-600 dark:text-amber-400">{user.count.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Jaaps</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-amber-800">
                    Keep chanting to rise up the leaderboard!
                </div>
            </div>
            <style>{`
                @keyframes zoom-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-zoom-in { animation: zoom-in 0.2s ease-out; }
            `}</style>
        </div>
    );
};

export default LeaderboardModal;
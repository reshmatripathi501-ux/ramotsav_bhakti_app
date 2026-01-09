import React from 'react';
import { User } from '../types';

interface CommunitySectionProps {
    users: User[];
    onUserSelect: (userId: string) => void;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ users, onUserSelect }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-cinzel text-center text-amber-600 dark:text-amber-400 mb-6">Community of Devotees</h2>
            <div className="space-y-3">
                {users.map(user => (
                    <div 
                        key={user.id} 
                        className="bg-white dark:bg-[rgba(30,15,5,0.7)] p-3 rounded-lg flex items-center justify-between shadow-sm border border-gray-200 dark:border-amber-800/50"
                    >
                        <div className="flex items-center gap-3">
                            <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-12 h-12 rounded-full border-2 border-amber-300" />
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white">{user.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{user.bio || 'Jai Shri Ram'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onUserSelect(user.id)}
                            className="bg-amber-500/20 dark:bg-amber-600/20 hover:bg-amber-500/40 dark:hover:bg-amber-600/40 text-amber-700 dark:text-amber-200 font-semibold py-1 px-4 rounded-full text-sm"
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunitySection;

import React, { useState, useMemo } from 'react';
import { User } from '../../types';

interface FollowersModalProps {
    user: User;
    allUsers: User[];
    initialTab: 'followers' | 'following';
    onClose: () => void;
    onUserSelect: (userId: string) => void;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ user, allUsers, initialTab, onClose, onUserSelect }) => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);

    const followers = useMemo(() => {
        return allUsers.filter(u => user.followers.includes(u.id));
    }, [allUsers, user.followers]);

    const following = useMemo(() => {
        return allUsers.filter(u => user.following.includes(u.id));
    }, [allUsers, user.following]);

    const listToShow = activeTab === 'followers' ? followers : following;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-end" onClick={onClose}>
            <div 
                className="bg-white dark:bg-[#1a1a1a] w-full max-w-md h-[60%] rounded-t-3xl flex flex-col shadow-lg dark:shadow-amber-900/50 animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center relative">
                    <h3 className="font-bold text-amber-600 dark:text-amber-400">{user.name}</h3>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 dark:text-gray-400">&times;</button>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setActiveTab('followers')}
                        className={`flex-1 p-3 font-semibold ${activeTab === 'followers' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}
                    >
                        {user.followers.length} Followers
                    </button>
                    <button 
                        onClick={() => setActiveTab('following')}
                        className={`flex-1 p-3 font-semibold ${activeTab === 'following' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}
                    >
                        {user.following.length} Following
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2">
                    {listToShow.length > 0 ? (
                        listToShow.map(listUser => (
                            <div key={listUser.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div className="flex items-center gap-3">
                                    <img src={listUser.avatarUrl || `https://i.pravatar.cc/150?u=${listUser.id}`} alt={listUser.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{listUser.name}</p>
                                        <p className="text-xs text-gray-500">{listUser.location || ''}</p>
                                    </div>
                                </div>
                                <button onClick={() => onUserSelect(listUser.id)} className="text-sm bg-amber-500/20 text-amber-700 dark:text-amber-200 px-3 py-1 rounded-full">View</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 pt-8">No users to show.</p>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
            `}</style>
        </div>
    );
};

export default FollowersModal;

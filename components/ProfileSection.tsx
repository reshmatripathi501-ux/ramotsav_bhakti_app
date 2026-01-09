import React, { useState } from 'react';
import { User, Post } from '../types';
import EditProfileModal from './modals/EditProfileModal';
import { LocationIcon } from './icons';

interface ProfileSectionProps {
    user: User;
    posts: Post[];
    currentUser: User;
    isCurrentUserProfile: boolean;
    onBack: () => void;
    onUpdateUser: (user: User) => void;
    onFollowToggle: (userId: string) => void;
    onShowFollowers: (user: User, tab: 'followers' | 'following') => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, posts, currentUser, isCurrentUserProfile, onBack, onUpdateUser, onFollowToggle, onShowFollowers }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const handleProfileUpdate = (updatedUser: User) => {
        onUpdateUser(updatedUser);
        setEditModalOpen(false);
    };

    const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
    const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);

    const isFollowing = currentUser.following.includes(user.id);

    return (
        <div className="p-4">
            {isEditModalOpen && <EditProfileModal user={user} onSave={handleProfileUpdate} onClose={() => setEditModalOpen(false)} />}
            
            {!isCurrentUserProfile && (
                 <button onClick={onBack} className="mb-4 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <i className="fas fa-arrow-left"></i> Back
                </button>
            )}

            <div className="text-center mb-6">
                <img 
                    src={user.avatarUrl || 'https://i.pravatar.cc/150?u=' + user.id} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-amber-400 object-cover shadow-lg mb-4 mx-auto"
                />
                <h1 className="text-2xl font-cinzel text-amber-600 dark:text-amber-300">{user.name}</h1>
                {user.email && <a href={`mailto:${user.email}`} className="text-sm text-gray-500 hover:underline">{user.email}</a>}
                {user.location && <p className="text-sm text-gray-500 flex items-center justify-center gap-1"><LocationIcon className="w-4 h-4" /> {user.location}</p>}
                {user.bio && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 max-w-md mx-auto">{user.bio}</p>}

                {isCurrentUserProfile ? (
                    <button onClick={() => setEditModalOpen(true)} className="mt-4 bg-gray-200 dark:bg-white/10 border border-gray-400 dark:border-gray-600 px-5 py-2 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-white/20">
                        Edit Profile
                    </button>
                ) : (
                    <button onClick={() => onFollowToggle(user.id)} className={`mt-4 px-8 py-2 rounded-full text-sm font-bold ${isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' : 'bg-amber-500 text-black'}`}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>

            <div className="flex justify-around mb-8 p-4 bg-gray-100 dark:bg-black/20 rounded-lg">
                <div className="text-center">
                    <p className="text-xl font-bold">{posts.length}</p>
                    <p className="text-sm text-gray-500">Posts</p>
                </div>
                 <button onClick={() => onShowFollowers(user, 'followers')} className="text-center">
                    <p className="text-xl font-bold">{user.followers.length}</p>
                    <p className="text-sm text-gray-500">Followers</p>
                </button>
                <button onClick={() => onShowFollowers(user, 'following')} className="text-center">
                    <p className="text-xl font-bold">{user.following.length}</p>
                    <p className="text-sm text-gray-500">Following</p>
                </button>
                 {isCurrentUserProfile && (
                     <div className="text-center">
                        <p className="text-xl font-bold">{totalViews.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Views</p>
                    </div>
                 )}
            </div>

            <div>
                <h2 className="text-xl font-cinzel text-amber-600 dark:text-amber-400 mb-4">{isCurrentUserProfile ? 'My Posts' : `${user.name}'s Posts`}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {posts.map(post => (
                        <div key={post.id} className="relative aspect-square bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden group">
                            <img src={post.thumbnailUrl || post.url} alt={post.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-xs">
                                <p className="font-bold line-clamp-2">{post.title}</p>
                                <div className="flex gap-2">
                                    <span><i className="fas fa-heart"></i> {post.likes.length}</span>
                                    <span><i className="fas fa-eye"></i> {post.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 {posts.length === 0 && <p className="text-center text-gray-500 py-8">No posts yet.</p>}
            </div>
        </div>
    );
};

export default ProfileSection;

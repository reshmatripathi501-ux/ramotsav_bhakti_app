import React, { useState } from 'react';
import { User } from '../../types';
import { LocationIcon } from '../icons';

interface EditProfileModalProps {
    user: User;
    onSave: (user: User) => void;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email || '');
    const [bio, setBio] = useState(user.bio || '');
    const [location, setLocation] = useState(user.location || '');
    const [avatar, setAvatar] = useState<string | undefined>(user.avatarUrl);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...user,
            name,
            email,
            bio,
            location,
            avatarUrl: avatar
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-orange-50 dark:bg-[#1e0f05] border-2 border-amber-600 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl dark:shadow-amber-900/50 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 dark:border-amber-800 relative">
                    <h2 className="text-xl font-cinzel text-amber-700 dark:text-amber-300 text-center">Edit Profile</h2>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-gray-500 dark:text-gray-400">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex flex-col items-center">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <img src={avatar || 'https://i.pravatar.cc/150?u=' + user.id} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-amber-400" />
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <p className="text-xs text-gray-500 mt-2">Tap to change photo</p>
                    </div>

                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full p-3 bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" className="w-full p-3 bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white" />
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your Bio" className="w-full p-3 bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white h-20" />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your Location" className="w-full p-3 bg-gray-100 dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white" />

                    <button type="submit" className="w-full p-3 bg-amber-500 text-black font-bold rounded-lg">
                        Save Changes
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes zoom-in {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            `}</style>
        </div>
    );
};

export default EditProfileModal;

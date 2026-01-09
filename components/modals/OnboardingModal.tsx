import React from 'react';
import { HomeIcon, GranthIcon, DarshanIcon, JaapIcon, UploadIcon, ProfileIcon } from '../icons';

interface OnboardingModalProps {
    onClose: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="text-amber-500 dark:text-amber-400 mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    </div>
);

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/90 z-[101] flex items-center justify-center p-4">
            <div 
                className="bg-orange-50 dark:bg-[#1e0f05] border-2 border-amber-600 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl dark:shadow-amber-900/50 animate-zoom-in"
            >
                <div className="p-4 border-b border-gray-200 dark:border-amber-800 text-center">
                    <h2 className="text-xl font-cinzel text-amber-700 dark:text-amber-300">Welcome to Ramotsav!</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Your daily portal for devotion.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <Feature icon={<HomeIcon className="w-6 h-6" />} title="Home Feed" description="Discover bhajans, videos, and photos shared by fellow devotees." />
                    <Feature icon={<GranthIcon className="w-6 h-6" />} title="Granth & News" description="Read sacred texts and get updates. Ask our Granth AI for explanations." />
                    <Feature icon={<DarshanIcon className="w-6 h-6" />} title="AI Darshan" description="Experience a divine view of Shri Ram and ask our AI anything about the sacred image." />
                    <Feature icon={<JaapIcon className="w-6 h-6" />} title="Mantra Jaap" description="Use the digital counter for your daily chanting and feel the divine connection." />
                    <Feature icon={<UploadIcon className="w-6 h-6" />} title="Upload Sewa" description="Share your own devotional content with the community." />
                    <Feature icon={<ProfileIcon className="w-6 h-6" />} title="Profile" description="Manage your profile, see your posts, and view channels of other devotees." />
                </div>
                <div className="p-4">
                    <button onClick={onClose} className="w-full p-3 bg-amber-500 text-black font-bold rounded-lg">
                        Enter the App
                    </button>
                </div>
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

export default OnboardingModal;

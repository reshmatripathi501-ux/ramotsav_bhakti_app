
import React from 'react';
import { Post } from '../../types';

interface GranthReaderModalProps {
    post: Post;
    onClose: () => void;
}

const GranthReaderModal: React.FC<GranthReaderModalProps> = ({ post, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#1e0f05] border-2 border-amber-600 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-amber-900/50 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-amber-800 relative">
                    <h2 className="text-xl font-cinzel text-amber-300 text-center">{post.title}</h2>
                     <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-gray-400">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {post.description}
                    </p>
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

export default GranthReaderModal;

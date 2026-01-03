
import React, { useState } from 'react';
import { Post } from '../../types';

interface CommentsModalProps {
    post: Post;
    currentUser: string;
    onClose: () => void;
    onAddComment: (postId: string, text: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ post, currentUser, onClose, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(post.id, newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-end" onClick={onClose}>
            <div 
                className="bg-[#1a1a1a] w-full max-w-2xl h-[75%] rounded-t-3xl flex flex-col shadow-lg shadow-amber-900/50 animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-700 text-center relative">
                    <h3 className="font-bold text-amber-400">Bhakti Charcha</h3>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">&times;</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {post.comments.length === 0 ? (
                        <p className="text-center text-gray-500">No comments yet.</p>
                    ) : (
                        post.comments.map(comment => (
                            <div key={comment.id} className="text-sm border-b border-gray-800 pb-2">
                                <span className="font-bold text-amber-300">{comment.user}: </span>
                                <span className="text-gray-200">{comment.text}</span>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex gap-2 bg-[#111]">
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Jai Shri Ram likhein..."
                        className="flex-1 bg-[#333] border-none px-4 py-2 rounded-full text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button type="submit" className="bg-amber-500 text-black font-bold px-5 py-2 rounded-full">SEND</button>
                </form>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
            `}</style>
        </div>
    );
};

export default CommentsModal;

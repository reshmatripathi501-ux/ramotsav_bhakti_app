
import React, { useState } from 'react';
import { Post } from '../types';
import { MusicIcon, AiIcon, BookmarkIcon, BookmarkSolidIcon } from './icons';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';

interface PostCardProps {
    post: Post;
    currentUser: string;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    openModal: (modal: 'granth' | 'comments' | 'aiChat', data: Post) => void;
    onSave: (postId: string) => void;
    isSaved: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onDelete, openModal, onSave, isSaved }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isLiked = post.likes.includes(currentUser);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: `${post.title} - ${post.description}\n\nCheck out more on the Ramotsav App!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Sharing is not supported on this browser.");
        }
        setIsMenuOpen(false);
    }

    const renderMedia = () => {
        switch (post.type) {
            case 'video':
                return <VideoPlayer src={post.url} title={post.title} artworkUrl={post.url} />;
            case 'image':
                 return <img src={post.url} alt={post.title} className="w-full h-auto max-h-[70vh] object-contain rounded-lg" />;
            case 'news':
                return <img src={post.url} alt={post.title} onClick={() => openModal('granth', post)} className="w-full h-48 object-cover rounded-lg cursor-pointer" />;
            case 'audio':
                return <AudioPlayer src={post.url} title={post.title} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-[rgba(30,15,5,0.7)] border border-amber-800/50 rounded-2xl p-3 shadow-lg shadow-amber-900/20 transform-gpu" style={{ perspective: '1000px' }}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-800 rounded-full flex items-center justify-center font-bold text-white border-2 border-amber-300">
                        {post.uploader.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-white">{post.uploader}</span>
                </div>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white">
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#222] border border-amber-600 rounded-lg shadow-xl z-10 py-1">
                            {post.type === 'news' && (
                                <a onClick={() => { openModal('aiChat', post); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-amber-600/50 cursor-pointer">
                                    <AiIcon className="w-4 h-4" /> Ask Granth AI
                                </a>
                            )}
                             <a onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-amber-600/50 cursor-pointer">
                                <i className="fas fa-share w-4 h-4"></i> Share
                            </a>
                            {post.uploader === currentUser && (
                                <a onClick={() => { onDelete(post.id); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-600/50 cursor-pointer">
                                    <i className="fas fa-trash w-4 h-4"></i> Delete
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3 space-y-2">
                 <h3 className="font-bold text-amber-300">{post.title}</h3>
                 {renderMedia()}
                 {post.type !== 'news' && post.description && <p className="text-gray-300 text-sm mt-2">{post.description}</p>}
                 {post.type === 'news' && <p className="text-gray-300 text-sm line-clamp-3 mt-2">{post.description}</p>}
            </div>

            <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-5">
                    <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 transition-colors duration-300 ${isLiked ? 'text-red-500' : 'hover:text-white'}`}>
                        <i className={`fas fa-heart text-xl transition-transform duration-300 ${isLiked ? 'scale-110' : ''}`}></i>
                        <span>{post.likes.length}</span>
                    </button>
                    <button onClick={() => openModal('comments', post)} className="flex items-center gap-2 hover:text-white">
                        <i className="far fa-comment text-xl"></i>
                        <span>{post.comments.length}</span>
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => onSave(post.id)} className="transition-colors duration-300 hover:text-amber-400">
                        {isSaved ? <BookmarkSolidIcon className="w-6 h-6 text-amber-400" /> : <BookmarkIcon className="w-6 h-6" />}
                    </button>
                    <span className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;

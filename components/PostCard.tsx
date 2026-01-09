import React, { useState, useEffect } from 'react';
import { Post, User } from '../types';
import { MusicIcon, AiIcon, BookmarkIcon, BookmarkSolidIcon } from './icons';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';

interface PostCardProps {
    post: Post;
    currentUser: User | undefined;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    openModal: (modal: 'granth' | 'comments' | 'aiChat', data: Post) => void;
    onSave: (postId: string) => void;
    isSaved: boolean;
    getUser: (userId: string) => User | undefined;
    onViewPost: (postId: string) => void;
    onViewUser: (userId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onDelete, openModal, onSave, isSaved, getUser, onViewPost, onViewUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        const viewedPosts = JSON.parse(sessionStorage.getItem('viewed_posts') || '{}');
        if (!viewedPosts[post.id]) {
            onViewPost(post.id);
            viewedPosts[post.id] = true;
            sessionStorage.setItem('viewed_posts', JSON.stringify(viewedPosts));
        }
    }, [post.id, onViewPost]);
    
    if (!currentUser) return null;

    const isLiked = post.likes.includes(currentUser.id);
    const uploader = getUser(post.uploaderId);

    const sanitizeFilename = (name: string) => name.replace(/[^a-z0-9_.]/gi, '_').toLowerCase();

    const handleShare = async () => {
        setIsMenuOpen(false);
        try {
            if (post.type === 'news') {
                 if (navigator.share) {
                    await navigator.share({ title: post.title, text: post.description });
                } else {
                    alert('Sharing is not supported on your browser.');
                }
            } else {
                const response = await fetch(post.url);
                const blob = await response.blob();
                const extension = post.url.split(';')[0].split('/').pop() || 'tmp';
                const file = new File([blob], `${sanitizeFilename(post.title)}.${extension}`, { type: blob.type });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: post.title,
                        text: `Check out this from Ramotsav App: ${post.title}`,
                        files: [file],
                    });
                } else if (navigator.share) {
                     await navigator.share({ title: post.title, text: `${post.description}. Shared from Ramotsav.` });
                } else {
                    alert('Sharing is not supported on your browser.');
                }
            }
        } catch (error) {
            console.error('Error sharing:', error);
            alert('Could not share the content. Your browser might not support sharing this type of file.');
        }
    };

    const handleDownload = async () => {
        setIsMenuOpen(false);
        try {
            const a = document.createElement('a');
            a.href = post.url;
            if (post.type === 'news') {
                a.download = `${sanitizeFilename(post.title)}.txt`;
            } else {
                const extension = post.url.split(';')[0].split('/').pop() || 'tmp';
                a.download = `${sanitizeFilename(post.title)}.${extension}`;
            }
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading:', error);
            alert('Could not download the content.');
        }
    };

    const renderMedia = () => {
        switch (post.type) {
            case 'video':
                return <VideoPlayer src={post.url} title={post.title} artworkUrl={post.thumbnailUrl || post.url} poster={post.thumbnailUrl} />;
            case 'image':
                 return <img src={post.url} alt={post.title} className="w-full h-auto max-h-[70vh] object-contain rounded-lg" />;
            case 'news':
                return <img src={post.url} alt={post.title} onClick={() => openModal('granth', post)} className="w-full h-48 object-cover rounded-lg cursor-pointer" />;
            case 'audio':
                return <AudioPlayer src={post.url} title={post.title} artist={uploader?.name} thumbnailUrl={post.thumbnailUrl} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-[rgba(30,15,5,0.7)] border border-gray-200 dark:border-amber-800/50 rounded-2xl p-3 shadow-lg dark:shadow-amber-900/20 transform-gpu" style={{ perspective: '1000px' }}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img src={uploader?.avatarUrl || 'https://i.pravatar.cc/150?u=' + post.uploaderId} alt={uploader?.name} className="w-10 h-10 rounded-full border-2 border-amber-300" />
                    <button onClick={() => onViewUser(post.uploaderId)} className="font-semibold text-gray-800 dark:text-white cursor-pointer hover:underline">{uploader?.name || 'Unknown User'}</button>
                </div>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#222] border border-amber-600 rounded-lg shadow-xl z-10 py-1">
                            {post.type === 'news' && (
                                <a onClick={() => { openModal('aiChat', post); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-amber-600/50 cursor-pointer">
                                    <AiIcon className="w-4 h-4" /> Ask Granth AI
                                </a>
                            )}
                             <a onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-amber-600/50 cursor-pointer">
                                <i className="fas fa-share w-4 h-4"></i> Share
                            </a>
                            <a onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-amber-600/50 cursor-pointer">
                                <i className="fas fa-download w-4 h-4"></i> Download
                            </a>
                            <a onClick={() => { onDelete(post.id); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-600/50 cursor-pointer">
                                <i className="fas fa-trash w-4 h-4"></i> Delete
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3 space-y-2">
                 <h3 className="font-bold text-amber-700 dark:text-amber-300">{post.title}</h3>
                 {renderMedia()}
                 {post.type !== 'news' && post.description && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{post.description}</p>}
                 {post.type === 'news' && <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mt-2">{post.description}</p>}
            </div>

            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-5">
                    <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 transition-colors duration-300 ${isLiked ? 'text-red-500' : 'hover:text-gray-800 dark:hover:text-white'}`}>
                        <i className={`fas fa-heart text-xl transition-transform duration-300 ${isLiked ? 'scale-110' : ''}`}></i>
                        <span>{post.likes.length}</span>
                    </button>
                    <button onClick={() => openModal('comments', post)} className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white">
                        <i className="far fa-comment text-xl"></i>
                        <span>{post.comments.length}</span>
                    </button>
                    <div className="flex items-center gap-1 text-xs">
                        <i className="fas fa-eye"></i>
                        <span>{post.views}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => onSave(post.id)} className="transition-colors duration-300 hover:text-amber-500 dark:hover:text-amber-400">
                        {isSaved ? <BookmarkSolidIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" /> : <BookmarkIcon className="w-6 h-6" />}
                    </button>
                    <span className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;

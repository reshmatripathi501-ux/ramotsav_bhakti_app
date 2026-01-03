
import React, { useState, useEffect, useCallback } from 'react';
import { Post, CommentData, Section, Playlist } from './types';
import { initialPosts } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import PostCard from './components/PostCard';
import JaapSection from './components/JaapSection';
import UploadSection from './components/UploadSection';
import MusicSection from './components/MusicSection';
import GranthReaderModal from './components/modals/GranthReaderModal';
import CommentsModal from './components/modals/CommentsModal';
import AiChatModal from './components/modals/AiChatModal';
import GlobalAiChatModal from './components/modals/GlobalAiChatModal';
import DonateModal from './components/modals/DonateModal';
import OnboardingModal from './components/modals/OnboardingModal';
import PlaylistModal from './components/modals/PlaylistModal';
import DarshanAiSection from './components/DarshanAiSection';
import DailyQuote from './components/DailyQuote';
import { LogoIcon, DonateIcon } from './components/icons';

const PostSkeleton: React.FC = () => (
    <div className="bg-[rgba(30,15,5,0.7)] border border-amber-800/50 rounded-2xl p-3 shadow-lg animate-pulse">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-900/50 rounded-full"></div>
                <div className="w-24 h-4 bg-amber-900/50 rounded"></div>
            </div>
            <div className="w-6 h-6 bg-amber-900/50 rounded"></div>
        </div>
        <div className="w-full h-48 bg-amber-900/50 rounded-lg mb-3"></div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-12 h-6 bg-amber-900/50 rounded"></div>
                <div className="w-12 h-6 bg-amber-900/50 rounded"></div>
            </div>
            <div className="w-20 h-4 bg-amber-900/50 rounded"></div>
        </div>
    </div>
);

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('home');
    const [posts, setPosts] = useLocalStorage<Post[]>('ramotsav_posts', []);
    const [savedPostIds, setSavedPostIds] = useLocalStorage<string[]>('ramotsav_saved_posts', []);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser] = useState('RamBhakt');
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const [homeFilter, setHomeFilter] = useState<'all' | 'saved'>('all');
    const [showOnboarding, setShowOnboarding] = useLocalStorage('ramotsav_onboarding', true);
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        setTimeout(() => {
            const storedPosts = localStorage.getItem('ramotsav_posts');
            if (!storedPosts || JSON.parse(storedPosts).length === 0) {
                 setPosts(initialPosts);
            }
            setIsLoading(false);
        }, 1500);
    }, []);

    const [modalState, setModalState] = useState<{
        granth: Post | null;
        comments: Post | null;
        aiChat: Post | null;
        globalAiChat: boolean;
        donate: boolean;
    }>({ granth: null, comments: null, aiChat: null, globalAiChat: false, donate: false });

    const handleAddPost = (newPost: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
        const postToAdd: Post = { ...newPost, id: `post_${Date.now()}`, timestamp: new Date().toISOString(), likes: [], comments: [] };
        setPosts(prevPosts => [postToAdd, ...prevPosts]);
        setActiveSection(newPost.type === 'news' ? 'granth' : 'home');
    };

    const handleLike = useCallback((postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes.includes(currentUser) ? p.likes.filter(u => u !== currentUser) : [...p.likes, currentUser] } : p));
    }, [posts, setPosts, currentUser]);

    const handleSave = useCallback((postId: string) => {
        setSavedPostIds(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
    }, [setSavedPostIds]);

    const handleAddComment = useCallback((postId: string, text: string) => {
        const newComment: CommentData = { id: `comment_${Date.now()}`, user: currentUser, text };
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    }, [posts, setPosts, currentUser]);

    const handleDeletePost = useCallback((postId: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter(p => p.id !== postId));
        }
    }, [posts, setPosts]);

    const openModal = <K extends keyof typeof modalState>(modal: K, data?: Post) => {
        setModalState(prev => ({ ...prev, [modal]: data || true }));
    };

    const closeModal = <K extends keyof typeof modalState>(modal: K) => {
        setModalState(prev => ({ ...prev, [modal]: null }));
    };

    const renderHome = () => {
        const filteredPosts = homeFilter === 'saved'
            ? posts.filter(p => savedPostIds.includes(p.id))
            : posts.filter(p => p.type !== 'news');
        
        return (
            <>
                <DailyQuote />
                <div className="bg-[rgba(255,153,51,0.1)] border border-amber-500/50 rounded-lg p-3 my-4 text-center">
                    <h3 className="font-bold text-amber-300">Live Aarti (Coming Soon)</h3>
                    <p className="text-sm text-gray-400">Stay tuned for live broadcasts from sacred places.</p>
                </div>
                <div className="flex border-b border-amber-800/50 mb-4">
                    <button onClick={() => setHomeFilter('all')} className={`flex-1 pb-2 font-semibold ${homeFilter === 'all' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500'}`}>For You</button>
                    <button onClick={() => setHomeFilter('saved')} className={`flex-1 pb-2 font-semibold ${homeFilter === 'saved' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500'}`}>Saved Posts</button>
                </div>
                <div className="space-y-4">
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} onDelete={handleDeletePost} openModal={openModal} onSave={handleSave} isSaved={savedPostIds.includes(post.id)} />
                    )) : <p className="text-center text-gray-500 py-8">No saved posts yet.</p>}
                </div>
            </>
        );
    };

    const renderSection = () => {
        if (isLoading) return <div className="space-y-4 pt-4"><PostSkeleton /><PostSkeleton /></div>;
        switch (activeSection) {
            case 'home': return renderHome();
            case 'granth': return <div className="space-y-4 pt-4"><h2 className="text-2xl font-cinzel text-center text-amber-400">Granth & News</h2>{posts.filter(p => p.type === 'news').map(post => <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} onDelete={handleDeletePost} openModal={openModal} onSave={handleSave} isSaved={savedPostIds.includes(post.id)} />)}</div>;
            case 'darshan': return <DarshanAiSection />;
            case 'music': return <MusicSection onPlaylistSelect={setActivePlaylist} />;
            case 'jaap': return <JaapSection />;
            case 'upload': return <UploadSection onAddPost={handleAddPost} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white bg-[radial-gradient(circle_at_center,_#2a1000_0%,_#000000_100%)]">
            <header className="sticky top-0 z-40 bg-[rgba(10,5,0,0.8)] backdrop-blur-lg border-b-2 border-amber-600 flex justify-between items-center px-4 py-3 shadow-lg shadow-amber-900/50">
                <div className="font-cinzel text-2xl font-bold gold-gradient-text">RAMOTSAV</div>
                <div className="flex items-center gap-2">
                    <div className="text-amber-300 text-xs border border-amber-400/50 rounded-full px-3 py-1 flex items-center gap-2">
                        <LogoIcon className="h-4 w-4 text-amber-400" />{currentUser}
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsHeaderMenuOpen(prev => !prev)} className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                         {isHeaderMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#222] border border-amber-600 rounded-lg shadow-xl z-20 py-1">
                                <a onClick={() => { openModal('globalAiChat'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-amber-600/50 cursor-pointer"><i className="fas fa-robot w-4 h-4"></i> AI Guru</a>
                                <a onClick={() => { openModal('donate'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-amber-600/50 cursor-pointer"><DonateIcon className="w-4 h-4" /> Sewa/Donate</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pb-24 px-2">{renderSection()}</main>

            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
            {modalState.granth && <GranthReaderModal post={modalState.granth} onClose={() => closeModal('granth')} />}
            {modalState.comments && <CommentsModal post={modalState.comments} onClose={() => closeModal('comments')} onAddComment={handleAddComment} currentUser={currentUser} />}
            {modalState.aiChat && <AiChatModal post={modalState.aiChat} onClose={() => closeModal('aiChat')} />}
            {modalState.globalAiChat && <GlobalAiChatModal onClose={() => closeModal('globalAiChat')} />}
            {modalState.donate && <DonateModal onClose={() => closeModal('donate')} />}
            {activePlaylist && <PlaylistModal playlist={activePlaylist} onClose={() => setActivePlaylist(null)} />}
            
            <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
    );
};

export default App;

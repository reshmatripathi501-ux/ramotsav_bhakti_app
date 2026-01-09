import React, { useState, useEffect, useCallback } from 'react';
import { Post, CommentData, Section, Playlist, User, Notification, JaapRecord } from './types';
import { initialPosts, initialUsers } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import PostCard from './components/PostCard';
import JaapSection from './components/JaapSection';
import UploadSection from './components/UploadSection';
import MusicSection from './components/MusicSection';
import LiveSection from './components/LiveSection';
import GranthReaderModal from './components/modals/GranthReaderModal';
import CommentsModal from './components/modals/CommentsModal';
import AiChatModal from './components/modals/AiChatModal';
import GlobalAiChatModal from './components/modals/GlobalAiChatModal';
import DonateModal from './components/modals/DonateModal';
import OnboardingModal from './components/modals/OnboardingModal';
import PlaylistModal from './components/modals/PlaylistModal';
import DonationSplashScreen from './components/modals/DonationSplashScreen';
import DarshanAiSection from './components/DarshanAiSection';
import DailyQuote from './components/DailyQuote';
import ProfileSection from './components/ProfileSection';
import CommunitySection from './components/CommunitySection';
import FollowersModal from './components/modals/FollowersModal';
import NotificationsModal from './components/modals/NotificationsModal';
import LeaderboardModal from './components/modals/LeaderboardModal';
import { LogoIcon, DonateIcon, LiveIcon, ThemeIcon, UploadIcon, ProfileIcon, NotificationIcon, CommunityIcon, LeaderboardIcon } from './components/icons';

const PostSkeleton: React.FC = () => (
    <div className="bg-gray-200 dark:bg-[rgba(30,15,5,0.7)] border border-gray-300 dark:border-amber-800/50 rounded-2xl p-3 shadow-lg animate-pulse">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-amber-900/50 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-300 dark:bg-amber-900/50 rounded"></div>
            </div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-amber-900/50 rounded"></div>
        </div>
        <div className="w-full h-48 bg-gray-300 dark:bg-amber-900/50 rounded-lg mb-3"></div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-12 h-6 bg-gray-300 dark:bg-amber-900/50 rounded"></div>
                <div className="w-12 h-6 bg-gray-300 dark:bg-amber-900/50 rounded"></div>
            </div>
            <div className="w-20 h-4 bg-gray-300 dark:bg-amber-900/50 rounded"></div>
        </div>
    </div>
);

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('home');
    const [posts, setPosts] = useLocalStorage<Post[]>('ramotsav_posts', []);
    const [users, setUsers] = useLocalStorage<User[]>('ramotsav_users', initialUsers);
    const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('ramotsav_currentUserId', null);
    const [savedPostIds, setSavedPostIds] = useLocalStorage<string[]>('ramotsav_saved_posts', []);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('ramotsav_notifications', []);
    const [jaapHistory, setJaapHistory] = useLocalStorage<JaapRecord[]>('jaap_history', []);
    const [isLoading, setIsLoading] = useState(true);
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const [homeFilter, setHomeFilter] = useState<'all' | 'saved'>('all');
    const [showOnboarding, setShowOnboarding] = useLocalStorage('ramotsav_onboarding', true);
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
    const [showSplash, setShowSplash] = useState(!sessionStorage.getItem('splashSeen'));
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const [theme, setTheme] = useLocalStorage('ramotsav_theme', 'dark');
    const [followersModalState, setFollowersModalState] = useState<{ isOpen: boolean; user: User | null; initialTab: 'followers' | 'following' }>({ isOpen: false, user: null, initialTab: 'followers' });
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    useEffect(() => {
        setTimeout(() => {
            if (posts.length === 0) {
                 setPosts(initialPosts);
            }
            if (!currentUserId) {
                const defaultUser = users.find(u => u.name === 'Bhakta') || users[0];
                if (defaultUser) {
                    setCurrentUserId(defaultUser.id);
                }
            }
            setIsLoading(false);
        }, 1500);
    }, []);

    const currentUser = users.find(u => u.id === currentUserId);

    const [modalState, setModalState] = useState<{
        granth: Post | null;
        comments: Post | null;
        aiChat: Post | null;
        globalAiChat: boolean;
        donate: boolean;
        leaderboard: boolean;
    }>({ granth: null, comments: null, aiChat: null, globalAiChat: false, donate: false, leaderboard: false });
    
    const addNotification = useCallback((type: 'like' | 'comment' | 'follow', fromUserId: string, toUserId: string, postId?: string) => {
        if (fromUserId === toUserId) return;
        const newNotification: Notification = {
            id: `notif_${Date.now()}`,
            type,
            fromUserId,
            toUserId,
            postId,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, [setNotifications]);

    const handleAddPost = (newPost: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'views'>) => {
        const postToAdd: Post = { ...newPost, id: `post_${Date.now()}`, timestamp: new Date().toISOString(), likes: [], comments: [], views: 0 };
        setPosts(prevPosts => [postToAdd, ...prevPosts]);
        setActiveSection('home');
    };
    
    const getUser = useCallback((userId: string) => {
        return users.find(u => u.id === userId);
    }, [users]);

    const handleLike = useCallback((postId: string) => {
        if (!currentUser) return;
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        const isLiked = post.likes.includes(currentUser.id);
        if (!isLiked) {
             addNotification('like', currentUser.id, post.uploaderId, postId);
        }

        setPosts(posts.map(p => p.id === postId ? { ...p, likes: isLiked ? p.likes.filter(u => u !== currentUser.id) : [...p.likes, currentUser.id] } : p));
    }, [posts, setPosts, currentUser, addNotification]);

    const handleSave = useCallback((postId: string) => {
        setSavedPostIds(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
    }, [setSavedPostIds]);

    const handleAddComment = useCallback((postId: string, text: string) => {
        if (!currentUser) return;
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const newComment: CommentData = { id: `comment_${Date.now()}`, userId: currentUser.id, text };
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        addNotification('comment', currentUser.id, post.uploaderId, postId);
    }, [posts, setPosts, currentUser, addNotification]);

    const handleDeletePost = useCallback((postId: string) => {
        if (window.confirm("क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?")) {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        }
    }, [setPosts]);

    const handleViewPost = useCallback((postId: string) => {
        setPosts(posts => posts.map(p => p.id === postId ? {...p, views: (p.views || 0) + 1} : p));
    }, [setPosts]);
    
    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleFollowToggle = useCallback((userIdToFollow: string) => {
        if (!currentUser) return;
        const currentUserId = currentUser.id;
        const isCurrentlyFollowing = currentUser.following.includes(userIdToFollow);
        if(!isCurrentlyFollowing) {
            addNotification('follow', currentUserId, userIdToFollow);
        }
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userIdToFollow) {
                const newFollowers = isCurrentlyFollowing ? user.followers.filter(id => id !== currentUserId) : [...user.followers, currentUserId];
                return { ...user, followers: newFollowers };
            }
            if (user.id === currentUserId) {
                const newFollowing = isCurrentlyFollowing ? user.following.filter(id => id !== userIdToFollow) : [...user.following, userIdToFollow];
                return { ...user, following: newFollowing };
            }
            return user;
        }));
    }, [currentUser, setUsers, addNotification]);
    
    const handleViewUser = (userId: string) => {
        setViewingUserId(userId);
        setActiveSection('profile');
        setFollowersModalState({isOpen: false, user: null, initialTab: 'followers'}); // Close follower modal if open
    };
    
    const openFollowersModal = (user: User, tab: 'followers' | 'following') => {
        setFollowersModalState({ isOpen: true, user, initialTab: tab });
    };

    const handleMarkNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const openModal = <K extends keyof typeof modalState>(modal: K, data?: Post) => {
        setModalState(prev => ({ ...prev, [modal]: data || true }));
    };

    const closeModal = <K extends keyof typeof modalState>(modal: K) => {
        setModalState(prev => ({ ...prev, [modal]: null }));
    };
    
    const handleSplashClose = () => {
        sessionStorage.setItem('splashSeen', 'true');
        setShowSplash(false);
    };

    if (showSplash) {
        return <DonationSplashScreen onClose={handleSplashClose} />;
    }
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const renderHome = () => {
        const basePosts = homeFilter === 'saved'
            ? posts.filter(p => savedPostIds.includes(p.id))
            : posts.filter(p => p.type !== 'news' && p.type !== 'audio');
        
        const filteredPosts = searchQuery
            ? basePosts.filter(p => 
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : basePosts;
        
        return (
            <>
                <DailyQuote />
                <div className="mb-4 relative">
                     <input 
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="वीडियो या फोटो खोजें..."
                        className="w-full p-3 pl-10 bg-gray-200 dark:bg-[#222] border border-gray-400 dark:border-gray-600 rounded-full text-gray-800 dark:text-white placeholder-gray-500"
                    />
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                </div>
                <div onClick={() => setActiveSection('live')} className="cursor-pointer bg-gradient-to-tr from-red-900/40 to-red-600/30 border border-red-500/50 rounded-xl p-4 my-4 text-center shadow-lg flex items-center justify-between group transform-3d">
                    <div className="group-hover:scale-105 transition-transform">
                        <h3 className="font-bold text-red-300">Live Aarti Darshan</h3>
                        <p className="text-sm text-gray-400">Join the live broadcast from sacred places.</p>
                    </div>
                    <div className="text-red-400 text-2xl animate-pulse">
                        <LiveIcon className="w-8 h-8"/>
                    </div>
                </div>
                <div className="flex border-b border-amber-800/50 mb-4">
                    <button onClick={() => setHomeFilter('all')} className={`flex-1 pb-2 font-semibold ${homeFilter === 'all' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500'}`}>For You</button>
                    <button onClick={() => setHomeFilter('saved')} className={`flex-1 pb-2 font-semibold ${homeFilter === 'saved' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500'}`}>Saved Posts</button>
                </div>
                <div className="space-y-4">
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} currentUser={currentUser} getUser={getUser} onLike={handleLike} onDelete={handleDeletePost} openModal={openModal} onSave={handleSave} isSaved={savedPostIds.includes(post.id)} onViewPost={handleViewPost} onViewUser={handleViewUser} />
                    )) : <p className="text-center text-gray-500 py-8">{searchQuery ? `No results for "${searchQuery}"` : 'No saved posts yet.'}</p>}
                </div>
            </>
        );
    };

    const renderSection = () => {
        if (isLoading || !currentUser) return <div className="space-y-4 pt-4"><PostSkeleton /><PostSkeleton /></div>;
        if (viewingUserId && activeSection === 'profile') {
            const userToView = users.find(u => u.id === viewingUserId);
            if(userToView) return <ProfileSection user={userToView} posts={posts.filter(p => p.uploaderId === viewingUserId)} currentUser={currentUser} isCurrentUserProfile={false} onBack={() => { setActiveSection('home'); setViewingUserId(null); }} onUpdateUser={handleUpdateUser} onFollowToggle={handleFollowToggle} onShowFollowers={openFollowersModal}/>
        }

        switch (activeSection) {
            case 'home': return renderHome();
            case 'granth': return <div className="space-y-4 pt-4"><h2 className="text-2xl font-cinzel text-center text-amber-400">Granth & News</h2>{posts.filter(p => p.type === 'news').map(post => <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} onDelete={handleDeletePost} openModal={openModal} onSave={handleSave} isSaved={savedPostIds.includes(post.id)} getUser={getUser} onViewPost={handleViewPost} onViewUser={handleViewUser} />)}</div>;
            case 'darshan': return <DarshanAiSection />;
            case 'music': return <MusicSection onPlaylistSelect={setActivePlaylist} allPosts={posts} getUser={getUser} />;
            case 'jaap': return <JaapSection history={jaapHistory} setHistory={setJaapHistory} />;
            case 'upload': return <UploadSection onAddPost={handleAddPost} currentUser={currentUser} />;
            case 'live': return <LiveSection currentUser={currentUser} />;
            case 'community': return <CommunitySection users={users} onUserSelect={handleViewUser} />;
            case 'profile': return <ProfileSection user={currentUser} posts={posts.filter(p => p.uploaderId === currentUser.id)} currentUser={currentUser} isCurrentUserProfile={true} onBack={() => setActiveSection('home')} onUpdateUser={handleUpdateUser} onFollowToggle={handleFollowToggle} onShowFollowers={openFollowersModal} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 text-gray-800 dark:bg-black dark:text-white dark:bg-[radial-gradient(circle_at_center,_#2a1000_0%,_#000000_100%)]">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[rgba(10,5,0,0.8)] backdrop-blur-lg border-b-2 border-amber-600 flex justify-between items-center px-4 py-3 shadow-lg dark:shadow-amber-900/50">
                <div className="font-cinzel text-2xl font-bold gold-gradient-text">RAMOTSAV</div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsNotificationsOpen(true)} className="relative text-gray-600 dark:text-gray-300">
                        <NotificationIcon className="w-6 h-6"/>
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
                    </button>
                    <div className="relative">
                        <button onClick={() => setIsHeaderMenuOpen(prev => !prev)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                         {isHeaderMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#222] border border-amber-600 rounded-lg shadow-xl z-20 py-1">
                                <a onClick={() => { setActiveSection('profile'); setViewingUserId(null); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><ProfileIcon className="w-4 h-4" /> My Profile</a>
                                <a onClick={() => { openModal('leaderboard'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><LeaderboardIcon className="w-4 h-4" /> Leaderboard</a>
                                <a onClick={() => { setActiveSection('upload'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><UploadIcon className="w-4 h-4" /> Upload Sewa</a>
                                <a onClick={() => { setActiveSection('community'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><CommunityIcon className="w-4 h-4" /> Community</a>
                                <hr className="border-gray-200 dark:border-amber-800 my-1"/>
                                <a onClick={() => { setActiveSection('live'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><LiveIcon className="w-4 h-4" /> Live Darshan</a>
                                <a onClick={() => { openModal('globalAiChat'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><i className="fas fa-robot w-4 h-4"></i> AI Guru</a>
                                <a onClick={() => { openModal('donate'); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><DonateIcon className="w-4 h-4" /> Sewa/Donate</a>
                                <a onClick={() => { toggleTheme(); setIsHeaderMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-amber-600/20 dark:hover:bg-amber-600/50 cursor-pointer"><ThemeIcon className="w-4 h-4" /> {theme === 'dark' ? 'Light' : 'Dark'} Mode</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pb-24 px-2">{renderSection()}</main>

            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
            {modalState.granth && <GranthReaderModal post={modalState.granth} onClose={() => closeModal('granth')} />}
            {modalState.comments && <CommentsModal post={modalState.comments} onClose={() => closeModal('comments')} onAddComment={handleAddComment} currentUser={currentUser} getUser={getUser} />}
            {modalState.aiChat && <AiChatModal post={modalState.aiChat} onClose={() => closeModal('aiChat')} />}
            {modalState.globalAiChat && <GlobalAiChatModal onClose={() => closeModal('globalAiChat')} currentUser={currentUser} />}
            {modalState.donate && <DonateModal onClose={() => closeModal('donate')} />}
            {modalState.leaderboard && <LeaderboardModal onClose={() => closeModal('leaderboard')} users={users} currentUser={currentUser} currentHistory={jaapHistory} />}
            {activePlaylist && <PlaylistModal playlist={activePlaylist} onClose={() => setActivePlaylist(null)} />}
            {followersModalState.isOpen && followersModalState.user && (
                <FollowersModal 
                    user={followersModalState.user}
                    allUsers={users}
                    initialTab={followersModalState.initialTab}
                    onClose={() => setFollowersModalState({ isOpen: false, user: null, initialTab: 'followers' })}
                    onUserSelect={handleViewUser}
                />
            )}
             {isNotificationsOpen && (
                <NotificationsModal
                    notifications={notifications}
                    onClose={() => setIsNotificationsOpen(false)}
                    onRead={handleMarkNotificationsRead}
                    getUser={getUser}
                    getPost={(postId) => posts.find(p => p.id === postId)}
                    onUserSelect={(userId) => { handleViewUser(userId); setIsNotificationsOpen(false); }}
                />
            )}
            
            <BottomNav activeSection={activeSection} setActiveSection={(section) => { setViewingUserId(null); setActiveSection(section); }} />
        </div>
    );
};

export default App;
import { Post, User } from './types';

export const initialUsers: User[] = [
    { id: 'user_bhakta', name: 'Bhakta', email: 'bhakt@ramotsav.app', bio: 'A humble devotee sharing divine moments.', location: 'Ayodhya, India', followers: ['user_rambhakt', 'user_sitafan'], following: ['user_mandir_admin', 'user_geeta_gyan', 'user_bhajan_premi'] },
    { id: 'user_mandir_admin', name: 'Mandir Admin', avatarUrl: 'https://i.pinimg.com/564x/c2/39/c0/c239c0540a1586a111a43a755601931a.jpg', bio: 'Official updates from the temple administration.', location: 'Ayodhya, India', followers: ['user_bhakta', 'user_rambhakt'], following: [] },
    { id: 'user_geeta_gyan', name: 'Geeta Gyan', bio: 'Spreading the wisdom of the Bhagavad Gita.', location: 'Vrindavan, India', followers: ['user_bhakta', 'user_geetafan'], following: ['user_bhakta'] },
    { id: 'user_bhajan_premi', name: 'Bhajan Premi', bio: 'Lost in the melodies of devotion.', location: 'Mumbai, India', followers: ['user_bhakta'], following: [] },
    { id: 'user_rambhakt', name: 'RamBhakt', bio: 'Jai Shri Ram!', location: 'Delhi, India', followers: [], following: ['user_mandir_admin', 'user_bhakta'] },
    { id: 'user_sitafan', name: 'SitaFan', bio: 'Follower of Mata Sita.', location: 'Janakpur, Nepal', followers: [], following: ['user_bhakta'] },
    { id: 'user_geetafan', name: 'GeetaFan', bio: 'Learning every day.', location: 'Pune, India', followers: [], following: ['user_geeta_gyan'] }
];

export const initialPosts: Post[] = [
    {
        id: 'post_1',
        uploaderId: 'user_mandir_admin',
        type: 'video',
        url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_aarti.mp4',
        title: 'Ayodhya Ram Mandir Aarti',
        description: 'Subah ki aarti, Ram Mandir, Ayodhya.',
        likes: ['user_rambhakt', 'user_mandir_admin', 'user_sitafan'],
        comments: [
            { id: 'c1', userId: 'user_rambhakt', text: 'Jai Shri Ram!' },
            { id: 'c2', userId: 'user_sitafan', text: 'Manmohak drishya!' },
        ],
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        views: 1508,
    },
    {
        id: 'post_2',
        uploaderId: 'user_geeta_gyan',
        type: 'news',
        url: 'https://i.pinimg.com/originals/9e/11/a9/9e11a91c28c29b7a475514f762643793.jpg',
        title: 'Shrimad Bhagavad Gita - Adhyay 1',
        description: 'Arjuna Vishada Yoga (Arjuna\'s Dilemma)\n\nThe first chapter of the Bhagavad Gita introduces the scene, the setting, the characters, and the circumstances that led to the epic battle of Kurukshetra. It describes in detail the armies on both sides and their principal warriors. As the two armies stand ready for battle, Arjuna, the mighty warrior, sees his dear friends, relatives, and teachers on both sides. Overcome by grief and compassion, he fails in his determination to fight. He is confused about what is right and wrong and feels weak and helpless. He lays down his bow and arrows and turns to his charioteer, Lord Krishna, for guidance.',
        likes: ['user_rambhakt', 'user_geetafan'],
        comments: [],
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        views: 876,
    },
    {
        id: 'post_3',
        uploaderId: 'user_bhajan_premi',
        type: 'audio',
        url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_siya_ram.mp3',
        title: 'Ram Siya Ram',
        description: 'A beautiful bhajan by Sachet Tandon.',
        likes: ['user_rambhakt'],
        comments: [],
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        views: 2340,
    },
];

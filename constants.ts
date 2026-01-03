
import { Post } from './types';

export const initialPosts: Post[] = [
    {
        id: 'post_1',
        uploader: 'Mandir Admin',
        type: 'video',
        url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_aarti.mp4',
        title: 'Ayodhya Ram Mandir Aarti',
        description: 'Subah ki aarti, Ram Mandir, Ayodhya.',
        likes: ['RamBhakt', 'Admin', 'SitaFan'],
        comments: [
            { id: 'c1', user: 'RamBhakt', text: 'Jai Shri Ram!' },
            { id: 'c2', user: 'SitaFan', text: 'Manmohak drishya!' },
        ],
        timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'post_2',
        uploader: 'Geeta Gyan',
        type: 'news',
        url: 'https://i.pinimg.com/originals/9e/11/a9/9e11a91c28c29b7a475514f762643793.jpg',
        title: 'Shrimad Bhagavad Gita - Adhyay 1',
        description: 'Arjuna Vishada Yoga (Arjuna\'s Dilemma)\n\nThe first chapter of the Bhagavad Gita introduces the scene, the setting, the characters, and the circumstances that led to the epic battle of Kurukshetra. It describes in detail the armies on both sides and their principal warriors. As the two armies stand ready for battle, Arjuna, the mighty warrior, sees his dear friends, relatives, and teachers on both sides. Overcome by grief and compassion, he fails in his determination to fight. He is confused about what is right and wrong and feels weak and helpless. He lays down his bow and arrows and turns to his charioteer, Lord Krishna, for guidance.',
        likes: ['RamBhakt', 'GeetaFan'],
        comments: [],
        timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'post_3',
        uploader: 'Bhajan Premi',
        type: 'audio',
        url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_siya_ram.mp3',
        title: 'Ram Siya Ram',
        description: 'A beautiful bhajan by Sachet Tandon.',
        likes: ['RamBhakt'],
        comments: [],
        timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
];


import { Playlist } from './types';

export const devotionalPlaylists: Playlist[] = [
    {
        id: 'playlist_1',
        title: 'Morning Bhajans',
        description: 'Start your day with these soulful bhajans dedicated to Shri Ram.',
        coverUrl: 'https://i.pinimg.com/564x/c2/39/c0/c239c0540a1586a111a43a755601931a.jpg',
        songs: [
            {
                title: 'Ram Siya Ram',
                artist: 'Sachet Tandon',
                url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_siya_ram.mp3',
            },
            {
                title: 'Shri Ram Janki',
                artist: 'Anuradha Paudwal',
                url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/shri_ram_janki.mp3',
            },
            {
                title: 'Ram Aayenge',
                artist: 'Swati Mishra',
                url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/ram_aayenge.mp3',
            }
        ],
    },
    {
        id: 'playlist_2',
        title: 'Peaceful Mantras',
        description: 'Chants and mantras for meditation and a peaceful mind.',
        coverUrl: 'https://i.pinimg.com/564x/e7/87/42/e787425316f73a3c8iot_8a.jpg',
        songs: [
             {
                title: 'Om Namah Shivaya',
                artist: 'Krishna Das',
                url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/om_namah_shivaya.mp3',
            },
            {
                title: 'Gayatri Mantra',
                artist: 'Anuradha Paudwal',
                url: 'https://storage.googleapis.com/static.aiforkids.com/ramotsav/gayatri_mantra.mp3',
            },
        ],
    }
];

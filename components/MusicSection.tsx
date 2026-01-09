import React, { useState, useMemo } from 'react';
import { devotionalPlaylists } from '../playlists';
import { Playlist, Post, Song, User } from '../types';
import AudioPlayer from './AudioPlayer';

interface MusicSectionProps {
    onPlaylistSelect: (playlist: Playlist) => void;
    allPosts: Post[];
    getUser: (userId: string) => User | undefined;
}

const PlaylistCard: React.FC<{ playlist: Playlist; onSelect: () => void }> = ({ playlist, onSelect }) => (
    <div 
        className="bg-gradient-to-br from-amber-100/50 to-white/30 dark:from-amber-900/50 dark:to-black/30 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-amber-800/50 transform transition-transform hover:scale-105 cursor-pointer"
        onClick={onSelect}
    >
        <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-gray-800 dark:text-white truncate">{playlist.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{playlist.description}</p>
        </div>
    </div>
);

const MusicSection: React.FC<MusicSectionProps> = ({ onPlaylistSelect, allPosts, getUser }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const userUploadedSongs = useMemo(() => {
        return allPosts
            .filter(post => post.type === 'audio')
            .map(post => ({
                title: post.title,
                artist: getUser(post.uploaderId)?.name || 'Unknown Artist',
                url: post.url,
                thumbnailUrl: post.thumbnailUrl,
            }));
    }, [allPosts, getUser]);

    const allSongs: Song[] = useMemo(() => {
        const playlistSongs = devotionalPlaylists.flatMap(p => p.songs);
        // A simple way to deduplicate songs by URL if they appear in both playlists and uploads
        const combined = [...userUploadedSongs, ...playlistSongs];
        const uniqueSongs = Array.from(new Map(combined.map(song => [song.url, song])).values());
        return uniqueSongs;
    }, [userUploadedSongs]);
    
    const filteredPlaylists = devotionalPlaylists.filter(playlist => 
        searchQuery ? playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    const filteredSongs = allSongs.filter(song => 
        searchQuery ? (song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.artist.toLowerCase().includes(searchQuery.toLowerCase())) : true
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-cinzel text-center text-amber-600 dark:text-amber-400 mb-6">Bhakti Sangeet</h2>
            <div className="mb-6 relative">
                 <input 
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Bhajans or Mantras..."
                    className="w-full p-3 pl-10 bg-gray-200 dark:bg-[#222] border border-gray-400 dark:border-gray-600 rounded-full text-gray-800 dark:text-white placeholder-gray-500"
                />
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            </div>

            {filteredPlaylists.length > 0 && (
                <>
                    <h3 className="text-lg font-cinzel text-amber-700 dark:text-amber-300 mb-3">Playlists</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {filteredPlaylists.map(playlist => (
                            <PlaylistCard key={playlist.id} playlist={playlist} onSelect={() => onPlaylistSelect(playlist)} />
                        ))}
                    </div>
                </>
            )}

            {filteredSongs.length > 0 && (
                 <>
                    <h3 className="text-lg font-cinzel text-amber-700 dark:text-amber-300 mb-3">All Bhajans</h3>
                     <div className="space-y-2">
                        {filteredSongs.map((song, index) => (
                           <div key={`${song.url}-${index}`} className="bg-white dark:bg-[rgba(30,15,5,0.7)] p-2 rounded-lg border border-gray-200 dark:border-transparent">
                             <AudioPlayer src={song.url} title={song.title} artist={song.artist} thumbnailUrl={song.thumbnailUrl} />
                           </div>
                        ))}
                    </div>
                </>
            )}

             {filteredPlaylists.length === 0 && filteredSongs.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No results found for "{searchQuery}".</p>
            )}
        </div>
    );
};

export default MusicSection;

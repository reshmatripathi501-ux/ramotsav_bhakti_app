
import React from 'react';
import { devotionalPlaylists } from '../playlists';
import { Playlist } from '../types';

interface MusicSectionProps {
    onPlaylistSelect: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<{ playlist: Playlist; onSelect: () => void }> = ({ playlist, onSelect }) => (
    <div 
        className="bg-gradient-to-br from-amber-900/50 to-black/30 rounded-lg overflow-hidden shadow-lg border border-amber-800/50 transform transition-transform hover:scale-105 cursor-pointer"
        onClick={onSelect}
    >
        <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-white truncate">{playlist.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
        </div>
    </div>
);

const MusicSection: React.FC<MusicSectionProps> = ({ onPlaylistSelect }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-cinzel text-center text-amber-400 mb-6">Bhakti Sangeet</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {devotionalPlaylists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} onSelect={() => onPlaylistSelect(playlist)} />
                ))}
            </div>
        </div>
    );
};

export default MusicSection;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Playlist } from '../../types';

interface PlaylistModalProps {
    playlist: Playlist;
    onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ playlist, onClose }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      return null;
    }

    const currentSong = playlist.songs[currentSongIndex];

    const playNextSong = useCallback(() => {
        setCurrentSongIndex(prev => (prev + 1) % playlist.songs.length);
    }, [playlist.songs.length]);

    const playPrevSong = useCallback(() => {
        setCurrentSongIndex(prev => (prev - 1 + playlist.songs.length) % playlist.songs.length);
    }, [playlist.songs.length]);

    const updateMediaSession = useCallback(() => {
        if ('mediaSession' in navigator && currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: playlist.title,
                artwork: [{ src: currentSong.thumbnailUrl || playlist.coverUrl, sizes: '512x512', type: 'image/jpeg' }]
            });
            navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
            navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
            navigator.mediaSession.setActionHandler('previoustrack', playPrevSong);
            navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
        }
    }, [currentSong, playlist.title, playlist.coverUrl, playNextSong, playPrevSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(e => console.error("Playback failed", e));
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSongIndex]);

    useEffect(() => {
        updateMediaSession();
    }, [currentSong, updateMediaSession]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current && duration > 0) {
            audioRef.current.currentTime = (Number(e.target.value) / 100) * duration;
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
            setCurrentTime(audio.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-end" onClick={onClose}>
            <div 
                className="bg-orange-50 dark:bg-[#100802] w-full max-w-2xl h-[85%] rounded-t-3xl flex flex-col shadow-lg dark:shadow-amber-900/50 animate-slide-up border-t-2 border-amber-500"
                onClick={e => e.stopPropagation()}
            >
                <audio 
                    ref={audioRef}
                    src={currentSong.url}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={playNextSong}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    autoPlay={isPlaying}
                />
                <div className="p-4 border-b border-gray-200 dark:border-amber-800 text-center relative">
                    <h3 className="font-bold text-amber-600 dark:text-amber-400 font-cinzel">{playlist.title}</h3>
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 dark:text-gray-400">&times;</button>
                </div>

                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <img src={currentSong.thumbnailUrl || playlist.coverUrl} alt={currentSong.title} className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"/>
                    
                    <div className="text-center mb-4">
                        <h2 className="text-xl text-gray-800 dark:text-white font-bold">{currentSong.title}</h2>
                        <p className="text-amber-700 dark:text-amber-300">{currentSong.artist}</p>
                    </div>

                    <div className="mt-auto space-y-2">
                         <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min="0" max="100" value={progress}
                                onChange={handleSeek}
                                className="w-full h-1 bg-gray-300 dark:bg-white/20 rounded-lg appearance-none cursor-pointer"
                                style={{ background: `linear-gradient(to right, #f59e0b ${progress}%, #9ca3af ${progress}%)` }}
                            />
                            <span>{formatTime(duration)}</span>
                        </div>
                        <div className="flex justify-center items-center gap-6">
                            <button onClick={playPrevSong} className="text-2xl text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"><i className="fas fa-step-backward"></i></button>
                            <button onClick={togglePlayPause} className="text-5xl text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300">
                                <i className={`fas ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
                            </button>
                            <button onClick={playNextSong} className="text-2xl text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"><i className="fas fa-step-forward"></i></button>
                        </div>
                    </div>
                </div>

                <div className="h-32 overflow-y-auto border-t border-gray-200 dark:border-amber-800">
                    {playlist.songs.map((song, index) => (
                        <div key={index} onClick={() => { setCurrentSongIndex(index); setIsPlaying(true); }} className={`p-2 flex items-center gap-3 cursor-pointer ${index === currentSongIndex ? 'bg-amber-100 dark:bg-amber-800/50' : 'hover:bg-amber-100/50 dark:hover:bg-amber-800/20'}`}>
                           {index === currentSongIndex && isPlaying ? <i className="fas fa-volume-up text-amber-500 dark:text-amber-400"></i> : <i className="fas fa-music text-gray-500"></i>}
                           <div>
                            <p className={`font-semibold ${index === currentSongIndex ? 'text-amber-700 dark:text-amber-300' : 'text-gray-800 dark:text-white'}`}>{song.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
                           </div>
                        </div>
                    ))}
                </div>

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

export default PlaylistModal;

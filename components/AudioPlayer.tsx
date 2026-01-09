import React, { useState, useRef, useEffect } from 'react';
import { MusicIcon } from './icons';

interface AudioPlayerProps {
    src: string;
    title: string;
    artist?: string;
    thumbnailUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, artist, thumbnailUrl }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
            setCurrentTime(audio.currentTime);
        };
        const setAudioDuration = () => setDuration(audio.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioDuration);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist || 'Ramotsav App',
                album: 'Bhakti Sangeet',
                artwork: [{ src: thumbnailUrl || 'https://i.pinimg.com/564x/c2/39/c0/c239c0540a1586a111a43a755601931a.jpg', sizes: '512x512', type: 'image/jpeg' }]
            });
            navigator.mediaSession.setActionHandler('play', () => audio.play());
            navigator.mediaSession.setActionHandler('pause', () => audio.pause());
            navigator.mediaSession.setActionHandler('seekbackward', () => { audio.currentTime = Math.max(audio.currentTime - 10, 0); });
            navigator.mediaSession.setActionHandler('seekforward', () => { audio.currentTime = Math.min(audio.currentTime + 10, audio.duration); });
        }

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [title, thumbnailUrl, artist]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
        }
    };
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current && duration > 0) {
            audioRef.current.currentTime = (Number(e.target.value) / 100) * duration;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="bg-black/5 rounded-lg p-3 space-y-2 dark:bg-black/50">
            <audio ref={audioRef} src={src} preload="metadata" />
            <div className="flex items-center gap-3">
                 {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                ) : (
                    <div className="w-14 h-14 bg-amber-200 dark:bg-amber-900/50 rounded-md flex items-center justify-center flex-shrink-0">
                        <MusicIcon className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                    </div>
                )}
                <div className="flex-1 w-full overflow-hidden">
                    <h4 className="text-gray-800 dark:text-white font-semibold truncate">{title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{artist || 'Bhakti Sangeet'}</p>
                </div>
                <button onClick={togglePlayPause} className="text-amber-500 dark:text-amber-400 text-4xl flex-shrink-0">
                    <i className={`fas ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
                </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-300 dark:bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #f59e0b ${progress}%, #9ca3af ${progress}%)` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;

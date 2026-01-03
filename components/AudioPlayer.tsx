
import React, { useState, useRef, useEffect } from 'react';
import { MusicIcon } from './icons';

interface AudioPlayerProps {
    src: string;
    title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
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
                artist: 'Ramotsav App',
                album: 'Bhakti Sangeet',
                artwork: [{ src: 'https://i.pinimg.com/564x/c2/39/c0/c239c0540a1586a111a43a755601931a.jpg', sizes: '512x512', type: 'image/jpeg' }]
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
    }, [title]);

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
        <div className="bg-black/50 rounded-lg p-4 space-y-3">
            <audio ref={audioRef} src={src} preload="metadata" />
            <div className="flex items-center gap-4">
                <button onClick={togglePlayPause} className="text-amber-400 text-4xl">
                    <i className={`fas ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
                </button>
                <div className="w-full">
                    <h4 className="text-white font-semibold truncate">{title}</h4>
                    <p className="text-xs text-gray-400">Bhakti Sangeet</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #FFD700 ${progress}%, #666 ${progress}%)` }}
                />
                <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;

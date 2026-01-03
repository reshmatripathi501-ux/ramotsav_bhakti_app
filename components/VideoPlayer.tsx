
import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
    src: string;
    title: string;
    artworkUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, artworkUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isPipSupported, setIsPipSupported] = useState(false);

    let controlsTimeout: number;

    useEffect(() => {
        setIsPipSupported(document.pictureInPictureEnabled);
    }, []);

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = window.setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            if (video.duration > 0) {
                setProgress((video.currentTime / video.duration) * 100);
            }
            setCurrentTime(video.currentTime);
        };
        const setVideoDuration = () => setDuration(video.duration);

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', setVideoDuration);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        
        // Media Session API
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: 'Ramotsav App',
                album: 'Bhakti Videos',
                artwork: [{ src: artworkUrl, sizes: '512x512', type: 'image/jpeg' }]
            });
            navigator.mediaSession.setActionHandler('play', () => video.play());
            navigator.mediaSession.setActionHandler('pause', () => video.pause());
            navigator.mediaSession.setActionHandler('seekbackward', () => { video.currentTime -= 10; });
            navigator.mediaSession.setActionHandler('seekforward', () => { video.currentTime += 10; });
        }

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', setVideoDuration);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
        };
    }, [title, artworkUrl]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
        }
    };
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current && duration > 0) {
            videoRef.current.currentTime = (Number(e.target.value) / 100) * duration;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoRef.current) videoRef.current.volume = newVolume;
    };
    
    const toggleMute = () => {
        if (videoRef.current) {
            const currentlyMuted = !videoRef.current.muted;
            videoRef.current.muted = currentlyMuted;
            setIsMuted(currentlyMuted);
            if (currentlyMuted) setVolume(0);
            else if (volume === 0) setVolume(1); // Unmute to full volume if it was 0
        }
    };

    const skipTime = (time: number) => {
        if (videoRef.current) videoRef.current.currentTime += time;
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const togglePiP = () => {
        if (!isPipSupported) return;
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            videoRef.current?.requestPictureInPicture();
        }
    };

    const sanitizeFilename = (name: string) => name.replace(/[^a-z0-9_.]/gi, '_').toLowerCase();

    const handleShare = async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const file = new File([blob], `${sanitizeFilename(title)}.mp4`, { type: blob.type });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: title,
                    text: `Watch this beautiful video from Ramotsav App: ${title}`,
                    files: [file],
                });
            } else {
                 alert('Sharing files is not supported on this browser.');
            }
        } catch (error) {
            console.error('Error sharing video:', error);
            alert('Could not share the video.');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${sanitizeFilename(title)}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Error downloading video:', error);
            alert('Could not download the video.');
        }
    };


    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div 
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden aspect-video group" 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain"
                onClick={togglePlayPause}
                playsInline
                crossOrigin="anonymous"
            />

            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying && !showControls ? 'opacity-0' : 'opacity-100'}`}>
                 <button onClick={() => skipTime(-10)} className="text-white text-3xl mx-8 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"><i className="fas fa-undo"></i></button>
                <button onClick={togglePlayPause} className="text-white text-5xl p-4 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                 <button onClick={() => skipTime(10)} className="text-white text-3xl mx-8 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"><i className="fas fa-redo"></i></button>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #FFD700 ${progress}%, #666 ${progress}%)` }}
                />
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                        <button onClick={togglePlayPause} className="text-2xl"><i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i></button>
                        <div className="flex items-center gap-2">
                             <button onClick={toggleMute} className="text-xl">
                                <i className={`fas ${isMuted || volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                            </button>
                            <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 h-1" />
                        </div>
                        <span className="text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <button onClick={handleShare} className="text-xl" title="Share"><i className="fas fa-share"></i></button>
                        <button onClick={handleDownload} className="text-xl" title="Download"><i className="fas fa-download"></i></button>
                        {isPipSupported && <button onClick={togglePiP} className="text-xl" title="Picture-in-Picture"><i className="far fa-window-restore"></i></button>}
                        <button onClick={toggleFullScreen} className="text-xl" title="Fullscreen"><i className="fas fa-expand"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;

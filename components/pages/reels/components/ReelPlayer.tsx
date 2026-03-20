import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ReelPlayerProps {
    videoUrl: string;
    isActive: boolean;
    isPaused?: boolean;
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({ videoUrl, isActive, isPaused = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive && !isPaused) {
            video.play().catch((err) => console.log('Autoplay blocked:', err));
            setIsPlaying(true);
        } else {
            video.pause();
            if (!isActive) video.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isActive, isPaused]);

    const handleVideoClick = () => {
        if (videoRef.current) {
            // If it's the first interaction, we might want to unmute
            if (isMuted) {
                setIsMuted(false);
            } else {
                // Otherwise toggle play/pause
                if (isPlaying) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                } else {
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            }
        }
    };

    return (
        <Box
            onClick={handleVideoClick}
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                // bgcolor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
            }}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                loop
                muted={isMuted}
                autoPlay={isActive}
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />

            {!isPlaying && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    <PlayArrowIcon sx={{ fontSize: 80 }} />
                </Box>
            )}
        </Box>
    );
};

export default ReelPlayer;

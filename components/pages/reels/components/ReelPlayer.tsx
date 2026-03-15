import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ReelPlayerProps {
    videoUrl: string;
    isActive: boolean;
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({ videoUrl, isActive }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isActive) {
                videoRef.current.play().catch((err) => console.log('Autoplay blocked:', err));
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [isActive]);

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

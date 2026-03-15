"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { postServices } from '../../../services/post/postServices';
import { Posts } from '../../../services/post/postInterfaces';
import ReelContainer from './components/ReelContainer';
import { useGetReels } from '@/hooks/usePosts';

function ReelsView() {
    const { data, isLoading: loading } = useGetReels();
    const reels = data?.posts || [];
    const [activeReelId, setActiveReelId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (reels.length > 0 && !activeReelId) {
            setActiveReelId(reels[0].id);
        }
    }, [reels, activeReelId]);

    useEffect(() => {
        const observerOptions = {
            root: containerRef.current,
            threshold: 0.8, // Reel is considered active when 80% visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveReelId(entry.target.getAttribute('data-id'));
                }
            });
        }, observerOptions);

        const reelElements = containerRef.current?.querySelectorAll('.reel-wrapper');
        reelElements?.forEach((el) => observer.observe(el));

        return () => {
            reelElements?.forEach((el) => observer.unobserve(el));
        };
    }, [reels]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'black' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    if (reels.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'black', color: 'white' }}>
                <Typography variant="h6">No reels found</Typography>
            </Box>
        );
    }

    return (
        <Box
            ref={containerRef}
            sx={{
                height: '100vh',
                overflowY: 'scroll',
                scrollSnapType: 'y mandatory',
                // bgcolor: 'black',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
            }}
        >
            {reels.map((reel) => (
                <Box key={reel.id} className="reel-wrapper" data-id={reel.id}>
                    <ReelContainer reel={reel} isActive={activeReelId === reel.id} />
                </Box>
            ))}
        </Box>
    );
}

export default ReelsView;

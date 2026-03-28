"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { postServices } from '../../../services/post/postServices';
import { Posts } from '../../../services/post/postInterfaces';
import ReelContainer from './components/ReelContainer';
import { useGetReels } from '@/hooks/usePosts';
import { COLORS } from '@/constants/colors';
import Nav from '@/components/common/Nav';
import ProfileDrawer from '@/components/common/ProfileDrawer';
import LoginModal from '@/components/common/LoginModal';

function ReelsView() {
    const { data, isLoading: loading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetReels();
    const reels = data?.pages.flatMap((page) => page.posts) || [];
    const [activeReelId, setActiveReelId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // Compute active index for preload hints
    const activeIndex = reels.findIndex((r) => r.id === activeReelId);

    const getPreloadHint = useCallback(
        (index: number): 'auto' | 'metadata' | 'none' => {
            if (index === activeIndex) return 'auto';
            if (Math.abs(index - activeIndex) === 1) return 'metadata';
            return 'none';
        },
        [activeIndex],
    );

    // Set first reel as active on initial load
    useEffect(() => {
        if (reels.length > 0 && !activeReelId) {
            setActiveReelId(reels[0].id);
        }
    }, [reels, activeReelId]);

    // Intersection observer for active reel detection
    useEffect(() => {
        const observerOptions = {
            root: containerRef.current,
            threshold: 0.8,
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

    // Infinite scroll sentinel observer (properly managed)
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const loadingView = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    const noReelsView = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
                <Typography variant="h6">No reels found</Typography>
            </Box>
        );
    }

    const mainView = () => {
        return (
        <Box
            ref={containerRef}
            sx={{
                height: { xs: 'calc(100vh - 70px - 60px)', sm: 'calc(100vh - 64px - 60px)', md: 'calc(100vh - 72px)' },
                overflowY: 'scroll',
                scrollSnapType: 'y mandatory',
                scrollBehavior: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
            }}
        >
            {reels.map((reel, index) => (
                <Box
                    key={reel.id}
                    className="reel-wrapper"
                    data-id={reel.id}
                    sx={{
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        height: { xs: 'calc(100vh - 70px - 60px)', sm: 'calc(100vh - 64px - 60px)', md: 'calc(100vh - 72px)' },
                        flexShrink: 0,
                    }}
                >
                    <ReelContainer
                        reel={reel}
                        isActive={activeReelId === reel.id}
                        preloadHint={getPreloadHint(index)}
                    />
                </Box>
            ))}
            {hasNextPage && (
                <Box 
                  ref={sentinelRef}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    scrollSnapAlign: 'start' 
                  }}
                >
                    <CircularProgress color="inherit" />
                </Box>
            )}
        </Box>
    );
}   

    return(
        <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
        }}
      >
        <Nav />

        {/* Main content wrapper - grows to fill available space */}
        <Box
          component="main"
          sx={{
            flex: 1,
            mx: "auto",
            width: "100%",
            mt: { xs: 7, sm: 8, md: 9, lg: 8 },
            backgroundColor:
              theme.palette.mode === "dark"
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
          }}
        >
            {loading ? loadingView() : reels.length === 0 ? noReelsView() : mainView()}
          {/* <AIBotton setOpen={setOpen} /> */}
        </Box>
        <ProfileDrawer />
        {/* <Ai open={open} onClose={() => setOpen(false)} /> */}
      </Box>
      <LoginModal />
    </>
    )
}

export default ReelsView;

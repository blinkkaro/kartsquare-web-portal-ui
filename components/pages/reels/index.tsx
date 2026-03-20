"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
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
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

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

    const loadingView = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'black' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    const noReelsView = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'black', color: 'white' }}>
                <Typography variant="h6">No reels found</Typography>
            </Box>
        );
    }

    const mainView = () => {
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
            {hasNextPage && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    p: 4, 
                    scrollSnapAlign: 'start' 
                  }}
                  ref={(el: HTMLDivElement | null) => {
                    if (el && hasNextPage && !isFetchingNextPage) {
                        const observer = new IntersectionObserver((entries) => {
                            if (entries[0].isIntersecting) {
                                fetchNextPage();
                            }
                        });
                        observer.observe(el);
                    }
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
          // Responsive padding
          px: { xs: 0, sm: 1.5, md: 3, lg: 4, xl: 5 },
          pt: { xs: 0, md: 0 },
          // pb: { xs: 4, md: 6 },
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          // more breathing room at bottom on mobile
        }}
      >
        <Nav />

        {/* Main content wrapper - grows to fill available space */}
        <Box
          component="main"
          sx={{
            flex: 1,
            // maxWidth: { lg: "1500px", xl: "2000px" },
            mx: "auto",
            width: "100%",
            px: { xs: 1, md: 0, lg: 0, xl: 0 },
            mt: { xs: 9, sm: 10, md: 9, lg: 10 },
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

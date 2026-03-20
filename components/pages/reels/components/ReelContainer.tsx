import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ReelPlayer from './ReelPlayer';
import ReelActions from './ReelActions';
import ReelOverlay from './ReelOverlay';
import ReelComments from './ReelComments';
import { Posts } from '../../../../services/post/postInterfaces';
import { useFollowProvider } from '@/hooks/useProviderProfile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openDrawer } from '@/features/ui/profileDrawerSlice';
import { selectCurrentUser } from '@/features/ui/authSlice';
import { AppUserType } from '@/services/auth/auth.interface';
import { getMediaUrls } from '@/helper/helper';


interface ReelContainerProps {
    reel: Posts;
    isActive: boolean;
}

const ReelContainer: React.FC<ReelContainerProps> = ({ reel, isActive }) => {
    const urls = getMediaUrls(reel.media_urls);
    const videoUrl = urls.length > 1 ? urls[1] : urls[0];
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const followMutation = useFollowProvider(reel.user.id);
    // Pause the reel automatically when the profile drawer opens
    const isDrawerOpen = useAppSelector((state: any) => state.profileDrawer.isOpen);

    const isOwnReel = currentUser?.id === reel.user.id;

    const handleFollow = () => {
        followMutation.mutate(reel.is_following ?? false);
    };

    const handleProfileClick = () => {
        
        dispatch(openDrawer({
            userId: reel.user.id,
            role: reel.user.role as AppUserType || AppUserType.SERVICE_PROVIDER,
            username: reel.user.username || ''
        }));
    };

    return (
        <Box
            sx={{
                height: '92vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // bgcolor: 'black',
                scrollSnapAlign: 'start',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isDesktop ? 'row' : 'column',
                    height: isDesktop ? 'calc(100% - 40px)' : 'calc(100% - 80px)',
                    mb: isDesktop ? 0 : 8,
                    width: 'auto',
                    maxWidth: '100%',
                    position: 'relative',
                    // bgcolor: isDesktop ? '#1a1a1a' : 'black',
                    borderRadius: isDesktop ? 2 : 0,
                    overflow: 'hidden',
                }}
            >
                {/* Video Area */}
                <Box
                    sx={{
                        position: 'relative',
                        aspectRatio: '9/16',
                        height: '100%',
                        // bgcolor: 'black',
                    }}
                >
                    <ReelPlayer videoUrl={videoUrl} isActive={isActive} isPaused={isDrawerOpen} />
                    
                    <ReelOverlay
                        userName={reel.user.business_name || `${reel.user.first_name} ${reel.user.last_name}`}
                        profilePic={reel.user.profile_pic}
                        caption={reel.caption}
                        isFollowing={reel.is_following}
                        onFollow={handleFollow}
                        onProfileClick={handleProfileClick}
                        isOwnReel={isOwnReel}
                    />

                    {/* Actions Overlay for Mobile/Video Side */}
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 8,
                            bottom: 100,
                            zIndex: 3,
                        }}
                    >
                        <ReelActions
                            postId={reel.id}
                            likesCount={reel.likes_count}
                            commentsCount={reel.comments_count}
                            isLiked={reel.is_liked}
                            onCommentClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        />
                    </Box>
                </Box>

                {/* Side Comments for Desktop */}
                {isDesktop && (
                    <Box
                        sx={{
                            width: isCommentsOpen ? 350 : 0,
                            transition: 'width 0.3s ease',
                            overflow: 'hidden',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <ReelComments
                            post={reel}
                            open={isCommentsOpen}
                            onClose={() => setIsCommentsOpen(false)}
                        />
                    </Box>
                )}
            </Box>

            {/* Bottom Comments for Mobile */}
            {!isDesktop && (
                <ReelComments
                    post={reel}
                    open={isCommentsOpen}
                    onClose={() => setIsCommentsOpen(false)}
                />
            )}
        </Box>
    );
};

export default ReelContainer;

import React from 'react';
import { Box, Typography, Avatar, Stack, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface ReelOverlayProps {
    userName: string;
    profilePic: string | null;
    caption: string | null;
    // musicName?: string;
    onFollow?: () => void;
    isFollowing?: boolean;
    onProfileClick?: () => void;
    isOwnReel?: boolean;
}

const ReelOverlay: React.FC<ReelOverlayProps> = ({
    userName,
    profilePic,
    caption,
    // musicName = 'Original Audio',
    onFollow,
    isFollowing,
    onProfileClick,
    isOwnReel,
}) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                pt: 10,
                pb: 4,
                px: 2,
                color: 'white',
                zIndex: 2,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <Box onClick={onProfileClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                    <Avatar src={profilePic || ''} sx={{ width: 36, height: 36, border: '1px solid white' }} />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
                        {userName}
                    </Typography>
                </Box>
                {!isOwnReel && (
                    <Button
                        variant={isFollowing ? "contained" : "outlined"}
                        size="small"
                        onClick={onFollow}
                        sx={{
                            color: 'white',
                            borderColor: 'white',
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 2,
                            height: '28px',
                            fontWeight: 'bold',
                            bgcolor: isFollowing ? 'rgba(255,255,255,0.2)' : 'transparent',
                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                )}
            </Stack>

            {caption && (
                <Typography
                    variant="body2"
                    sx={{
                        mb: 1.5,
                        textShadow: '0px 1px 2px rgba(0,0,0,0.8)',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {caption}
                </Typography>
            )}
        </Box>
    );
};

export default ReelOverlay;

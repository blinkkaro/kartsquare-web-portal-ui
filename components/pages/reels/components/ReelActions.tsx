import React, { useState } from 'react';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { postServices } from '../../../../services/post/postServices';

interface ReelActionsProps {
    postId: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    onCommentClick: () => void;
}

const ReelActions: React.FC<ReelActionsProps> = ({
    postId,
    likesCount,
    commentsCount,
    isLiked: initialIsLiked,
    onCommentClick,
}) => {
    const [liked, setLiked] = useState(initialIsLiked);
    const [count, setCount] = useState(likesCount);

    const handleLike = async () => {
        try {
            await postServices.likePost(postId);
            setLiked(!liked);
            setCount(liked ? count - 1 : count + 1);
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    return (
        <Stack spacing={2} alignItems="center">
            <Box textAlign="center">
                    <IconButton onClick={handleLike} sx={{ color: liked ? 'red' : 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}>
                        {liked ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                    </IconButton>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
                        {count}
                    </Typography>
            </Box>

            <Box textAlign="center">
                <IconButton onClick={onCommentClick} sx={{ color: 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}>
                    <ChatBubbleOutlineIcon fontSize="large" />
                </IconButton>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
                    {commentsCount}
                </Typography>
            </Box>

            {/* <IconButton sx={{ color: 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}>
                <SendIcon fontSize="large" />
            </IconButton>

            <IconButton sx={{ color: 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}>
                <BookmarkBorderIcon fontSize="large" />
            </IconButton> */}
        </Stack>
    );
};

export default ReelActions;

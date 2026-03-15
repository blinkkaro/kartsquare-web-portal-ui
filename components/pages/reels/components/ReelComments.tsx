import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Stack,
    TextField,
    IconButton,
    Divider,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Drawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { postServices } from '../../../../services/post/postServices';
import { Comment } from '../../../../services/post/postInterfaces';

interface ReelCommentsProps {
    postId: string;
    open: boolean;
    onClose: () => void;
}

const ReelComments: React.FC<ReelCommentsProps> = ({ postId, open, onClose }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (open) {
            fetchComments();
        }
    }, [open, postId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await postServices.getPostComments(postId);
            setComments(data.comments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await postServices.addPostComments(postId, newComment);
            setNewComment('');
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const content = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Comments</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : comments.length > 0 ? (
                    <Stack spacing={2}>
                        {comments.map((comment) => (
                            <Stack key={comment.id} direction="row" spacing={1.5}>
                                <Avatar src={comment.user_profile_pic || ''} sx={{ width: 32, height: 32 }}>
                                    {comment.user_first_name[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">
                                        {comment.user_first_name} {comment.user_last_name}
                                    </Typography>
                                    <Typography variant="body2">{comment.comment}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                        No comments yet.
                    </Typography>
                )}
            </Box>

            <Divider />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <IconButton color="primary" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
                }}
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Box
            sx={{
                width: 350,
                height: '100%',
                display: open ? 'block' : 'none',
                borderLeft: '1px solid',
                borderColor: 'divider',
            }}
        >
            {content}
        </Box>
    );
};

export default ReelComments;

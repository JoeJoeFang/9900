import React, { useState } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import { List, ListItem, ListItemText, Container, Paper } from '@mui/material';
import { Typography } from '@mui/material';




export function CommentForm({ addComment, cancelForm }) {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        addComment(comment);
        setComment(''); // Clear the input after submission
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                multiline
                fullWidth
                variant="outlined"
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button fullWidth variant="contained" color="primary" type="submit">
                        Post Comment
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button fullWidth
                            variant="outlined"
                            onClick={cancelForm}
                            sx={{
                                color: '#9098e4', // 文字颜色
                                '&:hover': {
                                    backgroundColor: 'white', // 悬浮时背景色
                                    borderColor: '#9098e4', // 悬浮时边框颜色
                                },
                                border: '2px solid #9098e4', // 默认边框颜色
                            }}
                        >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
export function CommentList({ comments }) {
    return (
        <Paper style={{ maxHeight: 400, overflow: 'auto', border: '2px solid #9098e4', marginTop: '16px', padding: '8px' }}>
            <List>
                {comments.slice(0, 6).map((comment, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        <ListItemText primary={comment} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

function ReviewsPage() {
    const [comments, setComments] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const addComment = (comment) => {
        setComments([...comments, comment]);
    };

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom align="left">
                Discussion Board
            </Typography>
            {showForm ? (
                <CommentForm addComment={addComment} cancelForm={() => setShowForm(false)} />
            ) : (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowForm(true)}
                    sx={{
                        color: '#9098e4', // 文字颜色
                        '&:hover': {
                            backgroundColor: 'white', // 悬浮时背景色
                            borderColor: '#9098e4', // 悬浮时边框颜色
                        },
                        border: '2px solid #9098e4', // 默认边框颜色
                    }}
                >
                    Join Discussion
                </Button>

            )}
            <CommentList comments={comments} />
        </Container>
    );
}

export default ReviewsPage;


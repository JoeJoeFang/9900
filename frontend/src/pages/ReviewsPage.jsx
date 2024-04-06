import React, {useCallback, useEffect, useState} from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import { List, ListItem, ListItemText, Container, Paper } from '@mui/material';
import { Typography } from '@mui/material';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';





export function CommentForm({ cancelForm, fetchComments }) {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        // Extracting event ID from the URL
        const url = window.location.pathname; // e.g., /all-event/1
        const eventId = url.substring(url.lastIndexOf('/') + 1);

        // Getting the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // You can now use these variables (eventId and currentDate) along with the comment
        const data = {
            review: comment,
            Date: currentDate,
            eventId: eventId,
            userId: userId,

        };

        // Assuming addComment is now prepared to handle this data structure
        try {
            const response = await axios.put('http://localhost:5005/comments/customer', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                console.log('post comments successfully!');
                setComment('');
                fetchComments();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('Invalid input: Event title already exists!');
                    console.log(error.response.data.message);
                } else if (error.response.status === 403) {
                    alert('Invalid Token: ' + error.response.data.message);
                }
            }
        }
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
                                    backgroundColor: 'white',
                                    borderColor: '#9098e4',
                                },
                                border: '2px solid #9098e4',
                            }}
                        >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}


function ReviewsPage() {
    const [showForm, setShowForm] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const customerId = localStorage.getItem('userId');
    const url = window.location.pathname; // e.g., /all-event/1
    const eventId = url.substring(url.lastIndexOf('/') + 1);
    const token = localStorage.getItem('token');

    const [comments, setComments] = useState([]);
    const fetchComments = useCallback(async () => {
        try {
            // 定义请求配置对象，包括请求头
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get(`http://localhost:5005/comments/${eventId}`, config);
            if (response.status === 200 || response.status === 201) {
                console.log(response.data);
                const loadedComments = Object.values(response.data).map(commentArray => ({
                    date: commentArray[0],
                    text: commentArray[1]
                }));
                console.log("loadedComments", loadedComments);
                setComments(loadedComments);
            }

        } catch (error) {
            console.error("There was an error fetching the events:", error);
        }
    }, [eventId, token, comments]);

    useEffect(() => {
        fetchComments().then(r => console.log("event comments fetching successfully"));
    }, [eventId]);

    const handleJoinDiscussion = async () => {
        try {
            const response = await axios.post('http://localhost:5005/comments/customer', { customerId: customerId, eventId: eventId });

            console.log(response);
            if (response.status === 201) {
                setShowForm(true);
            } else {
                throw new Error('Unexpected response code');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setOpenDialog(true); // 显示警告对话框
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom align="left">
                Discussion Board
            </Typography>
            {showForm ? (
                <CommentForm cancelForm={() => setShowForm(false)}
                             fetchComments={fetchComments}
                />
            ) : (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleJoinDiscussion}
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
            <Paper style={{ maxHeight: 400, overflow: 'auto', border: '2px solid #9098e4', marginTop: '16px', padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }}>
                <List>
                    {comments.map((comment, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="p" style={{ fontWeight: 'bold' }}>
                                            {comment.text}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography component="span" variant="body2" color="text.secondary">
                                            {comment.date}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Cannot Join Discussion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You did not order this event!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ReviewsPage;


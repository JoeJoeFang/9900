import React, {useCallback, useEffect, useState} from 'react';
import {TextField, Button, Box, Grid, Alert, Snackbar} from '@mui/material';
import { List, ListItem, ListItemText, Container, Paper } from '@mui/material';
import { Typography } from '@mui/material';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';
import { Avatar } from '@mui/material';


function ReviewsHostPage() {
    const [openDialog, setOpenDialog] = useState(false);
    const hostId = localStorage.getItem('userId');
    const url = window.location.pathname; // e.g., /all-event/1
    const eventId = url.substring(url.lastIndexOf('/') + 1);
    const token = localStorage.getItem('token');
    const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
    const [currentCommentIndex, setCurrentCommentIndex] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [currentCommentName, setCurrentCommentName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const handleReplyClick = (comment) => {
        setCurrentCommentIndex(comment.customerId);
        setCurrentCommentName(comment.name);
        setIsReplyDialogOpen(true);
    };

    const handleCloseReplyDialog = () => {
        setIsReplyDialogOpen(false);
        setReplyText('');
    };



    const [comments, setComments] = useState([]);
    const fetchComments = useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get(`http://localhost:5005/comments/${eventId}`, config);
            if (response.status === 200 || response.status === 201) {
                console.log(response.data);
                const loadedComments = Object.entries(response.data).map(([key, commentArray]) => ({
                    customerId: key,
                    date: commentArray[0],
                    text: commentArray[1],
                    name: commentArray[2],
                    hostReplyDate: commentArray[3],
                    hostReplyText: commentArray[4],
                    hostId: commentArray[5],
                    companyName: commentArray[6]
                }));
                console.log("loadedComments", loadedComments);
                setComments(loadedComments);
            }

        } catch (error) {
            console.error("There was an error fetching the events:", error);
        }
    }, [eventId, token, comments]);

    const handleConfirmReply = async () => {
        const currentDate = new Date().toISOString().split('T')[0];
        try {
            const response = await axios.put('http://localhost:5005/comments/host', { hostId: hostId, eventId: eventId, userId: currentCommentIndex, review: replyText, Date: currentDate});
            console.log(response);
            if (response.status === 201 || response.status === 200) {
                console.log('post comments successfully!');
                setReplyText('');
                setCurrentCommentIndex(null);
                setCurrentCommentName(null);
                console.log("Reply text:", replyText);
                handleCloseReplyDialog();
                await fetchComments();

            } else {
                console.error('Unexpected response code:', response.status);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setOpenDialog(true);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }

    };

    useEffect(() => {
        fetchComments().then(r => console.log("event comments fetching successfully"));
    }, [eventId]);

    const handleJoinDiscussion = async (comment) => {
        try {
            const response = await axios.post('http://localhost:5005/comments/host', { hostId: hostId, eventId: eventId, userId: comment.customerId});

            console.log(response);
            if (response.status === 201 || response.status === 200) {
                handleReplyClick(comment);
            } else {
                console.error('Unexpected response code:', response.status);
            }
        } catch (error) {
            if (error.response) {
                let errorMessage = '';
                switch (error.response.status) {
                    case 400:
                        setOpenDialog(true);
                        errorMessage = 'You did not host this event!';
                        break;
                    case 401:
                        errorMessage = 'You have already replied this comment!';
                        break;
                    case 404:
                        errorMessage = 'You did not order this event!';
                        setOpenDialog(true);
                        break;
                    default:
                        errorMessage = 'An unexpected error occurred';
                        break;
                }
                setSnackbarMessage(errorMessage);
                setSnackbarOpen(true);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Divider sx={{ mb: 2 }} /> {/* sx={{ mb: 2 }} adds margin bottom for spacing */}
            <Typography variant="h4" gutterBottom align="left">
                Discussion Board
            </Typography>
            <Paper style={{ maxHeight: 400, overflow: 'auto', border: '2px solid #9098e4', marginTop: '16px', padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <List>
                    {comments.map((comment, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Avatar>{comment.name.charAt(0)}</Avatar>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" component="p" style={{ fontWeight: 'bold' }}>
                                                    {comment.text}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography component="span" variant="body2" color="text.secondary" style={{ display: 'block' }}>
                                                    {`${comment.name} posted at ${comment.date}`}
                                                </Typography>
                                            }
                                        />
                                        <Grid item>
                                            <Button
                                                sx={{
                                                    color: '#9098e4', // 文字颜色
                                                    '&:hover': {
                                                        backgroundColor: 'white',
                                                        borderColor: '#9098e4',
                                                    },
                                                    border: '2px solid #9098e4',
                                                }}
                                                variant="outlined" color="primary" size="small" onClick={() => handleJoinDiscussion(comment)}>
                                                Reply
                                            </Button>
                                        </Grid>
                                        {/* Check if there's a host reply and display it */}
                                        {comment.hostReplyText && comment.hostReplyText !== 'None' && (
                                            <Box mt={2} pl={4} style={{ borderLeft: '2px solid #9098e4' }}>
                                                <Typography variant="subtitle2" color="text.primary" component="p">
                                                    Reply from {comment.companyName}:
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" component="p" style={{ marginTop: '4px' }}>
                                                    {comment.hostReplyText} <span style={{ fontStyle: 'italic', display: 'block' }}>— {comment.hostReplyDate}</span>
                                                </Typography>
                                            </Box>
                                        )}
                                    </Grid>

                                </Grid>
                            </ListItem>
                            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Cannot Join Discussion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You did not host this event!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isReplyDialogOpen} onClose={handleCloseReplyDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Reply to {currentCommentName}'s Comment
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reply"
                        label="Your Reply"
                        type="text"
                        fullWidth
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReplyDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmReply} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ReviewsHostPage;


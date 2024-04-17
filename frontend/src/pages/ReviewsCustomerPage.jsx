import React, {useCallback, useEffect, useState} from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import { List, ListItem, ListItemText, Container, Paper,
    Alert, Snackbar,} from '@mui/material';
import { Typography } from '@mui/material';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';
import { Avatar } from '@mui/material';





export function CommentForm({ cancelForm, fetchComments, closeForm }) {
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
                closeForm();
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


function ReviewsCustomerPage() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const customerId = localStorage.getItem('userId');
    const url = window.location.pathname; // e.g., /all-event/1
    const eventId = url.substring(url.lastIndexOf('/') + 1);
    const token = localStorage.getItem('token');

    const [comments, setComments] = useState([]);
    const identity = localStorage.getItem('identity');
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

    useEffect(() => {
        fetchComments().then(r => console.log("event comments fetching successfully"));
    }, [eventId]);

    const handleJoinDiscussion = async () => {
        try {
            const response = await axios.post('http://localhost:5005/comments/customer', { customerId: customerId, eventId: eventId });

            console.log(response);
            if (response.status === 201 || response.status === 200) {
                setShowForm(true);
            }
        } catch (error) {
            if (error.response) {
                let errorMessage = '';
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Event does not exist, please fresh your page';
                        break;
                    case 401:
                        errorMessage = 'You already commented this event!';
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




            // if (error.response && error.response.status === 404) {
            //     setOpenDialog(true); // 显示警告对话框
            // } else {
            //     console.error('An unexpected error occurred:', error);
            // }
        }
    };

    const renderFormOrButton = identity && (showForm ? (
        <CommentForm
            cancelForm={() => setShowForm(false)}
            fetchComments={fetchComments}
            closeForm={() => setShowForm(false)}
        />
    ) : (
        <Button
            fullWidth
            variant="outlined"
            onClick={handleJoinDiscussion}
            sx={{
                color: '#9098e4',
                '&:hover': {
                    backgroundColor: 'white',
                    borderColor: '#9098e4',
                },
                border: '2px solid #9098e4',
            }}
        >
            Join Discussion
        </Button>
    ));

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Divider sx={{ mb: 2 }} /> {/* sx={{ mb: 2 }} adds margin bottom for spacing */}
            <Typography variant="h4" gutterBottom align="left">
                Discussion Board
            </Typography>
            {renderFormOrButton}
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

export default ReviewsCustomerPage;


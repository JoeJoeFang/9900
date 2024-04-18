import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    CircularProgress,
    Box,
    ThemeProvider,
    useTheme,
    Alert, Snackbar, Link, Grid, Divider
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {useNavigate} from "react-router-dom";
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import {SentimentVeryDissatisfied} from "@mui/icons-material";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Paper
} from '@mui/material';



const BookingList = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const listRef = useRef(null);

    const handleScroll = () => {
        const scrollTop = listRef.current?.scrollTop;
        const itemHeight = 300;
        setCurrentIndex(Math.floor(scrollTop / itemHeight));
    };
    const [hoveredId, setHoveredId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const theme = useTheme();
    console.log('fetch.....');
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recommendedEvents, setRecommendedEvents] = useState([]);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);


    const handleOpenConfirmDialog = (eventId, eventDate, eventSeat) => {
        console.log("handleOpenConfirmDialog clicked");
        setSelectedDate(eventDate);
        setSelectedEventId(eventId);
        setSelectedSeat(eventSeat);
        setOpenConfirmDialog(true);
    };


    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const fetchEvents = async () => {
        const userId = localStorage.getItem('userId');
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5005/bookings/${userId}`);
            if (response.status === 200 || response.status === 201) {
                console.log(response.data);
                setEvents(response.data);
            }
        } catch (error) {
            console.error("There was an error fetching the events:", error);
            if (error.response && error.response.status === 404) {
                setError("You haven't booked your tickets yet");
            } else {
                setError("Failed to load events. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }

    };
    const fetchRecommendedEvents = async () => {
        const userId = localStorage.getItem('userId');
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5005/bookings/${userId}/recommendation`);
            setIsLoading(false);
            if (response.status === 200) {
                console.log("Recommended events:", response.data);
                setRecommendedEvents(response.data);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching recommended events:", error);
            setError("Failed to load recommended events. Please try again later.");
        }
    };


    useEffect(() => {
        fetchEvents().then(r => console.log("fetching tickets successfully"));
        fetchRecommendedEvents().then(r => console.log("recommand event successfully"));
    }, []);



    const handleCancelBooking = async () => {
        if (selectedEventId) {
            console.log("Cancel booking for event ID:", selectedEventId);
            console.log("Cancel booking for event Date:", selectedDate);
            setOpenConfirmDialog(false);

            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const requestBody = {
                userId: userId,
                seat: selectedSeat,
                Date: selectedDate,
                eventId: selectedEventId,
                // email : email,
            };
            console.log('requestBody', requestBody);
            try {
                const response = await axios.put(`http://localhost:5005/bookings/cancel/${userId}`, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200 || response.status === 201) {
                    console.log('cancel successfully!');
                    setSelectedEventId(null);
                    setSelectedDate(null);
                    setOpenConfirmDialog(false);
                    await fetchEvents();
                }
            } catch (error) {
                if (error.response) {
                    let errorMessage = '';
                    switch (error.response.status) {
                        case 400:
                            errorMessage = 'Event does not exist, please fresh your page';
                            break;
                        case 402:
                            errorMessage = 'Seats have been booked!';
                            break;
                        case 404:
                            errorMessage = 'Event does not exist, please refresh your page';
                            break;
                        default:
                            errorMessage = 'An unexpected error occurred';
                            break;
                    }
                    setSnackbarMessage(errorMessage);
                    setSnackbarOpen(true);
                }
            }
        }
    };

    const canCancelEvent = (startDate) => {
        const eventDate = new Date(startDate);
        const today = new Date();
        const difference = (eventDate - today) / (1000 * 3600 * 24);
        return difference > 7;
    };

    const settings = {
        className: "center",
        centerMode: true,
        infinite: recommendedEvents.length > 1,
        centerPadding: "60px",
        slidesToShow: recommendedEvents.length > 1 ? 2 : 1,
        slidesToScroll: 1,
        speed: 500,
        dots: recommendedEvents.length > 1
    };

    const navigate = useNavigate();
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                p: theme.spacing(2),
            }}>
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
                    <Navbar></Navbar>
                </Box>
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginTop={20}>
                        <ErrorIcon color="error" style={{ fontSize: 40, marginBottom: 8 }} />
                        <Typography variant="h6" color="error" align="center">
                            {error}
                        </Typography>
                    </Box>
                ) : events.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '100px',
                        width: '90%',
                        overflowY: 'auto',
                        padding: theme.spacing(1),
                    }}>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            mb: theme.spacing(3),
                            gap: theme.spacing(2),
                            color: 'rgba(255, 255, 255, 0.7)',
                            '& img': {
                                opacity: 0.9,
                            }
                        }}>
                            <img src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} alt="Logo" style={{ width: 80, height: 'auto' }} />
                            <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
                                Your Booked Events
                            </Typography>
                        </Box>
                        {/*<Divider sx={{ width: '100%', mb: 2 }}>*/}
                        {/*    <Typography color="textSecondary">start</Typography>*/}
                        {/*</Divider>*/}


                        <Paper sx={{ maxHeight: 600, overflow: 'auto', width: '90%', boxShadow: 3, background: 'rgba(255, 255, 255, 0.4)' }} onScroll={handleScroll} ref={listRef}>
                            <Typography variant="h6" sx={{ p: 2, textAlign: 'center', color:'rgba(0, 0, 0, 0.5)' }}>
                                Viewing {currentIndex + 1} of {events.length} tickets
                            </Typography>
                            <List>
                                {events.map((event, index, array) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.6)',
                                                transition: 'background-color 0.3s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)'
                                                },
                                                pt: 2,
                                                pb: 2,
                                                pl: 2,
                                                pr: 1,
                                            }}
                                            alignItems="flex-start"
                                        >
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={5}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={event.thumbnail && event.thumbnail.trim() ? event.thumbnail.trim() : `${process.env.PUBLIC_URL}/cute_cat.jpeg`}
                                                            alt="Event thumbnail"
                                                            sx={{ width: 240, height: 240 }}
                                                        />
                                                    </ListItemAvatar>
                                                </Grid>
                                                <Grid item xs={12} sm={7}>
                                                    <ListItemText
                                                        primary={event.eventtitle}
                                                        primaryTypographyProps={{
                                                            variant: "h6",
                                                            sx: {
                                                                mb: 2
                                                            }
                                                        }}
                                                        secondary={
                                                            <Typography component="span" variant="body2" color="text.primary" sx={{ mt: 2 }}>
                                                                Event ID: {event.eventId}<br />
                                                                {/*Your booked Seats: {event.seat.join(", ")}<br />*/}
                                                                Your booked Seats: {event.seat}<br />
                                                                Your Booked Date: {event.date}<br />
                                                                Description: {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}
                                                            </Typography>
                                                        }
                                                    />
                                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                backgroundColor: '#9198e5', // 自定义背景颜色
                                                                color: 'white', // 文字颜色
                                                                '&:hover': {
                                                                    backgroundColor: '#556cd6', // 悬停时的背景颜色
                                                                }
                                                            }}
                                                            onClick={() => navigate(`/all-event/${event.eventId}`)}
                                                        >
                                                            View Details
                                                        </Button>
                                                        {canCancelEvent(event.date) ? (
                                                            <Button variant="contained" color="primary"  onClick={() => handleOpenConfirmDialog(event.eventId, event.date, event.seat)}>
                                                                Cancel Event
                                                            </Button>
                                                        ) : (
                                                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                                                                Tickets within 7 days cannot be cancelled.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        {index !== array.length - 1 && <Divider variant="fullWidth" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>




                        {/*<Divider sx={{ width: '100%', mb: 2 }}>*/}
                        {/*    <Typography color="textSecondary">end</Typography>*/}
                        {/*</Divider>*/}
                    </div>
                ) : (
                    <Typography variant="subtitle1">No events found.</Typography>
                )}

                <Divider variant="middle" sx={{ my: 4 }} />

                <Divider sx={{ width: '90%', mb: 2 }}>
                    <Typography color="textSecondary">
                        Your Recommended Events
                    </Typography>
                </Divider>

                {recommendedEvents.length === 0 && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '30vh', // Ensures the empty state has significant screen presence
                        color: theme.palette.text.secondary
                    }}>
                        <SentimentVeryDissatisfied sx={{ fontSize: 60, color: 'action.active' }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Sorry, we don't have any events to recommend right now. 😔
                        </Typography>
                        <Typography variant="body1">
                            Check back later for exciting opportunities!
                        </Typography>
                    </Box>
                )}


                {recommendedEvents.length > 0 && (
                    <Box sx={{ position: 'relative', width: '80%', margin: 'auto' }}>

                        <Slider {...settings}>
                            {recommendedEvents.map((eventsInfo) => (
                                <Grid
                                    item
                                    key={eventsInfo.id}
                                    xs={12} sm={10} md={8} lg={6}
                                    sx={{ position: 'relative', px: 2, py: 2 }}
                                    onMouseEnter={() => setHoveredId(eventsInfo.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <Card raised sx={{
                                        maxWidth: 600,
                                        mx: "auto",
                                        my: theme.spacing(2),
                                        boxShadow: theme.shadows[3],
                                        border: `1px solid ${theme.palette.divider}`,
                                        transition: "opacity 0.3s",
                                        opacity: hoveredId === eventsInfo.id ? 0.3 : 1,
                                    }}>
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image={eventsInfo.thumbnail.trim() ? eventsInfo.thumbnail : `${process.env.PUBLIC_URL}/cute_cat.jpeg`}
                                            alt="event"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {eventsInfo.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                {eventsInfo.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Organizer:</strong> {eventsInfo.organizerName}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Address:</strong> {eventsInfo.address}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Price:</strong> ${eventsInfo.price}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Event Type:</strong> {eventsInfo.eventType}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Seating Capacity:</strong> {eventsInfo.seatingCapacity}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Start Date:</strong> {new Date(eventsInfo.startDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>End Date:</strong> {new Date(eventsInfo.endDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                <strong>Duration:</strong> {eventsInfo.duration} Days
                                            </Typography>
                                            {eventsInfo.youtubeUrl && (
                                                <Typography variant="body2" color="text.primary" sx={{ mt: 2 }}>
                                                    <Link href={eventsInfo.youtubeUrl} target="_blank" rel="noopener">
                                                        Watch Event Trailer
                                                    </Link>
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                    {hoveredId === eventsInfo.id && (
                                        <Button
                                            variant="contained"
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 2
                                            }}
                                            onClick={() => navigate(`/all-event/${eventsInfo.id}`)}
                                        >
                                            View More
                                        </Button>
                                    )}
                                </Grid>
                            ))}
                        </Slider>
                    </Box>
                )}
                <Dialog
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                >
                    <DialogTitle>Confirm Cancellation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to cancel your booking? A confirmation email will be sent along with refund details.</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog}>No</Button>
                        <Button onClick={handleCancelBooking} autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                    <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );

};
export default BookingList;
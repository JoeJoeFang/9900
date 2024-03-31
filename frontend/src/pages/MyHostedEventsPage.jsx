import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, CircularProgress, Box, Link } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import SearchEvents from '../components/SearchEvents';
import { Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from '../components/HeaderLogo';
import Navbar from '../components/Navbar';

const theme = createTheme({
    palette: {
        primary: {
            main: '#e66465',
        },
        secondary: {
            main: '#9198e5',
        },
    },
});

const MyHostedEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    const identity = localStorage.getItem('identity');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const navigate = useNavigate();
    const handleSearch = (searchTerm) => {
        // Implement the logic to filter your events based on the search term
        // For example, you can set the events state to a filtered list of events
        // that match the search term.
        const filteredEvents = events.filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEvents(filteredEvents);
    };
    useEffect(() => {
        if (identity !== 'host') {
            return; // Early return if not a host, no need to fetch events
        }
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5005/events/host/${userId}`);
                setEvents(response.data);
            } catch (error) {
                console.error("There was an error fetching the events:", error);
                setError("Failed to load events. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [identity, userId, setEvents]);

    if (identity !== 'host') {
        // Display an alternative UI if the user is not a host
        return (
            <Container sx={{
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
                <Box sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2, // Provides space between items
                    textAlign: 'center',
                }}>
                    <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main' }} />
                    <Typography variant="h5" gutterBottom>
                        You do not have permission to view this page.
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Please explore other areas of our platform.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/all-event')} sx={{ mt: 2 }}>
                        Go to All Events
                    </Button>
                </Box>
            </Container>
        );
    }

    const handleOpenDialog = (eventId) => {
        setCurrentEventId(eventId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCancelEvent = async () => {
        if (currentEventId) {
            // 使用 selectedEventId 来取消预订
            // const identity = localStorage.getItem('identity');
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const requestBody = {
                userId: userId,
                eventId: currentEventId,
            };
            console.log('requestBody', requestBody);
            try {
                const response = await axios.put(`http://localhost:5005/bookings/cancel_event/${userId}`, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    // listingId
                    console.log('cancel successfully!');
                    console.log("Cancelling event with ID:", currentEventId);
                    setOpenDialog(false);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        alert('Invalid input: ' + error.response.error);
                    } else if (error.response.status === 403) {
                        alert('Invalid Token: ' + error.response.error);
                    }
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



    return (
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
            <Box sx={{ position: 'absolute', top: 10, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}></Box>
            <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex' }}>
                <SearchEvents onSearch={handleSearch} />
                {/* <CreateNewEvent /> */}
                {/* <HostProfile /> */}
                {/* <Logout /> */}
                <Navbar></Navbar>

            </Box>
            <HeaderLogo theme={theme} />
            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : events.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '90%' }}>
                    <Typography variant="h4" gutterBottom>My Hosted Events</Typography>
                    {events.map((event, index) => (
                        <Card
                            key={event.id}
                            sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens, horizontally on larger
                            mb: 2,
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.8)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            ':hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                transform: 'scale(1.03)',
                                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                            },
                        }}>
                            {event.thumbnail && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: { xs: '100%', sm: 240 }, objectFit: 'cover' }}
                                    image={`${process.env.PUBLIC_URL}/cute_cat.jpeg`}
                                    alt={event.title}
                                />
                            )}
                            <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Event ID: {event.id}<br />
                                    Organizer: {event.organizerName}<br />
                                    Type: {event.eventType}<br />
                                    Seats: {event.seatingCapacity}<br />
                                    From: {new Date(event.startDate).toLocaleDateString()}<br />
                                    To: {new Date(event.endDate).toLocaleDateString()}<br />
                                    Address: {event.address}<br />
                                    Price: ${parseFloat(event.price).toFixed(2)}<br />
                                    Description: {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}<br />
                                    {event.youtubeUrl && <Link href={event.youtubeUrl} underline="hover">Event Video</Link>}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                                    <Button variant="contained" color="primary" onClick={() => navigate(`/all-event/${event.id}`)}>
                                        View Details
                                    </Button>
                                    {canCancelEvent(event.startDate) ? (
                                        <Button variant="contained" color="error" onClick={() => handleOpenDialog(event.id)}>
                                            Cancel Event
                                        </Button>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                            Event within 7 days cannot be cancelled.
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            ) : (
                <Typography variant="subtitle1">No events found.</Typography>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Cancel Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this event? Subscribed customers will be notified via email, and all payments will be refunded to their wallets.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>No</Button>
                    <Button onClick={handleCancelEvent} autoFocus>
                        Yes, Cancel Event
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

};

export default MyHostedEventsPage;
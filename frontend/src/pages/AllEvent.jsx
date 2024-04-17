import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ThemeProvider,
    Card,
    CardContent,
    Typography,
    CardMedia,
    CircularProgress,
    Box,
    Divider,
    useTheme
} from '@mui/material';
import SearchEvents from '../components/SearchEvents';
import {useNavigate} from "react-router-dom";
import Navbar from '../components/Navbar';
import Tooltip from "@mui/material/Tooltip";


const EventsList = () => {
    const theme = useTheme();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const identity = localStorage.getItem('identity');
    const handleSearch = (searchTerm) => {
        // Implement the logic to filter your events based on the search term
        // For example, you can set the events state to a filtered list of events
        // that match the search term.
        const filteredEvents = events.filter((event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEvents(filteredEvents);
      };

      const searchCallback = (res) => {
        setEvents(res)
      }
    
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5005/events');
                setEvents(response.data);
            } catch (error) {
                console.error("There was an error fetching the events:", error);
                setError("Failed to load events. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);
    return (
        <ThemeProvider theme={theme}>
        <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                background: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center, center',
                p: theme.spacing(2),
            }}>
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems:'center' }}>
                <Navbar></Navbar>
                </Box>
                {/*<HeaderLogo theme={theme} />*/}

                <SearchEvents onSearch={handleSearch} searchCallback={searchCallback} />
                     {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : events.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '36px', width: '90%' }}>
                        <Divider sx={{ width: '100%', mb: 2 }}>
                            <Typography color="textSecondary">Upcoming Events Within the Next Month</Typography>
                        </Divider>
                        {events.map((event, index) => (
                            // <Tooltip
                            //     key={index}
                            //     title={identity === 'visitor' || !identity ? "Please register your account to explore more" : ''}
                            //     disableHoverListener={identity !== 'visitor' && identity}
                            //     arrow
                            // >
                            //     <div
                            //         style={{
                            //             width: '100%',
                            //             cursor: (identity === 'visitor' || !identity) ? 'not-allowed' : 'pointer',
                            //         }}
                            //     >
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            mb: 2,
                                            width: '100%',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
                                            ':hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                transform: 'scale(1.03)',
                                                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                        // onClick={() => {
                                        //     if(identity !== 'visitor' && identity) navigate(`/all-event/${event.id}`);
                                        // }}
                                        onClick={() => {
                                            navigate(`/all-event/${event.id}`);
                                        }}
                                    >
                                        {event.thumbnail && (
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 240, objectFit: 'cover' }}
                                                image={event.thumbnail.trim() ? event.thumbnail : `${process.env.PUBLIC_URL}/cute_cat.jpeg`}
                                                alt={event.title}
                                            />
                                        )}
                                        <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {event.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Event ID: {event.id}<br />
                                                Organizer: {event.organizerName}<br />
                                                Type: {event.eventType}<br />
                                                Seats: {event.seatingCapacity}<br />
                                                {/*Duration: {event.duration} hours<br />*/}
                                                From: {new Date(event.startDate).toLocaleDateString()}<br />
                                                To: {new Date(event.endDate).toLocaleDateString()}<br />
                                                Address: {event.address}<br />
                                                Price: ${parseFloat(event.price).toFixed(2)}<br />
                                                Description: {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}<br />
                                                {event.youtubeUrl && <a href={event.youtubeUrl}>Event Video</a>}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                            //     </div>
                            // </Tooltip>
                        ))}
                        {/* Divider for the end of events */}
                        <Divider sx={{ width: '100%', mt: 2 }}>
                            <Typography color="textSecondary">End of Events</Typography>
                        </Divider>
                    </div>
                ) : (
                    <Divider sx={{ width: '100%', mt: 2 }}>
                     <Typography color="textSecondary">No events found.</Typography>
                    </Divider>
                )}
            </Box>
            </ThemeProvider>     
    );

};

export default EventsList;
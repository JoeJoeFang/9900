import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, CircularProgress, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import SearchEvents from '../components/SearchEvents';
import HeaderLogo from '../components/HeaderLogo';
import {useNavigate} from "react-router-dom";
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

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems:'center' }}>
                <SearchEvents onSearch={handleSearch} searchCallback={searchCallback} />
                    {/* <AllEvents   />   
                    <CreateNewEvent /> */}
                    {/* <MyBookings /> */}
                    {/* <HostProfile />
                    <Logout /> */}
                    <Navbar></Navbar>
                
                </Box>
                <HeaderLogo theme={theme} />
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : events.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', width: '90%' }}>
                        <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
                        {events.map((event, index) => (
                            <Card
                                key={index}
                                sx={{
                                    display: 'flex',
                                    mb: 2,
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s', // 平滑过渡效果
                                    ':hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)', // 改变背景颜色
                                        transform: 'scale(1.03)', // 轻微放大
                                        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', // 增强阴影效果
                                    },
                                }}
                                onClick={() => navigate(`/all-event/${event.id}`)}
                            >
                                {event.thumbnail && (
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 240, objectFit: 'cover' }}
                                        image={`${process.env.PUBLIC_URL}/cute_cat.jpeg`}
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
                        ))}
                    </div>
                ) : (
                    <Typography variant="subtitle1">No events found.</Typography>
                )}
            </Box>
    );

};

export default EventsList;
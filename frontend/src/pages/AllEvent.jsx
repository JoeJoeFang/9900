import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, CircularProgress, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';

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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Our Amazing Ticket Platform
                </Typography>
            </Box>
            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : events.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
                    {events.map((event, index) => (
                        <Card key={index} sx={{ maxWidth: 345, mb: 2, width: '100%' }}>
                            {event.thumbnail && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={event.thumbnail}
                                    alt={event.title}
                                />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Organizer: {event.organizerName}<br />
                                    Type: {event.eventType}<br />
                                    Seats: {event.seatingCapacity}<br />
                                    Duration: {event.duration} hours<br />
                                    From: {new Date(event.startDate).toLocaleDateString()}<br />
                                    To: {new Date(event.endDate).toLocaleDateString()}<br />
                                    Address: {event.address}<br />
                                    Price: ${parseFloat(event.price).toFixed(2)}<br />
                                    Description: {event.description}<br />
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

// const EventsList = () => {
//     const [events, setEvents] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     console.log("landing all event page");
//
//     useEffect(() => {
//         const fetchEvents = async () => {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get('http://localhost:5000/events');
//                 setEvents(response.data);
//             } catch (error) {
//                 console.error("There was an error fetching the events:", error);
//                 setError("Failed to load events. Please try again later.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//
//         fetchEvents();
//     }, []);
//
//     if (isLoading) {
//         return <CircularProgress />;
//     }
//
//     if (error) {
//         return <Typography color="error">{error}</Typography>;
//     }
//
//     return (
//         <Box sx={{
//             minHeight: '100vh',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             background: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
//             backgroundSize: 'cover, cover',
//             backgroundPosition: 'center, center',
//             p: theme.spacing(2),
//         }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
//                 <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
//                 <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                     Our Amazing Ticket Platform
//                 </Typography>
//             </Box>
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
//                 <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
//                 {events.length > 0 ? (
//                     events.map((event, index) => (
//                         <Card key={index} sx={{ maxWidth: 345, mb: 2, width: '100%' }}>
//                             {event.thumbnail && (
//                                 <CardMedia
//                                     component="img"
//                                     height="140"
//                                     image={event.thumbnail}
//                                     alt={event.title}
//                                 />
//                             )}
//                             <CardContent>
//                                 <Typography gutterBottom variant="h5" component="div">
//                                     {event.title}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                     Organizer: {event.organizerName}<br />
//                                     Type: {event.eventType}<br />
//                                     Seats: {event.seatingCapacity}<br />
//                                     Duration: {event.duration} hours<br />
//                                     From: {new Date(event.startDate).toLocaleDateString()}<br />
//                                     To: {new Date(event.endDate).toLocaleDateString()}<br />
//                                     Address: {event.address}<br />
//                                     Price: ${parseFloat(event.price).toFixed(2)}<br />
//                                     Description: {event.description}<br />
//                                     {event.youtubeUrl && <a href={event.youtubeUrl}>Event Video</a>}
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     ))
//                 ) : (
//                     <Typography variant="subtitle1">No events found.</Typography>
//                 )}
//             </div>
//         </Box>
//     );
// };
//
// export default EventsList;
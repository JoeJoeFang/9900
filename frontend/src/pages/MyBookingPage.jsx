import React, { useEffect, useState } from 'react';
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



const BookingList = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const theme = useTheme();
    console.log('fetch.....');
    // const userId = localStorage.getItem('userId');
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recommendedEvents, setRecommendedEvents] = useState([]);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px", // 可增加此值来增加间隙
        slidesToShow: 2,
        slidesToScroll: 1, // 每次滑动一个卡片
        speed: 500,
        dots: true // 启用底部小圆点指示器
    };


    const handleOpenConfirmDialog = (eventId, eventDate) => {
        console.log("handleOpenConfirmDialog clicked");
        setSelectedDate(eventDate);
        setSelectedEventId(eventId);
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
        setIsLoading(true);// 假设用户ID存储在localStorage中
        try {
            const response = await axios.get(`http://localhost:5005/bookings/${userId}/recommendation`);
            setIsLoading(false);
            if (response.status === 200) {
                console.log("Recommended events:", response.data);
                setRecommendedEvents(response.data); // 更新状态以显示推荐活动
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
            // 使用 selectedEventId 来取消预订
            console.log("Cancel booking for event ID:", selectedEventId);
            console.log("Cancel booking for event Date:", selectedDate);
            // 假设取消成功后的处理逻辑...
            setOpenConfirmDialog(false);

            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const requestBody = {
                userId: userId,
                // seat: selectedSeats,
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
                    setSelectedEventId(null); // 重置选中的事件ID
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
                <Box sx={{ position: 'absolute', top: 10, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}></Box>
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
                    <Navbar></Navbar>
                </Box>
                {/*<HeaderLogo theme={theme} />*/}
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginTop={2}>
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
                        marginTop: '120px',
                        width: '90%',
                        height: '70vh', // 设置固定高度
                        overflowY: 'auto', // 允许垂直滚动
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
                        <Divider sx={{ width: '100%', mb: 2 }}>
                            <Typography color="textSecondary">start</Typography>
                        </Divider>
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
                            >
                                {event.thumbnail && (
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 240, objectFit: 'cover' }}
                                        image={event.thumbnail.trim() ? event.thumbnail : `${process.env.PUBLIC_URL}/cute_cat.jpeg`}
                                        alt={event.eventId} />
                                )}
                                <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {event.eventtitle}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Event ID: {event.eventId}<br />
                                        Your booked Seats: {event.seat.join(", ")}<br />
                                        Your Booked Date: {event.date}<br />
                                        Description: {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}<br />
                                        {/*<Button onClick={(e) => handleNavigateToEventDetail(event.eventId, e)}>View Details</Button>*/}
                                        {/*<Button onClick={() => handleOpenConfirmDialog(event.eventId, event.date)}>Cancel Booking</Button>*/}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                                        <Button variant="contained" color="primary" onClick={() => navigate(`/all-event/${event.eventId}`)}>
                                            View Details
                                        </Button>
                                        {canCancelEvent(event.date) ? (
                                            <Button variant="contained" color="error" onClick={() => handleOpenConfirmDialog(event.eventId, event.date)}>
                                                Cancel Event
                                            </Button>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                                Tickets within 7 days cannot be cancelled.
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                        <Divider sx={{ width: '100%', mb: 2 }}>
                            <Typography color="textSecondary">end</Typography>
                        </Divider>
                    </div>
                ) : (
                    <Typography variant="subtitle1">No events found.</Typography>
                )}

                <Divider variant="middle" sx={{ my: 4 }} />


                {recommendedEvents.length > 0 && (
                    <Box sx={{ position: 'relative', width: '80%', margin: 'auto' }}>
                        <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
                            Your Recommended Events
                        </Typography>
                        <Slider {...settings}>
                            {recommendedEvents.map((eventsInfo, index) => (
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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Card, CardContent, CardMedia, CircularProgress, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Logout from '../components/Logout';
import CreateNewEvent from '../components/CreateNewEvent';
import MyBookings from '../components/MyBookings';
import HostProfile from '../components/HostProfile';
import {useNavigate} from "react-router-dom";
import NativeSelect from '@mui/material/NativeSelect';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Backdrop,
    Container,
    Link,
    Select,
    MenuItem,
} from '@mui/material';
// import { Box, Button, Typography, Grid, Select, MenuItem } from '@mui/material';
import SearchEvents from "../components/SearchEvents";

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



const EventDetails = () => {
    const { eventId } = useParams();
    // const [events, setEvents] = useState([]);
    const [eventsInfo, setEventsInfo] = useState({
        id: 'id',
        title: 'Title',
        address: 'Address',
        price: 0,
        thumbnail: '',
        organizerName: '',
        eventType: 'eventType',
        seatingCapacity: 100,
        duration: 0,
        startDate: '',
        endDate: '',
        description: '',
        youtubeUrl: '',
        orderdetails: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');


    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 定义请求配置对象，包括请求头
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                };
                // 使用配置对象发起请求
                const response = await axios.get(`http://localhost:5005/events/${eventId}`, config);
                if (response.status === 200) {
                    const event = response.data;
                    const startDate = new Date(event.startDate);
                    const endDate = new Date(event.endDate);
                    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
                    setEventsInfo({
                        ...eventsInfo,
                        id: event.id,
                        title: event.title,
                        address: event.address,
                        price: event.price,
                        thumbnail: event.thumbnail,
                        organizerName: event.organizerName,
                        eventType: event.eventType,
                        seatingCapacity: event.seatingCapacity,
                        duration: duration + 1,
                        startDate: event.startDate,
                        endDate: event.endDate,
                        description: event.description,
                        youtubeUrl: event.youtubeUrl,
                        orderdetails: event.orderdetails,
                    });
                    // console.log(event.id);
                    console.log(response.data);
                    console.log("response.data.orderDetails", response.data.orderdetails);
                }

            } catch (error) {
                console.error("There was an error fetching the events:", error);
                setError("Failed to load events. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };


        fetchEvents();
    }, []); // 这里的空数组表示这个effect在组件挂载时仅执行一次
    console.log(eventsInfo);
    // const [selectedDate, setSelectedDate] = useState(Object.keys(eventsInfo.orderdetails)[0]);
    const [selectedDate, setSelectedDate] = useState('');

    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const dates = Object.keys(eventsInfo.orderdetails ?? {});
        if (dates.length > 0 && !dates.includes(selectedDate)) {
            setSelectedDate(dates[0]);
        }
    }, [eventsInfo.orderdetails, selectedDate]);
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedSeats([]);
    };

    const toggleSeatSelection = (seatIndex) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatIndex)
                ? prevSelectedSeats.filter((index) => index !== seatIndex)
                : [...prevSelectedSeats, seatIndex]
        );
    };
    console.log("Object.keys(eventsInfo.orderdetails)[0]", Object.keys(eventsInfo.orderdetails)[0]);
    console.log("selectedDate", selectedDate);
    console.log(
        Object.keys(eventsInfo.orderdetails)
    );

    const submitbooking = async (selectedSeats, selectedDate, eventId) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('userEmail');


        const requestBody = {
            userId: userId,
            seat: selectedSeats,
            Date: selectedDate,
            eventId: eventId,
            email : email,
        };
        console.log('requestBody', requestBody);
        try {
            const response = await axios.put('http://localhost:5005/bookings', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                // listingId
                console.log('booking successfully!');
                navigate(0);
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
    };

    const BookingConfirmationDialog = ({ open, onClose, selectedSeats, selectedDate, eventId, email }) => {
        const identity = localStorage.getItem('identity');
        if (identity === 'host') {
            // 如果是 host，返回一个提示对话框
            return (
                <Dialog open={open} onClose={onClose}>
                    <DialogTitle>Unavailable Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            As a host, you cannot perform ticket booking.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return (
                <Dialog open={open} onClose={onClose}>
                    <DialogTitle>Confirm Booking</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Event ID: {eventId}
                        </DialogContentText>
                        <DialogContentText>
                            Selected Date: {selectedDate}
                        </DialogContentText>
                        <DialogContentText>
                            Selected Seats: {selectedSeats.join(", ")}
                        </DialogContentText>
                        <DialogContentText>
                            Booking Email: {email}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={() => {
                            submitbooking(selectedSeats, selectedDate, eventId, email)
                                .then(() => {
                                    console.log('Booking confirmed:', { eventId, selectedDate, selectedSeats, email });
                                    onClose(); // 关闭对话框
                                })
                                .catch((error) => {
                                    console.error('Failed to confirm booking:', error);
                                    // 可以在这里处理错误，比如显示一个错误消息给用户
                                });
                        }} color="primary">
                            Confirm
                        </Button>

                    </DialogActions>
                </Dialog>
            );
        }
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



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
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex' }}>
                    <CreateNewEvent />
                    <MyBookings />
                    <HostProfile />
                    <Logout />

                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                    <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                    <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Our Amazing Ticket Platform
                    </Typography>
                </Box>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Container maxWidth="md">
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom align="center" color="common.white">
                                Event Details
                            </Typography>
                        </Grid>
                        {error ? (
                            <Typography variant="h6" color="error" align="center">
                                {error}
                            </Typography>
                        ) : (
                            <Grid item xs={12} md={8} lg={6}>
                                <Card raised sx={{ maxWidth: 600, mx: "auto", boxShadow: "5px 5px 15px rgba(0,0,0,0.2)" }}>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={`${process.env.PUBLIC_URL}/cute_cat.jpeg`}
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
                            </Grid>
                        )}
                    </Grid>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6">Select a date:</Typography>
                        <NativeSelect
                            value={selectedDate}
                            onChange={handleDateChange}
                            fullWidth
                        >
                            {Object.keys(eventsInfo.orderdetails ?? {}).map((date) => (
                                <option key={date} value={date}>
                                    {date}
                                </option>
                            ))}
                        </NativeSelect>

                        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                            Select your seats:
                        </Typography>
                        <Grid container spacing={1}>
                            {eventsInfo.orderdetails && selectedDate && eventsInfo.orderdetails[selectedDate] ?
                                eventsInfo.orderdetails[selectedDate].map((seat, index) => (
                                    <Grid item key={index} xs={2} sm={1} md={1}>
                                        <Button
                                            variant={selectedSeats.includes(index) ? "contained" : "outlined"}
                                            sx={{
                                                minWidth: 35,
                                                minHeight: 35,
                                                backgroundColor: selectedSeats.includes(index) ?  "#f76c6c" : "#63fc82", // 绿色为选中，红色为未选中
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: selectedSeats.includes(index) ? "#d32f2f" : "#388e3c", // 深绿色或深红色变体
                                                },
                                            }}
                                            onClick={() => toggleSeatSelection(index)}
                                            disabled={seat[0] === 1} // 如果座位已预订，则禁用点击
                                        >
                                            {index + 1}
                                        </Button>
                                    </Grid>
                                )) : null
                            }
                        </Grid>

                        <Button
                            variant="contained"
                            color="success"
                            sx={{ mt: 2 }}
                            disabled={selectedSeats.length === 0}
                            onClick={handleOpen}
                        >
                            Book Seats
                        </Button>
                        <BookingConfirmationDialog
                            open={open}
                            onClose={handleClose}
                            selectedSeats={selectedSeats}
                            selectedDate={selectedDate}
                            eventId={eventId}
                            email={email}
                        />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};
export default EventDetails;

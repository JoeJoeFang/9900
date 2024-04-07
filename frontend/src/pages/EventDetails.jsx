import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import { createTheme } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import NativeSelect from '@mui/material/NativeSelect';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import HeaderLogo from '../components/HeaderLogo';
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
} from '@mui/material';
import Navbar from '../components/Navbar';
import ReviewsCustomerPage from './ReviewsCustomerPage';
import Tooltip from '@mui/material/Tooltip';
import ReviewsHostPage from "./ReviewsHostPage";


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
    //const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    const identity = localStorage.getItem('identity');


    const fetchEvents = useCallback(async () => {
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
                setEventsInfo(prevEventsInfo => {
                    if (prevEventsInfo.id !== event.id) {
                        return {
                            ...prevEventsInfo,
                            ...event,
                            duration: duration + 1, // 计算持续时间
                        };
                    }
                    return prevEventsInfo;
                });
            }

        } catch (error) {
            console.error("There was an error fetching the events:", error);
            setError("Failed to load events. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [eventId, token]);

    useEffect(() => {
        fetchEvents().then(r => console.log("event details fetching successfully"));
    }, [eventId, token]);


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

    const [alertOpen, setAlertOpen] = useState(false);

    const toggleSeatSelection = (seatIndex) => {
        const identity = localStorage.getItem("identity");
        if (identity === 'host') {
            setOpen(true);
        } else {
            setSelectedSeats((prevSelectedSeats) =>
                prevSelectedSeats.includes(seatIndex)
                    ? prevSelectedSeats.filter((index) => index !== seatIndex)
                    : [...prevSelectedSeats, seatIndex]
            );

        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };


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
                <>
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
                            } } color="primary">
                                Confirm
                            </Button>

                        </DialogActions>
                    </Dialog></>
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
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex',alignItems:'center'}}>
                    <Navbar></Navbar>
                </Box>
                <HeaderLogo theme={theme} />
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Container maxWidth="md">
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom align="center" color="common.black">
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
                                        <Tooltip title={seat[0] === 1 ? "This seat has been booked" : ""}>
                                            <span>
                                                <Button
                                                    variant={selectedSeats.includes(index) ? "contained" : "outlined"}
                                                    sx={{
                                                        minWidth: 35,
                                                        minHeight: 35,
                                                        backgroundColor: selectedSeats.includes(index) ? "#f76c6c" : "#63fc82",
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: selectedSeats.includes(index) ? "#d32f2f" : "#388e3c",
                                                        },
                                                        '&.Mui-disabled': {
                                                            backgroundColor: "#f76c6c",
                                                            color: 'black',
                                                        },
                                                    }}
                                                    onClick={() => toggleSeatSelection(index)}
                                                    disabled={seat[0] === 1}
                                                >
                                                    {index + 1}
                                                </Button>
                                            </span>
                                        </Tooltip>
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
                        <Dialog
                            open={alertOpen}
                            onClose={handleAlertClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Action Not Allowed"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    As a host, you cannot perform ticket booking.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleAlertClose}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Container>
                    {identity === 'host' ? (
                        <ReviewsHostPage />
                    ) : (
                        <ReviewsCustomerPage />
                    )}
            </Box>
        </ThemeProvider>
    );
};
export default EventDetails;

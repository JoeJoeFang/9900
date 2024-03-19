import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { ThemeProvider, createTheme, Container, Box, FormControl, Typography, Card, CardContent, CardActions, Grid, TextField, Button, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    ThemeProvider,
    createTheme,
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    TextField,
    Button,
    IconButton,
} from '@mui/material';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';





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

const CreateNewEvent = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [eventData, setEventData] = useState({
        title: '',
        address: '',
        price: '',
        thumbnail: '',
        eventType: '',
        duration: '',
        seatingCapacity: '',
        youtubeUrl: '',
        startDate: '',
        endDate: '',
        organizerName: '',
        description: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    // const eventTypes = ['concert', 'conference', 'meeting', 'webinar'];


    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                if (!value || value.length < 3 || value.length > 100) {
                    return 'Title must be between 3 and 100 characters.';
                }
                break;
            case 'address':
                if (!value || value.length < 10 || value.length > 200) {
                    return 'Address must be between 10 and 200 characters.';
                }
                break;
            case 'price':
                if (!value || isNaN(value) || value <= 0 || value > 1000000) {
                    return 'Price must be a positive number less than 1,000,000.';
                }
                break;
            case 'seatingCapacity':
                if (!value || isNaN(value) || value <= 0 || value > 10000) {
                    return 'Seating capacity must be a positive number and no more than 10,000.';
                }
                break;
            case 'youtubeUrl':
                if (value && !/^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(value)) {
                    return 'Invalid YouTube URL. URL should be in the format https://www.youtube.com/watch?v=VIDEO_ID';
                }
                break;
            case 'startDate':
            case 'endDate':
                const date = new Date(value.replace(new RegExp('/', 'g'), '-'));
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Remove time part
                if (name === 'startDate' && date < now) {
                    return 'Start date must be today or in the future.';
                }
                if (name === 'endDate') {
                    const startDate = new Date(eventData.startDate.replace(new RegExp('/', 'g'), '-'));
                    if (date <= startDate) {
                        return 'End date must be after the start date.';
                    }
                }
                break;
            default:
                return '';
        }
    };


    const updateField = (e) => {
        const { name, value } = e.target;
        const errorMessage = validateField(name, value);
        setEventData({ ...eventData, [name]: value });
        setFormErrors({ ...formErrors, [name]: errorMessage });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const [jsonUploaded, setJsonUploaded] = useState(false);

    const handleJsonUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    console.log(e);
                    const jsonData = JSON.parse(e.target.result);
                    // Perform your validation here
                    setEventData({ ...eventData, ...jsonData });
                    setJsonUploaded(true); // Set the JSON upload status to true
                } catch (error) {
                    console.log(error);
                    alert('Invalid JSON file');
                    setJsonUploaded(false); // Reset the JSON upload status on error
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
            setJsonUploaded(false); // Reset the JSON upload status on invalid file type
        }
    };
    const handleYoutubeUrlChange = (e) => {
        setEventData({
            ...eventData,
            youtubeUrl: e.target.value,
        });
    };


    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventData({ ...eventData, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const errors = Object.keys(eventData).reduce((acc, key) => {
            const error = validateField(key, eventData[key]);
            if (error) {
                acc[key] = error;
            }
            return acc;
        }, {});

        setFormErrors(errors);

        const token = localStorage.getItem('token');
        const requestBody = {
            title: eventData.title,
            address: eventData.address,
            price: eventData.price,
            thumbnail: eventData.thumbnail, // Thumbnail in base64 format
            eventType: eventData.eventType,
            // duration: eventData.duration,
            seatingCapacity: eventData.seatingCapacity,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
            youtubeUrl: eventData.youtubeUrl,
            organizerName: eventData.organizerName,
            description: eventData.description,

        };
        console.log('requestBody', requestBody);
        try {
            const response = await axios.post('http://localhost:5005/events/new', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                console.log('Created event ID:', response.data.message);
                setOpenDialog(true);
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
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
                    backgroundSize: 'cover, cover',
                    backgroundPosition: 'center, center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <IconButton
                    onClick={handleBack}
                    size="large"
                    sx={{
                        position: 'absolute',
                        left: theme.spacing(2),
                        top: theme.spacing(2),
                        backgroundColor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white',
                        },
                        boxShadow: 3,
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: 28 }} />
                </IconButton>
                <Box sx={{ width: '100%', mb: 4, pt: 4, textAlign: 'center' }}>
                    <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                    <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                        Our Amazing Ticket Platform
                    </Typography>
                </Box>
                <Container maxWidth="md" sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '15px', p: 2, mt: 5 }}>
                    <Card raised sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h5" textAlign="center" gutterBottom>
                                Host Your New Event
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="title"
                                        label="Event Title"
                                        fullWidth
                                        value={eventData.title}
                                        onChange={updateField}
                                        required
                                        error={!!formErrors.title}
                                        helperText={formErrors.title}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="address"
                                        label="Event Address"
                                        fullWidth
                                        value={eventData.address}
                                        onChange={updateField}
                                        required
                                        error={!!formErrors.address}
                                        helperText={formErrors.address}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="price"
                                        label="Ticket Price (per ticket)"
                                        fullWidth
                                        value={eventData.price}
                                        onChange={updateField}
                                        required
                                        type="number"
                                        error={!!formErrors.price}
                                        helperText={formErrors.price}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="organizerName"
                                        label="Organizer Name"
                                        fullWidth
                                        value={eventData.organizerName}
                                        onChange={updateField}
                                        required
                                        error={!!formErrors.organizerName}
                                        helperText={formErrors.organizerName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="event-type-label">Event Type</InputLabel>
                                        <NativeSelect
                                            defaultValue="concert"
                                            onChange={updateField} // 假设这个函数能够正确处理 NativeSelect 的事件
                                            value={eventData.eventType} // 确保这里使用了用于追踪选中值的状态
                                            inputProps={{
                                                name: 'eventType', // 增加 name 属性，以便 updateField 函数可以识别字段
                                            }}
                                        >
                                            <option value="concert">concert</option>
                                            <option value="conference">conference</option>
                                            <option value="meeting">meeting</option>
                                            <option value="webinar">webinar</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="seatingCapacity"
                                        label="Seating Capacity"
                                        fullWidth
                                        value={eventData.seatingCapacity}
                                        onChange={updateField}
                                        required
                                        type="number"
                                        error={!!formErrors.seatingCapacity}
                                        helperText={formErrors.seatingCapacity}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="startDate"
                                        label="Start Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={eventData.startDate}
                                        onChange={updateField}
                                        required
                                        error={!!formErrors.startDate}
                                        helperText={formErrors.startDate}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="endDate"
                                        label="End Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={eventData.endDate}
                                        onChange={updateField}
                                        required
                                        error={!!formErrors.endDate}
                                        helperText={formErrors.endDate}
                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    <TextField
                                        name="description"
                                        label="Event Description"
                                        fullWidth
                                        value={eventData.description}
                                        onChange={updateField}
                                        required
                                        multiline
                                        rows={4}
                                        error={!!formErrors.description}
                                        helperText={formErrors.description}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                    >
                                        Upload Thumbnail
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleThumbnailChange}
                                            accept="image/*"
                                        />
                                    </Button>
                                    {eventData.thumbnail && (
                                        <Box mt={2} textAlign="center">
                                            <img src={eventData.thumbnail} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="youtubeUrl"
                                        label="YouTube Video URL"
                                        fullWidth
                                        value={eventData.youtubeUrl}
                                        onChange={handleYoutubeUrlChange}
                                        error={!!formErrors.youtubeUrl}
                                        helperText={formErrors.youtubeUrl}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                    >
                                        Upload JSON File
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleJsonUpload}
                                            accept="application/json"
                                        />
                                    </Button>
                                    {jsonUploaded && (
                                        <Box mt={2} textAlign="center">
                                            <Typography variant="subtitle1" color="success.main">
                                                JSON File Uploaded Successfully!
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Box width="100%" display="flex" justifyContent="center">
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Submit Event
                                </Button>
                            </Box>
                        </CardActions>
                    </Card>
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Event Created Successfully"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Your event has been created successfully.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                navigate('/all-event'); // 替换为你希望跳转到的路径
                                setOpenDialog(false);
                            }}>Go to Events</Button>
                        </DialogActions>
                    </Dialog>

                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default CreateNewEvent;

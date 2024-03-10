import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Container, Box, FormControl, Typography, Card, CardContent, CardActions, Grid, TextField, Button, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


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
        amenities: '',
        youtubeUrl: '',
        startDate: '',
        endDate: '',
        organizerName: '',
        description: '',
        registrationLink: '',
    });
    // const eventTypes = ["Conference", "Seminar", "Concert", "Workshop"];


    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                if (!value || value.length < 3) {
                    return 'Title must be at least 3 characters.';
                }
                break;
            case 'address':
                if (!value) {
                    return 'Address is required.';
                }
                break;
            case 'price':
                if (value <= 0) {
                    return 'Price must be greater than 0.';
                }
                break;
            case 'eventType':
                if (!value) {
                    return 'Event type is required.';
                }
                break;
            case 'duration':
                if (value <= 0) {
                    return 'Duration must be a positive number.';
                }
                break;
            case 'seatingCapacity':
                if (value <= 0) {
                    return 'Seating capacity must be a positive number.';
                }
                break;
            case 'youtubeUrl':
                if (value && !/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/.test(value)) {
                    return 'Invalid YouTube URL.';
                }
                break;
            case 'startDate':
            case 'endDate':
                if (!value) {
                    return 'This field is required.';
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
                    // Assuming jsonData has the same structure as listingData
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

    // 用于处理表单提交的逻辑
    const handleSubmit = (e) => {
        e.preventDefault();
        // 这里添加将eventData提交到后端的逻辑
        console.log(eventData);
        // 根据实际情况进行调整
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
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="event-type-label">Event Type</InputLabel>
                                        <Select
                                            labelId="event-type-label"
                                            id="eventType"
                                            name="eventType"
                                            value={eventData.eventType}
                                            label="Event Type"
                                            // onChange={updateField}
                                            required
                                            // error={!!formErrors.eventType}
                                        >
                                            <MenuItem value={"Conference"}>Conference</MenuItem>
                                            <MenuItem value={"Seminar"}>Seminar</MenuItem>
                                            <MenuItem value={"Workshop"}>Workshop</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="duration"
                                        label="Duration (hours)"
                                        fullWidth
                                        value={eventData.duration}
                                        onChange={updateField}
                                        required
                                        type="number"
                                        error={!!formErrors.duration}
                                        helperText={formErrors.duration}
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
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default CreateNewEvent;

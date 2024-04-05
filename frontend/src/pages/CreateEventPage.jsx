import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import HeaderLogo from '../components/HeaderLogo';
import UnauthorizedAccess from "../components/UnauthorizedAccess";
import Autocomplete from '@mui/material/Autocomplete';





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
    const identity = localStorage.getItem('identity');
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [eventData, setEventData] = useState({
        title: '',
        address: '',
        price: '',
        thumbnail: '',
        eventType: 'concert',
        duration: '100',
        seatingCapacity: '64',
        youtubeUrl: '',
        startDate: '',
        endDate: '',
        organizerName: '',
        description: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    // const eventTypes = ['concert', 'conference', 'meeting', 'webinar'];


    const validateField = (name, value) => {
        const trimmedValue = typeof value === 'string' ? value.trim() : '';

        switch (name) {
            case 'title':
                if (!trimmedValue || trimmedValue.length < 3 || trimmedValue.length > 100) {
                    return 'Title must be between 3 and 100 characters.';
                }
                break;
            case 'address':
                if (!trimmedValue || trimmedValue.length < 10 || trimmedValue.length > 200) {
                    return 'Address must be between 10 and 200 characters.';
                }
                break;
            case 'price':
                if (!trimmedValue || isNaN(trimmedValue) || trimmedValue <= 0 || trimmedValue > 1000000) {
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
            case 'eventType':
                const eventTypes = ['concert', 'conference', 'meeting', 'webinar'];
                if (!eventTypes.includes(trimmedValue)) {
                    return 'Event type must be one of the following: concert, conference, meeting, webinar.';
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
                    if (date < startDate) {
                        return 'End date must be after the start date or to be the same.';
                    }
                }
                break;
            default:
                return '';
        }
    };


    // const updateField = (e) => {
    //     const { name, value } = e.target;
    //     const errorMessage = validateField(name, value);
    //     setEventData({ ...eventData, [name]: value });
    //     setFormErrors({ ...formErrors, [name]: errorMessage });
    // };
    const updateField = (e, newValue) => {
        let name, value;

        // 检查是否是 Autocomplete 调用
        if (e && e.target && newValue === undefined) {
            // 处理来自常规输入的调用
            name = e.target.name;
            value = e.target.value;
        } else {
            // 处理来自 Autocomplete 的调用
            name = 'eventType'; // Autocomplete 控制的字段名
            value = newValue; // 这里假设newValue是一个字符串
        }

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
        const hostId = localStorage.getItem('userId');
        const requestBody = {
            title: eventData.title,
            address: eventData.address,
            price: eventData.price,
            thumbnail: eventData.thumbnail, // Thumbnail in base64 format
            eventType: eventData.eventType,
            duration: eventData.duration,
            seatingCapacity: eventData.seatingCapacity,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
            youtubeUrl: eventData.youtubeUrl,
            organizerName: eventData.organizerName,
            description: eventData.description,
            hostId: hostId,

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

    const seatingOptions = [
        { label: '64', value: '64' },
        { label: '81', value: '81' },
        { label: '100', value: '100' },
        { label: '144', value: '144' },
        { label: '256', value: '256' },
    ];

    if (identity !== 'host') {
        return <UnauthorizedAccess theme={theme} />;
    }

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
                <HeaderLogo theme={theme} />
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
                                    <Autocomplete
                                        value={eventData.eventType}
                                        onChange={(event, newValue) => {
                                            // 直接指定更新 eventType
                                            setEventData({ ...eventData, eventType: newValue });
                                        }}

                                        options={['concert', 'conference', 'meeting', 'webinar']}
                                        getOptionLabel={(option) => option}
                                        isOptionEqualToValue={(option, value) => option === value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Event Type"
                                                variant="outlined"
                                            />
                                        )}
                                    />

                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        value={seatingOptions.find(option => option.value === eventData.seatingCapacity) || null}
                                        onChange={(event, newValue) => {
                                            setEventData({ ...eventData, seatingCapacity: newValue.value });
                                        }}

                                        options={seatingOptions}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Seating Capacity" variant="outlined" />
                                        )}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
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

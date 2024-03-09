//wenyima
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TextField, Button, Container, Typography, Grid, Box, IconButton, Card, CardContent, CardActions } from '@mui/material';

const CreateNewEvent = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [listingData, setListingData] = useState({
        title: '',
        address: '',
        price: '',
        thumbnail: '',
        propertyType: '',
        bathrooms: '',
        bedrooms: '',
        beds: '',
        amenities: '',
        youtubeUrl: '',
    });


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
            case 'propertyType':
                if (!value) {
                    return 'Property type is required.';
                }
                break;
            case 'bathrooms':
            case 'bedrooms':
            case 'beds':
                if (value <= 0 || !Number.isInteger(Number(value))) {
                    return 'Must be a positive integer.';
                }
                break;
            case 'youtubeUrl':
                if (value && !/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/.test(value)) {
                    return 'Invalid YouTube URL.';
                }
                break;
            default:
                return '';
        }
    };

    const updateField = (e) => {
        const { name, value } = e.target;
        const errorMessage = validateField(name, value);
        setListingData({ ...listingData, [name]: value });
        setFormErrors({ ...formErrors, [name]: errorMessage });
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
                    setListingData({ ...listingData, ...jsonData });
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
        setListingData({
            ...listingData,
            youtubeUrl: e.target.value,
        });
    };

    const handleBack = () => {
        navigate(-1);
    };
    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setListingData({ ...listingData, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const submitListing = async () => {
        const errors = Object.keys(listingData).reduce((acc, key) => {
            const error = validateField(key, listingData[key]);
            if (error) {
                acc[key] = error;
            }
            return acc;
        }, {});

        setFormErrors(errors);

        const token = localStorage.getItem('token');
        const requestBody = {
            title: listingData.title,
            address: listingData.address,
            price: listingData.price,
            thumbnail: listingData.thumbnail, // Thumbnail in base64 format
            metadata: {
                propertyType: listingData.propertyType,
                bathrooms: listingData.bathrooms,
                bedrooms: listingData.bedrooms,
                amenities: listingData.amenities,
                beds: listingData.beds,
                youtubeUrl: listingData.youtubeUrl,
            },
        };
        console.log('requestBody', requestBody);
        try {
            const response = await axios.post('http://localhost:5005/listings/new', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                // listingId
                console.log('Created listing ID:', response.data.listingId);
                navigate('/my-hosted-list');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('Invalid input: ' + error.response.data.error);
                } else if (error.response.status === 403) {
                    alert('Invalid Token: ' + error.response.data.error);
                }
            }
        }
    };
    return (
        <>
            <HostTopNavBar />
            <Container maxWidth="md" component="main" sx={{ mb: 4 }}>
                <IconButton onClick={handleBack} size="large" sx={{ mt: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Card raised sx={{ mt: 3 }}>
                    <CardContent>
                        <Box textAlign="center">
                            <Typography variant="h5" component="div" gutterBottom>
                                Create a New Listing
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="title"
                                    label="Listing Title"
                                    fullWidth
                                    value={listingData.title}
                                    onChange={updateField}
                                    required
                                    error={!!formErrors.title}
                                    helperText={formErrors.title}
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="address"
                                    label="Listing Address"
                                    fullWidth
                                    value={listingData.address}
                                    onChange={updateField}
                                    required
                                    error={!!formErrors.address}
                                    helperText={formErrors.address}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="price"
                                    label="Listing Price (per night)"
                                    fullWidth
                                    value={listingData.price}
                                    onChange={updateField}
                                    required
                                    type="number"
                                    error={!!formErrors.price}
                                    helperText={formErrors.price}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="property-type"
                                    name="propertyType"
                                    label="Property Type"
                                    value={listingData.propertyType}
                                    onChange={updateField}
                                    required
                                    error={!!formErrors.propertyType}
                                    helperText={formErrors.propertyType}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="bathrooms"
                                    label="Number of Bathrooms"
                                    fullWidth
                                    value={listingData.bathrooms}
                                    onChange={updateField}
                                    required
                                    type="number"
                                    error={!!formErrors.bathrooms}
                                    helperText={formErrors.bathrooms}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="bedrooms"
                                    label="Number of Bedrooms"
                                    fullWidth
                                    value={listingData.bedrooms}
                                    onChange={updateField}
                                    required
                                    type="number"
                                    error={!!formErrors.bedrooms}
                                    helperText={formErrors.bedrooms}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="beds"
                                    label="Number of Beds"
                                    fullWidth
                                    value={listingData.beds}
                                    onChange={updateField}
                                    required
                                    type="number"
                                    error={!!formErrors.beds}
                                    helperText={formErrors.beds}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="amenities"
                                    label="Amenities"
                                    fullWidth
                                    value={listingData.amenities}
                                    onChange={updateField}
                                    required
                                    multiline
                                    rows={4}
                                    error={!!formErrors.amenities}
                                    helperText={formErrors.amenities}
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
                                {listingData.thumbnail && (
                                    <Box mt={2} textAlign="center">
                                        <img src={listingData.thumbnail} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="youtubeUrl"
                                    label="YouTube Video URL"
                                    fullWidth
                                    value={listingData.youtubeUrl}
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
                        <Box width="100%" display="flex" justifyContent="center" p={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={submitListing}
                            >
                                Create Listing
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Container>
        </>
    );
};

export default CreateListingPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RegisterCustomer = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate(-1);
    };
    
    const [registerData, setRegisterData] = useState({
        Name: '',
        email: '',
        password: '',
        confirmPassword: '',
        cardNumber: '', // Assuming we're adding a card number for some reason
        cardCVC: '', // Assuming we're adding CVC for some reason
        cardExpirationDate: '', // Adding card expiration date in MM/YY format
    });

    const updateField = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleExpirationDateChange = (e) => {
        const { value } = e.target;
        let formattedValue = value.replace(
            /[^0-9]/g, '' // Remove non-digit characters
        ).substring(0, 4); // Limit length to 4 digits to fit MMYY

        if (formattedValue.length > 2) {
            formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
        }

        setRegisterData(prevState => ({
            ...prevState,
            cardExpirationDate: formattedValue
        }));
    };

    const registerUser = async (e) => {
        e.preventDefault();

        // Your existing validation and registration logic here

        try {
            const response = await axios.post('http://localhost:5005/user/auth/register', registerData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('Registration successful');
                navigate('/'); // Redirect to login page after successful registration
            }
        } catch (error) {
            // Check if the error has a response object
            if (error.response) {
                // Handle HTTP errors (errors with response from the server)
                alert(error.response.data.error || "An error occurred during registration.");
            } else {
                // Handle non-HTTP errors (e.g., network errors)
                alert("A network error occurred, or the server did not respond.");
            }
        }
    };

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
            {/* Content and styling similar to the provided structure */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Join Our Amazing Ticket Platform
                </Typography>
            </Box>
            <Box component="form" onSubmit={registerUser} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 600, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: theme.spacing(4), borderRadius: theme.shape.borderRadius }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Create Your Customer Account
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="Name"
                    label="Name"
                    name="Name"
                    autoComplete="name"
                    autoFocus
                    value={registerData.Name}
                    onChange={updateField}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={registerData.email}
                    onChange={updateField}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={registerData.password}
                    onChange={updateField}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={registerData.confirmPassword}
                    onChange={updateField}
                />
                {/* Assuming card details are needed for host registration */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="cardNumber"
                    label="Card Number"
                    value={registerData.cardNumber}
                    onChange={updateField}
                    inputProps={{ maxLength: 16 }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="cardCVC"
                    label="CVC"
                    value={registerData.cardCVC}
                    onChange={updateField}
                    inputProps={{ maxLength: 4 }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="cardExpirationDate"
                    label="Expiration Date (MM/YY)"
                    value={registerData.cardExpirationDate}
                    onChange={handleExpirationDateChange}
                    inputProps={{ maxLength: 5 }}
                />
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

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate('/login-customer')}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Box>
    );
};

export default RegisterCustomer;

//sijia han
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, useTheme } from '@mui/material';

const RegisterCustomer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        name:'',
        email: '',
        password: '',
        confirmPassword: '', // Add a field for confirming the password
    });

    const updateField = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const registerUser = async (e) => {
        e.preventDefault();

        // Ensure password and confirmPassword match
        if (registerData.password !== registerData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const userInfo = {
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
        };

        try {
            const response = await axios.post('http://localhost:5005/user/auth/register', userInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('Registration successful');
                navigate('/login'); // Redirect to login page after successful registration
            }
        } catch (errorResponse) {
            alert(errorResponse.response.data.error);
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
            {/* Content similar to the login page, adjusted for registration */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Join Our Amazing Ticket Platform
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', maxWidth: 1200 }}>
                <Box sx={{ color: 'white', width: '40%', p: 3, background: 'rgba(0, 0, 0, 0.5)', borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'medium' }}>
                        Sign up to discover the best events near you
                    </Typography>
                </Box>

                <Box sx={{
                    width: '40%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: theme.shape.borderRadius,
                    p: theme.spacing(4),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Create Your Account
                    </Typography>

                    <Box component="form" onSubmit={registerUser} noValidate sx={{ mt: 1 }}>
                    <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={registerData.name}
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
                            autoFocus
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
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterCustomer;

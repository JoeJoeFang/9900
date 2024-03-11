import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, useTheme, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import zxcvbn from 'zxcvbn';
import DatePicker from '@mui/lab/DatePicker'; 


const RegisterCustomer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [expirationDate, setExpirationDate] = useState(null); 

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const isDateValid = (date) => {
        const today = new Date();
        const selectedDate = new Date(date);
        return selectedDate > today;
      };

    const updateField = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const validateEmail = (email) => {
        return RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i).test(String(email).toLowerCase());
    };    

    const registerUser = async (e) => {
        e.preventDefault();

        if (!validateEmail(registerData.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const passwordStrength = zxcvbn(registerData.password);
        if (passwordStrength.score < 1) {
            alert("Password is too weak.You need short word combinations or more common replacement characters");
            return;
        }
        if (!isDateValid(expirationDate)) {
        alert("The expiration date must be in the future.");
        return;
        }
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
                navigate('/');
            }
        } catch (errorResponse) {
            alert(errorResponse.response.data.error);
        }
    } 

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
    {/* 这里开始是其余组件内容 */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
        <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
        <Box component="form" onSubmit={registerUser} noValidate sx={{ mt: 1 }}>
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
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={registerData.name}
                    onChange={updateField}
                />
                <DatePicker
            label="Expiration Date"
            value={expirationDate}
            onChange={(newValue) => {
                setExpirationDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
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
                    onClick={() => navigate('/login-customer')}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Box>
    </Box>
</Box>
</Box>
);
};
export default RegisterCustomer
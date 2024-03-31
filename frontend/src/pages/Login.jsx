//wenyima
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {TextField, Button, Typography, Box, useTheme, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HeaderLogo from '../components/HeaderLogo';

export const LoginCustomer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleBack = () => {
        navigate(-1);
    };

    const updateField = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const loginUser = async (e) => {
        e.preventDefault();

        const loginInfo = {
            email: loginData.email,
            password: loginData.password,
        };

        try {
            const response = await axios.post('http://localhost:5005/user/auth/login', loginInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userEmail', loginInfo.email);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('identity', 'customer');
                console.log(response);
                navigate('/all-event');
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

            <Box sx={{ display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: 1200,
                px: theme.spacing(5),
                gap: theme.spacing(3) }}>
                <Box sx={{ color: 'white', width: '40%', p: 3, background: 'transparent', borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'medium' }}>
                        The best way to book an event and know all about
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                        Start your booking with us and join our community!
                    </Typography>
                </Box>

                <Box sx={{
                    width: '60%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: theme.shape.borderRadius,
                    p: theme.spacing(4),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Sign Up & Start Your Free Trial
                    </Typography>

                    <Typography component="h1" variant="h5">Login for Customer</Typography>
                    <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={loginData.email}
                            onChange={updateField}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={loginData.password}
                            onChange={updateField}
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: 'darken', boxShadow: 'none' } }}
                        >
                            Login
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/register-customer')}
                        >
                            Don't have an account? Register
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export const LoginHost = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const handleBack = () => {
        navigate(-1);
    };

    const updateField = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const loginUser = async (e) => {
        e.preventDefault();

        const loginInfo = {
            email: loginData.email,
            password: loginData.password,
        };

        try {
            const response = await axios.post('http://localhost:5005/user/auth/login', loginInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userEmail', loginInfo.email);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('identity', 'host');
                console.log(response);
                navigate('/all-event');
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
            {/* 商标图片和平台标题 */}
            <HeaderLogo theme={theme} />

            {/* 内容容器 */}
            <Box sx={{ display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: 1200,
                px: theme.spacing(5),
                gap: theme.spacing(3) }}>
                <Box sx={{ color: 'white', width: '40%', p: 3, background: 'transparent', borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'medium' }}>
                        The best way to host an event and know all about
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                        Start your events with us and join our community!
                    </Typography>
                </Box>

                {/* 按钮容器 */}
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
                        Sign Up & Start Your Free Trial
                    </Typography>

                    <Typography component="h1" variant="h5">Login for Host</Typography>
                    <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={loginData.email}
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
                            autoComplete="current-password"
                            value={loginData.password}
                            onChange={updateField}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        {/* Add a button for navigating to the RegisterPage */}
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/register-host')}
                        >
                            Don&apos;t have an account? Register
                        </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    );

};

// export default LoginHost;


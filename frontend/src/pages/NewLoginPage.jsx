import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, Paper, Tab, Tabs, IconButton, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HeaderLogo from '../components/HeaderLogo';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`login-tabpanel-${index}`}
            aria-labelledby={`login-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const CombinedLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('identity');

    const theme = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
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

        const endpoint = activeTab === 0 ? 'customer' : 'host';
        const identity = activeTab === 0 ? 'customer' : 'host';

        try {
            const response = await axios.post(`http://localhost:5005/user/auth/login`, {
                email: loginData.email,
                password: loginData.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userEmail', loginData.email);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('identity', identity);
                navigate('/all-event');
            }
        } catch (errorResponse) {
            alert(errorResponse.response.data.error);
        }
    };

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container component="main" sx={{
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
            <HeaderLogo theme={theme}/>

            <Paper elevation={6} sx={{
                width: '60%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: theme.shape.borderRadius,
                p: theme.spacing(4),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}>
                <Tabs value={activeTab} onChange={handleChangeTab} centered>
                    <Tab label="Customer Login" />
                    <Tab label="Host Login" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                    <Typography component="h1" variant="h5" align="center">
                        Customer Login
                    </Typography>
                    {/* Customer Login Form Here */}
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Typography component="h1" variant="h5" align="center">
                        Host Login
                    </Typography>
                    {/* Host Login Form Here */}
                </TabPanel>

                <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1, px: 4 }}>
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
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Login
                    </Button>
                    <Button fullWidth variant="text" onClick={() => navigate(`/${activeTab === 0 ? 'register-customer' : 'register-host'}`)}>
                        Don't have an account? Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CombinedLogin;
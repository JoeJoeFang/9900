// 在 UnauthorizedAccess.js 文件中

import React from 'react';
import {Container, Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';


const UnauthorizedAccess = ({ theme }) => {
    const navigate = useNavigate();

    return (
        <Container sx={{
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
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2, // Provides space between items
                textAlign: 'center',
            }}>
                <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main' }} />
                <Typography variant="h5" gutterBottom>
                    You do not have permission to view this page.
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Please explore other areas of our platform.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/all-event')} sx={{ mt: 2 }}>
                    Go to All Events
                </Button>
            </Box>
        </Container>
    );
};

export default UnauthorizedAccess;

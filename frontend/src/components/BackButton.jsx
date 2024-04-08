import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, IconButton } from '@mui/material';
import { createTheme } from '@mui/material/styles';

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

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(-1);
        if (location.pathname === '/login-customer' || location.pathname === '/login-host') {
            // 清除localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('identity');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <IconButton
                onClick={handleBack}
                size="large"
                sx={{
                    position: 'fixed',
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
                {/*<ArrowBackIcon sx={{ fontSize: 28 }} />*/}
                <img src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} alt="Logo" style={{ width: 80, height: 'auto' }} />
            </IconButton>
        </ThemeProvider>
    );
};

export default BackButton;
